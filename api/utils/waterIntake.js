function getActivityWater(activity) {
  switch (activity) {
    case "sedentary":
      return 0.3;
    case "lightly active":
      return 0.4;
    case "moderately active":
      return 0.5;
    case "very active":
      return 0.7;
    default:
      return 0;
  }
}

function getGenderWater(age, gender) {
  if (gender === "male") {
    if (age < 55) {
      return 0.2;
    } else if (age >= 55) {
      return 0.1;
    }
  } else {
    if (age < 55) {
      return 0.1;
    } else if (age >= 55) {
      return -0.1;
    }
  }
  return 0;
}

export default function waterIntake(data) {
  const { weight, age, activity, gender } = data;

  let water = 0.033 * weight;

  water += getActivityWater(activity);

  water += getGenderWater(age, gender);

  return water;
}
