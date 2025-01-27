function getActivityBasal(activity) {
  switch (activity) {
    case "sedentary":
      return 1.2;
    case "lightly active":
      return 1.375;
    case "moderately active":
      return 1.55;
    case "very active":
      return 1.725;
    default:
      return 0;
  }
}

export default function basalMetabolism(data) {
  const { weight, height, age, activity } = data;

  const basalMetabolism = 10 * weight + 6.25 * height - 5 * age + 5;

  return basalMetabolism * getActivityBasal(activity);
}
