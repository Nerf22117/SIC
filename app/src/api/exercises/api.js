const API_URL = "http://localhost:3001/exercises";

export const getExercises = async () => {
  const response = await fetch(API_URL);
  const data = await response.json();

  console.log(data);

  return data;
};
