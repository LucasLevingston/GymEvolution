import type { UserType } from './userType'
import type { Purchase } from './PurchaseType'

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

  isTrainingWeek: boolean
  trainingWeekId?: string

  isDiet: boolean
  dietId?: string

  isFeedback: boolean
  feedback: string

  isConsultation: boolean
  consultationMeetingId: string

  isReturn: boolean
  returnMeetingId: string

  linkToResolve?: string

  planId?: string
}
export const defaultFeatures: Feature[] = [
  {
    id: '1',
    name: 'Plano de Treino Semanal',
    isTrainingWeek: true,
    trainingWeekId: '',
    isDiet: false,
    isFeedback: false,
    feedback: '',
    isConsultation: false,
    consultationMeetingId: '',
    isReturn: false,
    returnMeetingId: '',
  },
  {
    id: '2',
    name: 'Plano Alimentar Personalizado',
    isTrainingWeek: false,
    isDiet: true,
    dietId: '',
    isFeedback: false,
    feedback: '',
    isConsultation: false,
    consultationMeetingId: '',
    isReturn: false,
    returnMeetingId: '',
  },
  {
    id: '3',
    name: 'Feedback Semanal',
    isTrainingWeek: false,
    isDiet: false,
    isFeedback: true,
    feedback: 'Feedback semanal sobre seu progresso',
    isConsultation: false,
    consultationMeetingId: '',
    isReturn: false,
    returnMeetingId: '',
  },
  {
    id: '4',
    name: 'Consulta Online',
    isTrainingWeek: false,
    isDiet: false,
    isFeedback: false,
    feedback: '',
    isConsultation: true,
    consultationMeetingId: '',
    isReturn: false,
    returnMeetingId: '',
  },
  {
    id: '5',
    name: 'Retorno Mensal',
    isTrainingWeek: false,
    isDiet: false,
    isFeedback: false,
    feedback: '',
    isConsultation: false,
    consultationMeetingId: '',
    isReturn: true,
    returnMeetingId: '',
  },
  {
    id: '6',
    name: 'Acesso a Materiais Exclusivos',
    isTrainingWeek: false,
    isDiet: false,
    isFeedback: false,
    feedback: '',
    isConsultation: false,
    consultationMeetingId: '',
    isReturn: false,
    returnMeetingId: '',
    linkToResolve: 'https://example.com/materials',
  },
]
