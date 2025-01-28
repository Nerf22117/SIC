import { useState, useEffect } from "react";
import { getExercises } from "../api/exercises/api";
import { CREATE_EXERCISE } from "../graphql/mutations/exercise.mutation";
import { useMutation } from "@apollo/client";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ExercisesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [muscularGroup, setMuscularGroup] = useState("");
    const [products, setProducts] = useState([]);
    const [muscularGroups, setMuscularGroups] = useState([]);
    const [durations, setDurations] = useState([]);
    const [createExercise, { loading, error }] = useMutation(CREATE_EXERCISE);
    const { authUser } = useAuth();

    useEffect(() => {
        getExercises().then((data) => {
            console.log("Data", data);
            const uniqueMuscularGroups = [
                ...new Set(data.map((product) => product.muscular_group)),
            ];
            setMuscularGroups(uniqueMuscularGroups);

            let filteredData = data;

            if (searchQuery) {
                filteredData = data.filter((product) =>
                    product.activity.toLowerCase().includes(searchQuery.toLowerCase())
                );
            }

            if (muscularGroup) {
                filteredData = filteredData.filter((product) =>
                    product.muscular_group
                        .toLowerCase()
                        .includes(muscularGroup.toLowerCase())
                );
            }

            setProducts(filteredData);
        });
    }, [searchQuery, muscularGroup]);

    const handleAdd = async (id) => {
        const exercise = products.find((product) => product.id === id);
        const input = {
            activity: exercise.activity,
            calories: exercise.calories_per_hour,
            date: new Date().toISOString().split("T")[0],
            duration: durations[id],
            userId: authUser?._id,
        };

        try {
            await createExercise({ variables: { input } });
            toast.success("Exercise added to workout.");
        } catch (err) {
            toast.error(error.message);
        }
    };

    const decrementDuration = (id) => {
        setDurations((prev) => {
            const newDurations = { ...prev };
            newDurations[id] = newDurations[id] ? newDurations[id] - 1 : 0;
            return newDurations;
        });
    };

    const incrementDuration = (id) => {
        setDurations((prev) => {
            const newDurations = { ...prev };
            newDurations[id] = newDurations[id] ? newDurations[id] + 1 : 1;
            return newDurations;
        });
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h1 className="text-2xl font-bold mb-6">Exercises</h1>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    />
                </div>
                <div className="mb-6">
                    <select
                        value={muscularGroup}
                        onChange={(e) => setMuscularGroup(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 p-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                    >
                        <option value="">Select muscular group</option>
                        {muscularGroups.map((group) => (
                            <option key={group} value={group}>
                                {group}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <a key={product.id} className="group">
                            <img
                                src={product.gif}
                                className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
                            />
                            <h3 className="mt-4 text-lg text-gray-900">{product.activity}</h3>
                            <p className="mt-1 text-sm font-medium text-gray-700">Calories per hour:{product.calories_per_hour}</p>
                            <p className="mt-1 text-sm font-medium text-gray-700">Muscular group:{product.muscular_group}</p>
                            <div className="mt-4 flex items-center space-x-2">
                                <button
                                    className="px-2 py-1 bg-gray-300 text-gray-900 rounded-lg"
                                    onClick={() => decrementDuration(product.id)}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    className="w-16 p-1 text-center border border-gray-300 rounded-lg"
                                    value={durations[product.id] || 0}
                                    onChange={(e) => setDurations({ ...durations, [product.id]: e.target.value })}
                                />
                                <button
                                    className="px-2 py-1 bg-gray-300 text-gray-900 rounded-lg"
                                    onClick={() => incrementDuration(product.id)}
                                >
                                    +
                                </button>
                            </div>
                            <button
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
                                onClick={() => handleAdd(product.id)}
                                disabled={loading}
                            >
                                Add to workout
                            </button>
                        </a>
                    ))}
                </div>

                {products.length === 0 && (
                    <p className="text-gray-500 mt-4">No exercises found.</p>
                )}
            </div>
        </div>
    );
}
