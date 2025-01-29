import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Line } from "react-chartjs-2";
import { GET_EXERCISES_DATES } from "../../graphql/queries/exercise.query";
import { useAuth } from "../../context/AuthContext";

const GraphExercise = ({ refetchTrigger }) => {
  const { authUser } = useAuth();
  const userId = authUser?._id;

  const getLastWeekDates = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]);
    }
    return dates;
  };

  const lastWeekDates = getLastWeekDates();
  const startDate = lastWeekDates[0];
  const endDate = lastWeekDates[lastWeekDates.length - 1];

  const { data, loading, error, refetch } = useQuery(GET_EXERCISES_DATES, {
    variables: { input: { startDate, endDate, userId } },
  });

  useEffect(() => {
    if (refetchTrigger) {
      refetch();
    }
  }, [refetchTrigger, refetch]);

  const exerciseWeekData = lastWeekDates.map((date) => {
    const dayData = data?.getExercisesDates?.result?.filter((exercise) => exercise.date === date);
    const totalDuration = dayData ? dayData.reduce((sum, entry) => sum + entry.duration, 0) : 0;
    return totalDuration;
  });

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Exercise History (mins)",
        data: exerciseWeekData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 col-span-1">
      <h2 className="text-xl font-bold">Exercise History</h2>
      <Line data={chartData} />
    </div>
  );
};

export default GraphExercise;