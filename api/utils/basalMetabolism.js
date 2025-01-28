/**
 * Returns the basal metabolic rate multiplier based on the given activity level.
 *
 * @param {string} activity - The activity level. Can be one of the following:
 *   - "sedentary"
 *   - "lightly active"
 *   - "moderately active"
 *   - "very active"
 * @returns {number} The basal metabolic rate multiplier for the given activity level.
 *   Returns 0 if the activity level is not recognized.
 */
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

/**
 * Calculates the basal metabolism rate based on the provided data.
 *
 * @param {Object} data - The data for calculating basal metabolism.
 * @param {number} data.weight - The weight of the person in kilograms.
 * @param {number} data.height - The height of the person in centimeters.
 * @param {number} data.age - The age of the person in years.
 * @param {string} data.activity - The activity level of the person.
 * @returns {number} The calculated basal metabolism rate.
 */
export default function basalMetabolism(data) {
  const { weight, height, age, activity } = data;

  const basalMetabolism = 10 * weight + 6.25 * height - 5 * age + 5;

  return basalMetabolism * getActivityBasal(activity);
}
