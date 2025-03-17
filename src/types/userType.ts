import { DietType } from './DietType'
import { TrainingWeekType } from './TrainingType'

export type UserType = {
  id: string
  email: string
  password: string
  name?: string
  sex?: string
  street?: string
  number?: string
  zipCode?: string
  city?: string
  state?: string
  birthDate?: string
  phone?: string
  currentWeight?: string
  history: HistoryType[]
  oldWeights: WeightType[]
  trainingWeeks: TrainingWeekType[]
  diets: DietType[]
}

export type HistoryType = {
  id: string
  event: string
  date: string
  userId: string
  user: UserType
}

export type WeightType = {
  id: string
  weight: string
  date: string
  bf: string
  userId: string
  user?: UserType
}
