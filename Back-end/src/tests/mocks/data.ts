// import type { UserRole } from '@prisma/client';

// export const mockUser = {
//   id: 'user-id',
//   email: 'test@example.com',
//   password: 'hashed-password',
//   name: 'Test User',
//   role: 'STUDENT' as UserRole,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// export const mockTrainingWeek = {
//   id: 'training-week-id',
//   weekNumber: 1,
//   information: 'Test training week',
//   current: false,
//   done: false,
//   userId: 'user-id',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// export const mockTrainingDay = {
//   id: 'training-day-id',
//   group: 'Chest',
//   dayOfWeek: 'Monday',
//   done: false,
//   comments: 'Test training day',
//   trainingWeekId: 'training-week-id',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// export const mockExercise = {
//   id: 'exercise-id',
//   name: 'Bench Press',
//   variation: 'Barbell',
//   repetitions: 10,
//   sets: 3,
//   done: false,
//   trainingDayId: 'training-day-id',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// export const mockSerie = {
//   id: 'serie-id',
//   seriesIndex: 0,
//   repetitions: 10,
//   weight: 100,
//   exerciseId: 'exercise-id',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// export const mockDiet = {
//   id: 'diet-id',
//   weekNumber: 1,
//   totalCalories: 2000,
//   totalProtein: 150,
//   totalCarbohydrates: 200,
//   totalFat: 70,
//   userId: 'user-id',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// export const mockMeal = {
//   id: 'meal-id',
//   name: 'Breakfast',
//   calories: 500,
//   protein: 30,
//   carbohydrates: 50,
//   fat: 20,
//   servingSize: '1 serving',
//   mealType: 'Breakfast',
//   day: 1,
//   hour: '08:00',
//   isCompleted: false,
//   dietId: 'diet-id',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// export const mockMealItem = {
//   id: 'meal-item-id',
//   name: 'Eggs',
//   quantity: 2,
//   calories: 150,
//   protein: 12,
//   carbohydrates: 1,
//   fat: 10,
//   mealId: 'meal-id',
//   createdAt: new Date(),
//   updatedAt: new Date(),
// };

// export const mockWeight = {
//   id: 'weight-id',
//   weight: '80',
//   bf: '15',
//   date: new Date().toISOString(),
//   userId: 'user-id',
//   createdAt: new Date(),
// };

// export const mockHistory = {
//   id: 'history-id',
//   event: 'Test event',
//   date: new Date().toISOString(),
//   userId: 'user-id',
//   createdAt: new Date(),
// };
