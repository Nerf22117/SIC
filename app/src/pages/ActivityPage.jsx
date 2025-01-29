import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_FOODS } from "../graphql/queries/food.query";
import { GET_USER_EXERCISES, GET_EXERCISE_USER_CATEGORIES } from "../graphql/queries/exercise.query.js";
import { toast } from "react-hot-toast";

export default function ActivityPage() {
    const [searchFood, setSearchFood] = useState("");
    const [orderFood, setOrderFood] = useState("");
    const [foodPage, setFoodPage] = useState(1);

    const [searchExercise, setSearchExercise] = useState("");
    const [orderExercise, setOrderExercise] = useState("");
    const [exercisePage, setExercisePage] = useState(1);

    const [muscularGroup, setMuscularGroup] = useState("");

    const { authUser } = useAuth();

    const { data: dataUserFood, loading: loadingUserFood, error: errorUserFood, refetch: refetchUserFood } = useQuery(GET_USER_FOODS, {
        variables: {
            input: { userId: authUser?._id },
            search: searchFood,
            order: orderFood || null,
            limit: 4,
            offset: (foodPage - 1) * 4,
        },
    });

    const { data: dataUserExercise, loading: loadingUserExercise, error: errorUserExercise, refetch: refetchUserExercise } = useQuery(GET_USER_EXERCISES, {
        variables: {
            input: { userId: authUser?._id },
            search: searchExercise,
            order: orderExercise || null,
            limit: 4,
            offset: (exercisePage - 1) * 4,
            category: muscularGroup === "All" ? "" : muscularGroup,
        },
    });

    const { data: dataMuscularGroups } = useQuery(GET_EXERCISE_USER_CATEGORIES, {
        variables: { getUserExerciseCategoryId: authUser?._id },
    });

    useEffect(() => {
        refetchUserFood();
    }, [searchFood, orderFood, foodPage, refetchUserFood]);

    useEffect(() => {
        refetchUserExercise();
    }, [searchExercise, orderExercise, exercisePage, muscularGroup, refetchUserExercise]);

    if (loadingUserFood || loadingUserExercise) return <p>Loading...</p>;
    if (errorUserFood || errorUserExercise) return toast.error("An error occurred. Please try again.");

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Activity</h1>
            <div className="mb-2">
                <h2 className="text-xl font-bold mb-2">Food</h2>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                    <input
                        type="text"
                        placeholder="Search for food..."
                        className="border border-gray-300 p-2 w-full md:w-2/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 md:mb-0"
                        value={searchFood}
                        onChange={(e) => setSearchFood(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 p-2 w-full md:w-1/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={orderFood}
                        onChange={(e) => setOrderFood(e.target.value)}
                    >
                        <option value="">Sort by</option>
                        <option value="NAME_ASC">Name (A-Z)</option>
                        <option value="NAME_DESC">Name (Z-A)</option>
                        <option value="CALORIES_ASC">Calories (Lowest to Highest)</option>
                        <option value="CALORIES_DESC">Calories (Highest to Lowest)</option>
                        <option value="QUANTITY_ASC">Quantity (Lowest to Highest)</option>
                        <option value="QUANTITY_DESC">Quantity (Highest to Lowest)</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {dataUserFood?.getUserFoods?.result?.length > 0 ? (
                        dataUserFood.getUserFoods.result.map((food) => (
                            <div key={food._id} className="border border-gray-300 rounded-lg p-2 hover:bg-gray-100">
                                <Link to={`/food/${food.foodId}`}>
                                    <img
                                        src={food.image}
                                        alt={food.name}
                                        className="w-full h-24 object-cover rounded-lg mb-2"
                                    />
                                    <h2 className="text-lg font-bold">{food.name}</h2>
                                    <p className="text-gray-500 text-sm">{food.category}</p>
                                    <p className="text-gray-500 text-sm">{food.calories} calories</p>
                                    <p className="text-gray-500 text-sm">Quantity: {food.quantity}</p>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-center text-gray-500">No results found.</p>
                    )}
                </div>
                <div className="flex justify-center mt-2">
                    <button
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg mr-2"
                        onClick={() => setFoodPage((prev) => Math.max(prev - 1, 1))}
                        disabled={foodPage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                        onClick={() => setFoodPage((prev) => prev + 1)}
                        disabled={dataUserFood?.getUserFoods?.result?.length < 4}
                    >
                        Next
                    </button>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-2">Exercises</h2>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                    <input
                        type="text"
                        placeholder="Search for exercise..."
                        className="border border-gray-300 p-2 w-full md:w-2/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 md:mb-0"
                        value={searchExercise}
                        onChange={(e) => setSearchExercise(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 p-2 w-full md:w-1/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 md:mb-0"
                        value={muscularGroup}
                        onChange={(e) => setMuscularGroup(e.target.value)}
                    >
                        <option value="" selected>All</option>
                        {dataMuscularGroups?.getUserExerciseCategory?.result?.map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>
                    <select
                        className="border border-gray-300 p-2 w-full md:w-1/3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={orderExercise}
                        onChange={(e) => setOrderExercise(e.target.value)}
                    >
                        <option value="">Sort by</option>
                        <option value="NAME_ASC">Name (A-Z)</option>
                        <option value="NAME_DESC">Name (Z-A)</option>
                        <option value="CALORIES_ASC">Calories (Lowest to Highest)</option>
                        <option value="CALORIES_DESC">Calories (Highest to Lowest)</option>
                    </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {dataUserExercise?.getUserExercises?.result?.length > 0 ? (
                        dataUserExercise.getUserExercises.result.map((exercise) => (
                            <div key={exercise._id} className="border border-gray-300 rounded-lg p-2 hover:bg-gray-100">
                                <img
                                    src={exercise.gif}
                                    alt={exercise.activity}
                                    className="w-full h-24 object-cover rounded-lg mb-2"
                                />
                                <h2 className="text-lg font-bold">{exercise.activity}</h2>
                                <p className="text-gray-500 text-sm">{exercise.duration} minutes</p>
                                <p className="text-gray-500 text-sm">{exercise.calories} calories</p>
                                <p className="text-gray-500 text-sm">Muscular Group: {exercise.muscularGroup}</p>
                            </div>
                        ))
                    ) : (
                        <p className="p-4 text-center text-gray-500">No results found.</p>
                    )}
                </div>
                <div className="flex justify-center mt-4">
                    <button
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg mr-2"
                        onClick={() => setExercisePage((prev) => Math.max(prev - 1, 1))}
                        disabled={exercisePage === 1}
                    >
                        Previous
                    </button>
                    <button
                        className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg"
                        onClick={() => setExercisePage((prev) => prev + 1)}
                        disabled={dataUserExercise?.getUserExercises?.result?.length < 4}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}