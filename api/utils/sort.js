export function sortExercises(exercises, order) {
  if (!exercises || exercises.length === 0) {
    return exercises;
  }

  switch (order) {
    case "NAME_ASC":
      return exercises.sort((a, b) => a.activity.localeCompare(b.activity));

    case "NAME_DESC":
      return exercises.sort((a, b) => b.activity.localeCompare(a.activity));

    case "DATE_ASC":
      return exercises.sort((a, b) => new Date(a.date) - new Date(b.date));

    case "DATE_DESC":
      return exercises.sort((a, b) => new Date(b.date) - new Date(a.date));

    case "CALORIES_ASC":
      return exercises.sort((a, b) => a.calories - b.calories);

    case "CALORIES_DESC":
      return exercises.sort((a, b) => b.calories - a.calories);

    default:
      return exercises;
  }
}

export const sortFoods = (foods, order) => {
  if (!foods || foods.length === 0) {
    return foods;
  }

  switch (order) {
    case "NAME_ASC":
      return foods.sort((a, b) => a.name.localeCompare(b.name));

    case "NAME_DESC":
      return foods.sort((a, b) => b.name.localeCompare(a.name));

    case "DATE_ASC":
      return foods.sort((a, b) => new Date(a.date) - new Date(b.date));

    case "DATE_DESC":
      return foods.sort((a, b) => new Date(b.date) - new Date(a.date));

    case "CALORIES_ASC":
      return foods.sort((a, b) => a.calories - b.calories);

    case "CALORIES_DESC":
      return foods.sort((a, b) => b.calories - a.calories);

    case "QUANTITY_ASC":
      return foods.sort((a, b) => a.quantity - b.quantity);

    case "QUANTITY_DESC":
      return foods.sort((a, b) => b.quantity - a.quantity);

    default:
      return foods;
  }
};
