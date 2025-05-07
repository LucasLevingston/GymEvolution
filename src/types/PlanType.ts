import type { UserType } from './userType'
import type { Purchase } from './PurchaseType'

export enum FeatureType {
  TRAINING_WEEK = 'TRAINING_WEEK',
  DIET = 'DIET',
  FEEDBACK = 'FEEDBACK',
  CONSULTATION = 'CONSULTATION',
  RETURN = 'RETURN',
  MATERIALS = 'MATERIALS',
}

export interface Plan {
  id: string
  name: string
  description?: string | null
  price: number
  duration: number
  features: Feature[]
  isActive: boolean

  professional: UserType
  professionalId: string
  purchases?: Purchase[]

  createdAt: Date | string
  updatedAt: Date | string
}

export interface Feature {
  id: string
  name: string
  type: FeatureType

  // Optional fields based on feature type
  trainingWeekId?: string
  dietId?: string
  feedback?: string
  scheduledDay?: number
  consultationMeetingId?: string
  returnMeetingId?: string
  linkToResolve?: string

  // Relation fields
  Plan?: Plan
  planId?: string

  createdAt?: Date | string
  updatedAt?: Date | string
}

export const trainerFeatures: Feature[] = [
  {
    id: '1',
    name: 'Plano de Treino Semanal',
    type: FeatureType.TRAINING_WEEK,
    trainingWeekId: '',
  },
]

export const nutritionistFeatures: Feature[] = [
  {
    id: '2',
    name: 'Plano Alimentar Personalizado',
    type: FeatureType.DIET,
    dietId: '',
  },
]

export const commonFeatures: Feature[] = [
  {
    id: '3',
    name: 'Feedback Semanal',
    type: FeatureType.FEEDBACK,
    feedback: 'Feedback semanal sobre seu progresso',
  },
  {
    id: '4',
    name: 'Consulta Online',
    type: FeatureType.CONSULTATION,
    consultationMeetingId: '',
  },
  {
    id: '5',
    name: 'Retorno Mensal',
    type: FeatureType.RETURN,
    returnMeetingId: '',
  },
  {
    id: '6',
    name: 'Acesso a Materiais Exclusivos',
    type: FeatureType.MATERIALS,
    linkToResolve: '',
  },
]

// Helper function to get features based on user role
export function getFeaturesForRole(role?: string): Feature[] {
  if (role === 'NUTRITIONIST') {
    return [...nutritionistFeatures, ...commonFeatures]
  } else if (role === 'TRAINER') {
    return [...trainerFeatures, ...commonFeatures]
  }
  return [...commonFeatures]
}
