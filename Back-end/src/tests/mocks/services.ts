import { vi } from 'vitest'
import {
  mockUser,
  mockTrainingWeek,
  mockDiet,
  mockMeal,
  mockMealItem,
  mockExercise,
  mockSerie,
  mockTrainingDay,
  mockWeight,
  mockHistory,
} from './data'

// Auth Service Mock
export const mockAuthService = {
  register: vi.fn().mockResolvedValue({
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    },
    token: 'mocked-token',
  }),
  login: vi.fn().mockResolvedValue({
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
    },
    token: 'mocked-token',
  }),
  forgotPassword: vi.fn().mockResolvedValue({
    message: 'Password reset link sent',
    resetToken: 'mocked-reset-token',
  }),
  resetPassword: vi.fn().mockResolvedValue({
    message: 'Password has been reset',
  }),
  getCurrentUser: vi.fn().mockResolvedValue({
    id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    role: mockUser.role,
  }),
}

// User Service Mock
export const mockUserService = {
  getAllUsers: vi.fn().mockResolvedValue([mockUser]),
  getUserById: vi.fn().mockResolvedValue(mockUser),
  updateUser: vi.fn().mockResolvedValue(mockUser),
  deleteUser: vi.fn().mockResolvedValue(true),
  getAllNutritionists: vi.fn().mockResolvedValue([mockUser]),
  getAllTrainers: vi.fn().mockResolvedValue([mockUser]),
  assignNutritionist: vi.fn().mockResolvedValue({
    id: 'relationship-id',
    nutritionistId: 'nutritionist-id',
    studentId: 'student-id',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  assignTrainer: vi.fn().mockResolvedValue({
    id: 'relationship-id',
    trainerId: 'trainer-id',
    student2Id: 'student-id',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getNutritionistStudents: vi.fn().mockResolvedValue([mockUser]),
  getTrainerStudents: vi.fn().mockResolvedValue([mockUser]),
}

// Training Week Service Mock
export const mockTrainingWeekService = {
  createTrainingWeek: vi.fn().mockResolvedValue(mockTrainingWeek),
  getAllTrainingWeeks: vi.fn().mockResolvedValue([mockTrainingWeek]),
  getTrainingWeekById: vi.fn().mockResolvedValue({
    ...mockTrainingWeek,
    trainingDays: [mockTrainingDay],
    user: {
      id: mockUser.id,
      name: mockUser.name,
    },
  }),
  updateTrainingWeek: vi.fn().mockResolvedValue(mockTrainingWeek),
  deleteTrainingWeek: vi.fn().mockResolvedValue(true),
  isTrainerAssignedToStudent: vi.fn().mockResolvedValue(true),
  isProfessionalAssignedToStudent: vi.fn().mockResolvedValue(true),
}

// Training Day Service Mock
export const mockTrainingDayService = {
  createTrainingDay: vi.fn().mockResolvedValue(mockTrainingDay),
  getTrainingDayById: vi.fn().mockResolvedValue({
    ...mockTrainingDay,
    exercises: [mockExercise],
  }),
  updateTrainingDay: vi.fn().mockResolvedValue(mockTrainingDay),
  deleteTrainingDay: vi.fn().mockResolvedValue(true),
  markTrainingDayAsDone: vi.fn().mockResolvedValue({
    ...mockTrainingDay,
    done: true,
  }),
}

// Exercise Service Mock
export const mockExerciseService = {
  createExercise: vi.fn().mockResolvedValue(mockExercise),
  getExerciseById: vi.fn().mockResolvedValue({
    ...mockExercise,
    seriesResults: [mockSerie],
  }),
  updateExercise: vi.fn().mockResolvedValue(mockExercise),
  deleteExercise: vi.fn().mockResolvedValue(true),
  markExerciseAsDone: vi.fn().mockResolvedValue({
    ...mockExercise,
    done: true,
  }),
}

// Serie Service Mock
export const mockSerieService = {
  createSerie: vi.fn().mockResolvedValue(mockSerie),
  getSerieById: vi.fn().mockResolvedValue(mockSerie),
  updateSerie: vi.fn().mockResolvedValue(mockSerie),
  deleteSerie: vi.fn().mockResolvedValue(true),
}

// Diet Service Mock
export const mockDietService = {
  createDiet: vi.fn().mockResolvedValue(mockDiet),
  getAllDiets: vi.fn().mockResolvedValue([
    {
      ...mockDiet,
      meals: [mockMeal],
    },
  ]),
  getDietById: vi.fn().mockResolvedValue({
    ...mockDiet,
    meals: [
      {
        ...mockMeal,
        mealItems: [mockMealItem],
      },
    ],
    User: {
      id: mockUser.id,
      name: mockUser.name,
    },
  }),
  updateDiet: vi.fn().mockResolvedValue(mockDiet),
  deleteDiet: vi.fn().mockResolvedValue(true),
}

// Meal Service Mock
export const mockMealService = {
  createMeal: vi.fn().mockResolvedValue(mockMeal),
  getMealById: vi.fn().mockResolvedValue({
    ...mockMeal,
    mealItems: [mockMealItem],
  }),
  updateMeal: vi.fn().mockResolvedValue(mockMeal),
  deleteMeal: vi.fn().mockResolvedValue(true),
  markMealAsCompleted: vi.fn().mockResolvedValue({
    ...mockMeal,
    isCompleted: true,
  }),
}

// Meal Items Service Mock
export const mockMealItemsService = {
  createMealItem: vi.fn().mockResolvedValue(mockMealItem),
  getMealItemById: vi.fn().mockResolvedValue(mockMealItem),
  updateMealItem: vi.fn().mockResolvedValue(mockMealItem),
  deleteMealItem: vi.fn().mockResolvedValue(true),
}

// Weight Service Mock
export const mockWeightService = {
  addWeightRecord: vi.fn().mockResolvedValue(mockWeight),
  getWeightHistory: vi.fn().mockResolvedValue([mockWeight]),
}

// History Service Mock
export const mockHistoryService = {
  getUserHistory: vi.fn().mockResolvedValue([mockHistory]),
  createHistoryEntry: vi.fn().mockResolvedValue(mockHistory),
}
