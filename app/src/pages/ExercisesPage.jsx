import { useState, useEffect } from "react";
import { getExercises } from "../api/exercises/api";

export default function ExercisesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [muscularGroup, setMuscularGroup] = useState("");
    const [products, setProducts] = useState([]);
    const [muscularGroups, setMuscularGroups] = useState([]);

    useEffect(() => {
        getExercises().then((data) => {
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
                    product.muscular_group.toLowerCase().includes(muscularGroup.toLowerCase())
                );
            }

            setProducts(filteredData);
        });
    }, [searchQuery, muscularGroup]);

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
