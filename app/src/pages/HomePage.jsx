import { useMutation, useSubscription, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import {
  CREATE_WATER,
  REMOVE_WATER,
} from "../graphql/mutations/water.mutation";
import {
  GET_WATER_INTAKE,
  GET_WATER_OBJECTIVE_DAY,
} from "../graphql/queries/water.query";
import { HYDRATION_REMINDER } from "../graphql/subscriptions/user.subscriptions";
import { useAuth } from "../context/AuthContext";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GraphWater from "../components/ui/GraphWater";
import GraphFood from "../components/ui/GraphFood";
import GraphExercise from "../components/ui/GraphExercise";
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

  const [createWater, { loading: loadingWater }] = useMutation(CREATE_WATER);
  const [removeWater] = useMutation(REMOVE_WATER);

  useSubscription(HYDRATION_REMINDER, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log("Received subscription data:", subscriptionData);
      if (subscriptionData.data?.hydrationReminder) {
        const message = subscriptionData.data.hydrationReminder.message;
        toast.success(message);
      } else {
        console.warn("No hydrationReminder data received.");
      }
    },
  });

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
      refetchWaterIntake();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleRemoveWater = async () => {
    try {
      const response = await removeWater({
        variables: {
          input: {
            quantity: 1,
            date: new Date().toISOString().split("T")[0],
            userId: authUser?._id,
          },
        },
      });

      const message = response.data.removeWater.message;
      toast.success(message);
      refetchWaterIntake();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const userId = authUser?._id;
  const date = new Date().toISOString().split("T")[0];

  const {
    data: dataWaterIntake,
    loading: loadingGetWater,
    error: errorGetWater,
    refetch: refetchWaterIntake,
  } = useQuery(GET_WATER_INTAKE, {
    variables: { date, userId },
  });

  const {
    data: dataWaterObjective,
    loading: loadingGetWaterObjective,
    error: errorGetWaterObjective,
  } = useQuery(GET_WATER_OBJECTIVE_DAY, {
    variables: { id: userId },
  });

  const waterIntakeInLiters = dataWaterIntake?.getUserWaterIntake?.result
    ?.quantity
    ? (dataWaterIntake.getUserWaterIntake.result.quantity * 0.25).toFixed(2)
    : "0.00";

  const waterObjective = dataWaterObjective?.getUserInfo?.result?.water
    ? dataWaterObjective.getUserInfo.result.water.toFixed(2)
    : "0.00";

  const numCups = Math.ceil(waterObjective / 0.25);

  const [steps, setSteps] = useState(Array(numCups).fill(0));
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

  useEffect(() => {
    if (dataWaterIntake) {
      const waterIntake = dataWaterIntake.getUserWaterIntake.result.quantity;
      const newSteps = Array(numCups).fill(0);
      for (let i = 0; i < waterIntake; i++) {
        newSteps[i] = frames.length - 1;
      }
      setSteps(newSteps);
    }
  }, [dataWaterIntake, numCups]);

  const animateAddWater = (index) => {
    let currentStep = steps[index];
    const newSteps = [...steps];
    const interval = setInterval(() => {
      if (currentStep >= frames.length - 1) {
        clearInterval(interval);
      } else {
        currentStep++;
        newSteps[index] = currentStep;
        setSteps([...newSteps]);
      }
    }, 100);
  };

  const animateRemoveWater = (index) => {
    let currentStep = steps[index];
    const newSteps = [...steps];
    const interval = setInterval(() => {
      if (currentStep <= 0) {
        clearInterval(interval);
      } else {
        currentStep--;
        newSteps[index] = currentStep;
        setSteps([...newSteps]);
      }
    }, 100);
  };

  const handleClick = async (index) => {
    if (steps[index] === frames.length - 1) {
      await handleRemoveWater();
      animateRemoveWater(index);
    } else {
      await handleAddWater();
      animateAddWater(index);
    }
    refetchWaterIntake();
  };

  useEffect(() => {
    refetchWaterIntake();
  }, [handleAddWater, handleRemoveWater]);

  if (loadingGetWater || loadingGetWaterObjective) return <p>Loading...</p>;
  if (errorGetWater || errorGetWaterObjective)
    return (
      <p>Error: {errorGetWater?.message || errorGetWaterObjective?.message}</p>
    );

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
          <GraphWater refetchTrigger={handleAddWater} />
          <GraphFood refetchTrigger={handleAddWater} />
          <GraphExercise refetchTrigger={handleAddWater} />
          <div className="bg-white shadow-md rounded-lg p-6 col-span-3">
            <h3 className="text-xl font-bold">Daily Water</h3>
            <div className="flex space-x-2 mt-4">
              {[...Array(numCups)].map((_, index) => (
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
            <div>
              <p className="mt-4 text-lg font-bold">
                Total Water Intake: {waterIntakeInLiters} liters
              </p>
              <p className="mt-4 text-lg font-bold">
                Daily Water Objective: {waterObjective} liters
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}