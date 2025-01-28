export default function dailyReference(food) {
  const referenceValues = {
    calories: 2000,
    protein: 50,
    carbohydrates: 260,
    fat: 70,
    saturatedFat: 20,
    sugar: 90,
    salt: 6,
  };

  return {
    calories: ((food.calories / referenceValues.calories) * 100).toFixed(2),
    protein: ((food.protein / referenceValues.protein) * 100).toFixed(2),
    carbohydrates: (
      (food.carbohydrates / referenceValues.carbohydrates) *
      100
    ).toFixed(2),
    fat: ((food.fat / referenceValues.fat) * 100).toFixed(2),
    saturatedFat: (
      (food.saturated_fat / referenceValues.saturatedFat) *
      100
    ).toFixed(2),
    sugar: ((food.sugar / referenceValues.sugar) * 100).toFixed(2),
    salt: ((food.salt / referenceValues.salt) * 100).toFixed(2),
  };
}
