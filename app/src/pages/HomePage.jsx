import { useMutation } from "@apollo/client";
import toast from "react-hot-toast";
import { CREATE_WATER } from "../graphql/mutations/water.mutation";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HomePage() {
  const { authUser } = useAuth();

  const [createWater, { loadingWater, error }] = useMutation(CREATE_WATER);

  const handleAddWater = async () => {
    try {
      const response = await createWater({
        variables: {
          input: {
            quantity: 1,
            date: new Date().toISOString().split("T")[0],
            userId: authUser?._id,
          },
        },
      });

      const message = response.data.createWater.message;
      toast.success(message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const [steps, setSteps] = useState(Array(8).fill(0));
  const frames = [
    "../../public/glass/fase-1.png",
    "../../public/glass/fase-2.png",
    "../../public/glass/fase-3.png",
    "../../public/glass/fase-4.png",
    "../../public/glass/fase-5.png",
    "../../public/glass/fase-6.png",
    "../../public/glass/fase-7.png",
    "../../public/glass/fase-8.png",
  ];

  const handleClick = (index) => {
    let currentStep = 0;
    const newSteps = [...steps];
    newSteps[index] = currentStep;
    setSteps(newSteps);
    handleAddWater();

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= frames.length) {
        clearInterval(interval);
      } else {
        newSteps[index] = currentStep;
        setSteps([...newSteps]);
      }
    }, 100); // Tempo entre frames
  };

  const dataWater = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Water Consumption (L)",
        data: [2, 2.5, 3, 2, 2.8, 3.2, 2.7],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };
  const dataFood = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Food Consumption (kcal)",
        data: [2000, 2200, 2100, 2300, 2400, 2500, 2200],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };
  const dataExercise = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Exercise History (mins)",
        data: [30, 45, 60, 40, 50, 70, 60],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  return (
    <div>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Home Page</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 col-span-2">
            <h2 className="text-xl font-bold">Hello {authUser?.name}</h2>
            <img
              className="w-11 h-11 rounded-full border cursor-pointer"
              src={authUser?.profilePicture}
              alt="profile"
            />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 ">
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 col-span-1">
            <h2 className="text-xl font-bold">Water Consumption</h2>
            <Line data={dataWater} />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 col-span-1">
            <h2 className="text-xl font-bold">Food Consumption</h2>
            <Line data={dataFood} />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 col-span-1">
            <h2 className="text-xl font-bold">Exercise History</h2>
            <Line data={dataExercise} />
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 col-span-3">
            <h3 className="text-xl font-bold">Daily Water</h3>
            <div className="flex space-x-2 mt-4">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  disabled={loadingWater}
                  style={{
                    width: "25px",
                    height: "50px",
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => handleClick(index)}
                >
                  <AnimatePresence>
                    <motion.img
                      key={steps[index]}
                      src={frames[steps[index]]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
