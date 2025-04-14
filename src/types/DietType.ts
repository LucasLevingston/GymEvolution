export type MealItemType = {
  id: string
  name: string
  quantity: number
  quantityType: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  isCompleted?: boolean
  isSubstitution?: boolean
  originalItemId?: string | null
  substitutions?: MealItemType[]
}

export interface DietType {
  id?: string
  weekNumber: number
  totalCalories?: number
  totalProtein?: number
  totalCarbohydrates?: number
  totalFat?: number
  isCurrent: boolean
  userId?: string
  userCpf?: string
  userEmail?: string
  userName?: string
  createdAt?: Date
  updatedAt?: Date
  meals?: MealType[]
}

export interface MealType {
  id: string
  name?: string
  mealType?: string
  calories?: number
  protein?: number
  carbohydrates?: number
  fat?: number
  day?: number
  hour?: string
  isCompleted?: boolean
  dietId?: string
  createdAt?: Date
  updatedAt?: Date
  mealItems?: any[]
}
