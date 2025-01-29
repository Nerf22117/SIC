import React, { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Line } from "react-chartjs-2";
import { GET_WATER_DATES } from "../../graphql/queries/water.query";
import { useAuth } from "../../context/AuthContext";

const GraphWater = ({ refetchTrigger }) => {
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

  const { data, loading, error, refetch } = useQuery(GET_WATER_DATES, {
    variables: { input: { startDate, endDate, userId } },
  });

  useEffect(() => {
    if (refetchTrigger) {
      refetch();
    }
  }, [refetchTrigger, refetch]);

  const waterWeekData = lastWeekDates.map((date) => {
    const dayData = data?.getUserWaters?.result?.find((day) => day.date === date);
    return dayData ? dayData.quantity * 0.25 : 0;
  });

  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Water Consumption (L)",
        data: waterWeekData,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 col-span-1">
      <h2 className="text-xl font-bold">Water Consumption</h2>
      <Line data={chartData} />
    </div>
  );
};

export default GraphWater;