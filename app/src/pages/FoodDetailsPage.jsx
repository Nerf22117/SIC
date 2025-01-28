import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

import dailyReference from "../../utils/dailyReference";

export default function FoodDetailsPage() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [percentages, setPercentages] = useState({});

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/foodItems/${id}`
        );
        setFood(response.data);

        const calculatedPercentages = dailyReference(response.data);
        setPercentages(calculatedPercentages);
      } catch (error) {
        console.error(error);
      }
    };

    fetchFoodDetails();
  }, [id]);

  if (!food) return <p>Loading...</p>;

  const chartData = {
    labels: ["Carbohydrates", "Fat", "Protein", "Sugar", "Salt"],
    datasets: [
      {
        label: "Nutritional Values (g)",
        data: [
          food.carbohydrates,
          food.fat,
          food.protein,
          food.sugar,
          food.salt,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData2 = {
    labels: ["Food Calories", "Recommended Daily Intake"],
    datasets: [
      {
        label: "Calories",
        data: [food.calories, 2000],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md flex flex-col lg:flex-row">
      <div className="flex-1 mb-4 lg:mb-0">
        <h1 className="text-3xl font-bold text-center mb-4">{food.name}</h1>
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />

        <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md">
          <h2 className="text-xl font-semibold text-center">
            Nutritional Facts
          </h2>
          <div className="border-t border-gray-300 my-2"></div>
          <ul className="list-disc list-inside">
            <ul>
              <strong>Quantity:</strong> {food.quantity}g
            </ul>
          </ul>
          <div className="border-t border-gray-300 my-2"></div>
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Nutrient</th>
                <th className="border border-gray-300 p-2">Per Dose</th>
                <th className="border border-gray-300 p-2">
                  % Daily Reference
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Energy(kj/kcal)</td>
                <td className="border border-gray-300 p-2">
                  {food.energy_kj} kj / {food.calories} kcal
                </td>
                <td className="border border-gray-300 p-2">
                  {percentages.calories}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Carbohydrates</td>
                <td className="border border-gray-300 p-2">
                  {food.carbohydrates}g
                </td>
                <td className="border border-gray-300 p-2">
                  {percentages.carbohydrates}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Fat</td>
                <td className="border border-gray-300 p-2">{food.fat}g</td>
                <td className="border border-gray-300 p-2">
                  {percentages.fat}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Protein</td>
                <td className="border border-gray-300 p-2">{food.protein}g</td>
                <td className="border border-gray-300 p-2">
                  {percentages.protein}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Sugar</td>
                <td className="border border-gray-300 p-2">{food.sugar}g</td>
                <td className="border border-gray-300 p-2">
                  {percentages.sugar}%
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Salt</td>
                <td className="border border-gray-300 p-2">{food.salt}g</td>
                <td className="border border-gray-300 p-2">
                  {percentages.salt}%
                </td>
              </tr>
            </tbody>
          </table>
          <div className="border-t border-gray-300 my-2"></div>
          <p className="text-sm text-gray-500">
            * Reference dose for an average adult (8400 kJ / 2000 kcal).
          </p>
        </div>
      </div>

      <div className="flex-1 lg:w-full mt-13 ml-5">
        <div className="flex-row mb-4">
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md mb-4">
            <h2 className="text-xl font-semibold">Vitamins</h2>
            <p>{food.vitamins.join(", ")}</p>
            <h2 className="text-xl font-semibold">Minerals</h2>
            <p>{food.minerals.join(", ")}</p>
            <h2 className="text-xl font-semibold">Health Benefits</h2>
            <p>{food.healthBenefits.join(", ")}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md w-1/2 mr-2">
            <h2 className="text-xl font-semibold text-center">
              Calorie Breakdown
            </h2>
            <Pie data={chartData} />
          </div>
          <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-md w-1/2 ml-2">
            <h2 className="text-xl font-semibold text-center">
              Calories vs Daily Intake
            </h2>
            <Bar
              data={barChartData2}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  title: {
                    display: true,
                    text: "Calories vs IDR (Daily Reference)",
                  },
                },
              }}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
