import type { UserType } from './userType'

export type TrainingWeekType = {
  id?: string
  weekNumber: number
  trainingDays: TrainingDayType[]
  startDate: Date
  endDate: Date
  information?: string
  isCompleted: boolean
  user?: UserType
  userId: string
  createdAt?: Date
  updatedAt?: Date
}

export type WeightType = {
  id?: string
  weight: string
  date: string
  bf: string
  userId: string
  user?: UserType
  createdAt?: Date
}

export type TrainingDayType = {
  id?: string
  group: string
  dayOfWeek: string
  day: Date
  isCompleted: boolean
  comments?: string
  exercises: ExerciseType[]
  trainingWeek?: TrainingWeekType
  trainingWeekId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type ExerciseType = {
  id?: string
  name: string
  variation?: string
  repetitions: number
  sets: number
  isCompleted: boolean
  seriesResults: SerieType[]
  trainingDay?: TrainingDayType
  trainingDayId?: string
  createdAt?: Date
  updatedAt?: Date
}

export type SerieType = {
  id?: string
  seriesIndex?: number
  repetitions?: number
  weight?: number
  exercise?: ExerciseType
  exerciseId?: string
  createdAt?: Date
  updatedAt?: Date
}
