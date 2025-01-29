import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { CREATE_FOOD } from "../graphql/mutations/food.mutation";
import { useMutation, useQuery } from "@apollo/client";
import { useAuth } from "../context/AuthContext";

export default function FoodListPage() {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categories, setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get(
          "https://db-food-eight.vercel.app/foods"
        );
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

  const sortedFoods = [...filteredFoods].sort((a, b) => {
    if (sortOrder === "nameAsc") {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === "nameDesc") {
      return b.name.localeCompare(a.name);
    } else if (sortOrder === "caloriesAsc") {
      return a.calories - b.calories;
    } else if (sortOrder === "caloriesDesc") {
      return b.calories - a.calories;
    }
    return 0;
  });

  const { authUser } = useAuth();
  const [createFood, { loading: loadingFood, error }] =
    useMutation(CREATE_FOOD);

  const handleAddFood = async () => {
    try {
      const response = await createFood({
        variables: {
          input: {
            userId: authUser?._id,
            name: selectedFood.name,
            calories: selectedFood.calories,
            date: new Date().toISOString().split("T")[0],
            quantity: quantity,
            image: selectedFood.image,
            foodId: selectedFood.id,
          },
        },
      });

      const message = response.data.createFood.message;
      toast.success(message);
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const openModal = (food) => {
    setSelectedFood(food);
    setQuantity(1);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Food List</h1>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-4">
          <input
            type="text"
            placeholder="Search for food..."
            className="border border-gray-300 p-2 w-full md:w-1/1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-gray-300 p-2 w-full md:w-1/6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 md:mb-0"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 p-2 w-full md:w-1/6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="nameAsc">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
            <option value="caloriesAsc">Calories (Lowest to Highest)</option>
            <option value="caloriesDesc">Calories (Highest to Lowest)</option>
          </select>
        </div>

        <div className="mt-4 h-140 overflow-y-auto border border-gray-300 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {sortedFoods.length > 0 ? (
              sortedFoods.map((food) => (
                <div
                  key={food.id}
                  className="border border-gray-300 rounded-lg p-4 hover:bg-gray-100"
                >
                  <Link to={`/food/${food.id}`}>
                    <img
                      src={food.image}
                      alt={food.name}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                    />
                    <h2 className="text-xl font-bold">{food.name}</h2>
                    <p className="text-gray-500">{food.category}</p>
                    <p className="text-gray-500">{food.calories} calories</p>
                  </Link>
                  <button
                    className="mt-2 bg-blue-500 text-white py-1 px-4 rounded cursor-pointer"
                    onClick={() => openModal(food)}
                  >
                    Add
                  </button>
                </div>
              ))
            ) : (
              <p className="p-4 text-center text-gray-500">No results found.</p>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white p-6 rounded-lg ">
            <h2 className="text-xl font-bold mb-4 flex justify-center">
              {selectedFood.name}
            </h2>
            <div className="flex items-center mb-4 justify-center">
              <button
                className="bg-gray-300 text-gray-700 py-1 px-3 rounded-l cursor-pointer"
                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
              >
                -
              </button>
              <span className="px-4">{quantity}</span>
              <button
                className="bg-gray-300 text-gray-700 py-1 px-3 rounded-r cursor-pointer"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded mr-2 cursor-pointer"
              onClick={handleAddFood}
            >
              Confirm
            </button>
            <button
              className="bg-gray-500 text-white py-2 px-4 rounded cursor-pointer"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
