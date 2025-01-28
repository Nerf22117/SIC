/**
 * Determines the weight category based on the given Body Mass Index (BMI).
 *
 * @param {number} imc - The Body Mass Index (BMI) value.
 * @returns {string} The weight category corresponding to the given BMI.
 * - "Underweight" for BMI less than 18.5
 * - "Normal weight" for BMI between 18.5 and 24.9
 * - "Overweight" for BMI between 25 and 29.9
 * - "Obesity I" for BMI between 30 and 34.9
 * - "Obesity II" for BMI between 35 and 39.9
 * - "Severe obesity" for BMI 40 and above
 */
function setCategory(imc) {
  if (imc < 18.5) return "Underweight";
  if (imc < 24.9) return "Normal weight";
  if (imc < 29.9) return "Overweight";
  if (imc < 34.9) return "Obesity I";
  if (imc < 39.9) return "Obesity II";
  return "Severe obesity";
}

/**
 * Calculates the Body Mass Index (BMI) and determines the BMI category.
 *
 * @param {Object} data - The input data.
 * @param {number} data.weight - The weight of the person in kilograms.
 * @param {number} data.height - The height of the person in centimeters.
 * @returns {Object} An object containing the BMI value and its category.
 * @returns {string} value - The BMI value rounded to two decimal places.
 * @returns {string} category - The category of the BMI (e.g., underweight, normal weight, overweight, obesity).
 */
export default function imc(data) {
  const { weight, height } = data;

  const imc = weight / (height / 100) ** 2;

  const category = setCategory(imc);

  return { value: imc.toFixed(2), category };
}
