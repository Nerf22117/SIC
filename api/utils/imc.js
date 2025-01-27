function setCategory(imc) {
  if (imc < 18.5) return "Underweight";
  if (imc < 24.9) return "Normal weight";
  if (imc < 29.9) return "Overweight";
  if (imc < 34.9) return "Obesity I";
  if (imc < 39.9) return "Obesity II";
  return "Severe obesity";
}

export default function imc(data) {
  const { weight, height } = data;

  const imc = weight / (height / 100) ** 2;

  const category = setCategory(imc);

  return { value: imc.toFixed(2), category };
}
