import { DietType } from './DietType'
import { Meeting } from './MeetingType'
import { Notification } from './NotificationType'
import { TrainingWeekType } from './TrainingType'

export type UserType = {
  id: string
  email: string
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
  currentBf?: string
  height?: string
  profilePictureFile: File
  useGooglePicture?: boolean

  // Professional fields
  bio?: string
  experience?: number
  rating?: number
  imageUrl?: string
  specialties?: string
  certifications?: string
  education?: string
  availability?: string
  reviews?: string

  googleAccessToken?: string
  googleRefreshToken?: string

  ProfessionalSettings?: ProfessionalSettings

  history: HistoryType[]
  oldWeights: WeightType[]
  trainingWeeks: TrainingWeekType[]
  diets: DietType[]
  notifications: Notification[]
  meetings: Meeting
  role: 'STUDENT' | 'NUTRITIONIST' | 'TRAINER' | 'ADMIN'
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
export interface ProfessionalSettings {
  id?: string
  userId?: string
  workStartHour: number
  workEndHour: number
  appointmentDuration: number
  workDays: string
  bufferBetweenSlots: number
  timeZone: string
  maxAdvanceBooking: number
  autoAcceptMeetings: boolean
  createdAt?: string
  updatedAt?: string
}
