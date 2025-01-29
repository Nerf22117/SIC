import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@apollo/client";
import { GET_USER_FOODS } from "../graphql/queries/food.query";
import { GET_USER_EXERCISES } from "../graphql/queries/exercise.query.js";
import { toast } from "react-hot-toast";

export default function FoodListPage() {
    const [searchFood, setSearchFood] = useState("");
    const [orderFood, setOrderFood] = useState("");

    const [searchExercise, setSearchExercise] = useState("");
    const [orderExercise, setOrderExercise] = useState("");

    const { authUser } = useAuth();

    const { data: dataUserFood, loading: loadingUserFood, error: errorUserFood, refetch: refetchUserFood } = useQuery(GET_USER_FOODS, {
        variables: {
            input: { userId: authUser?._id },
            search: searchFood,
            order: orderFood || null,
            limit: 10,
            offset: 0,
        },
    });

    const { data: dataUserExercise, loading: loadingUserExercise, error: errorUserExercise, refetch: refetchUserExercise } = useQuery(GET_USER_EXERCISES, {
        variables: {
            input: { userId: authUser?._id },
            search: searchExercise,
            order: orderExercise || null,
            limit: 10,
            offset: 0,
        },
    });

    useEffect(() => {
        refetchUserFood();
    }, [searchFood, orderFood, refetchUserFood]);

    useEffect(() => {
        refetchUserExercise();
    }, [searchExercise, orderExercise, refetchUserExercise]);

    if (loadingUserFood || loadingUserExercise) return <p>Loading...</p>;
    if (errorUserFood || errorUserExercise) return toast.error("An error occurred. Please try again.");

    return (
        <div >
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Activity</h1>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search for food..."
                        className="border border-gray-300 p-2 w-full md:w-1/1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
                        value={searchFood}
                        onChange={(e) => setSearchFood(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 p-2 w-full md:w-1/6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <div className="mt-4 h-140 overflow-y-auto border border-gray-300 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {dataUserFood?.getUserFoods?.result?.length > 0 ? (
                            dataUserFood.getUserFoods.result.map((food) => (
                                <div key={food._id} className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100">
                                    <Link to={`/food/${food._id}`}>
                                        <img
                                            src={food.image}
                                            alt={food.name}
                                            className="w-full h-32 object-cover rounded-lg mb-4"
                                        />
                                        <h2 className="text-xl font-bold">{food.name}</h2>
                                        <p className="text-gray-500">{food.category}</p>
                                        <p className="text-gray-500">{food.calories} calories</p>
                                        <p className="text-gray-500">Quantity: {food.quantity}</p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-500">No results found.</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Exercises</h1>
                <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search for exercise..."
                        className="border border-gray-300 p-2 w-full md:w-1/1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
                        value={searchExercise}
                        onChange={(e) => setSearchExercise(e.target.value)}
                    />
                    <select
                        className="border border-gray-300 p-2 w-full md:w-1/6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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

                <div className="mt-4 h-140 overflow-y-auto border border-gray-300 rounded-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {dataUserExercise?.getUserExercises?.result?.length > 0 ? (
                            dataUserExercise.getUserExercises.result.map((exercise) => (
                                <div key={exercise._id} className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100">
                                    <img
                                        src={exercise.image}
                                        alt={exercise.activity}
                                        className="w-full h-32 object-cover rounded-lg mb-4"
                                    />
                                    <h2 className="text-xl font-bold">{exercise.activity}</h2>
                                    <p className="text-gray-500">{exercise.duration} minutes</p>
                                    <p className="text-gray-500">{exercise.calories} calories</p>
                                    <p className="text-gray-500">Quantity: {exercise.quantity}</p>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-500">No results found.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
