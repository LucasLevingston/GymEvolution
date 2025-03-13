export const calculateCalories = (protein = 0, carbs = 0, fat = 0): number => {
  return protein * 4 + carbs * 4 + fat * 9;
};
