import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function FoodListPage() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("http://localhost:3002/foodItems");
        setFoods(response.data);
        const uniqueCategories = [
          "All",
          ...new Set(response.data.map((food) => food.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFoods();
  }, []);

  const filteredFoods = foods.filter((food) => {
    const matchesSearchTerm = food.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || food.category === selectedCategory;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Food List</h1>
        <input
          type="text"
          placeholder="Search for food..."
          className="border border-gray-300 p-2 mt-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border border-gray-300 p-2 mt-4 w-full"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div
          className="mt-4 h-150 overflow-y-auto border border-gray-300 rounded-lg"
          style={{ maxHeight: "800px" }}
        >
          {filteredFoods.map((food) => (
            <Link
              to={`/food/${food.id}`}
              key={food.id}
              className="border-b border-gray-200 p-4 block hover:bg-gray-100"
            >
              <h2 className="text-xl font-bold">{food.name}</h2>
              <p className="text-gray-500">{food.category}</p>
              <p className="text-gray-500">{food.calories} calories</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
