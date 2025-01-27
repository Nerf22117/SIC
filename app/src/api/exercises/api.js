const API_URL = "https://api.api-ninjas.com/v1/caloriesburned";

export const getCaloriesBurned = async (activity) => {
  const response = await fetch(`${API_URL}?activity=${activity}`, {
    method: "GET",
    headers: {
      "X-Api-Key": "mJvhnfQMg6FTsFgwDQpeWw==YFBSmJrORK8sQSUE",
    },
  });
  const data = await response.json();
  console.log(data);
  return data;
};
