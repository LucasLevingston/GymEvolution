export interface WeightData {
  week: number
  value: number
}

export interface BodyFatData {
  week: number
  value: number
}

export interface StrengthData {
  week: number
  benchPress: number
  squat: number
  deadlift: number
}

export interface LoadData {
  week: number
  upper: number
  lower: number
}

export interface ProgressData {
  weight: WeightData[]
  bodyFat: BodyFatData[]
  strength: StrengthData[]
  load: LoadData[]
}
