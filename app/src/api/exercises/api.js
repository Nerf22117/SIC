const API_URL = "https://db-exercise.vercel.app/exercises";

export const getExercises = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();

  console.log("Data Fetched", data);

  return data;
};
