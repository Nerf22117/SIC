/**
 * Returns the additional water intake in liters based on the activity level.
 *
 * @param {string} activity - The activity level. Can be one of the following:
 *   - "sedentary"
 *   - "lightly active"
 *   - "moderately active"
 *   - "very active"
 * @returns {number} The additional water intake in liters. Returns 0 if the activity level is not recognized.
 */
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

/**
 * Calculates the water intake adjustment factor based on age and gender.
 *
 * @param {number} age - The age of the individual.
 * @param {string} gender - The gender of the individual ("male" or "female").
 * @returns {number} The water intake adjustment factor.
 */
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

/**
 * Calculates the daily water intake recommendation based on weight, age, activity level, and gender.
 *
 * @param {Object} data - The input data for calculating water intake.
 * @param {number} data.weight - The weight of the person in kilograms.
 * @param {number} data.age - The age of the person in years.
 * @param {string} data.activity - The activity level of the person (e.g., 'low', 'medium', 'high').
 * @param {string} data.gender - The gender of the person ('male' or 'female').
 * @returns {number} - The recommended daily water intake in liters.
 */
export default function waterIntake(data) {
  const { weight, age, activity, gender } = data;

  let water = 0.033 * weight;

  water += getActivityWater(activity);

  water += getGenderWater(age, gender);

  return water;
}
