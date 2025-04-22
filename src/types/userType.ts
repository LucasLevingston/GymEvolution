import { DietType } from './DietType'
import { Meeting } from './MeetingType'
import { Notification } from './NotificationType'
import { Plan } from './PlanType'
import { Task } from './ProfessionalType'
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
  plans: Plan[]
  role: 'STUDENT' | 'NUTRITIONIST' | 'TRAINER' | 'ADMIN'

  studentsAsNutritionist?: {
    id: string
    status: string
    createdAt: string | Date
    student: {
      id: string
      name?: string
      email: string
      imageUrl?: string
    }
  }[]

  studentsAsTrainer?: {
    id: string
    status: string
    createdAt: string | Date
    student2: {
      id: string
      name?: string
      email: string
      imageUrl?: string
    }
  }[]

  professionalAsNutritionist?: {
    id: string
    status: string
    createdAt: string | Date
    professional: {
      id: string
      name?: string
      email: string
      imageUrl?: string
    }
  }[]

  professionalAsTrainer?: {
    id: string
    status: string
    createdAt: string | Date
    professional2: {
      id: string
      name?: string
      email: string
      imageUrl?: string
    }
  }[]

  // Meetings
  meetingsAsStudent?: {
    id: string
    title: string
    description?: string
    startTime: string | Date
    endTime: string | Date
    status: string
    professional?: {
      id: string
      name?: string
      email: string
    }
  }[]

  meetingsAsProfessional?: {
    id: string
    title: string
    description?: string
    startTime: string | Date
    endTime: string | Date
    status: string
    student?: {
      id: string
      name?: string
      email: string
      imageUrl?: string
    }
  }[]

  clients: Client[]

  tasks: Task[]
}
interface Client {
  id: string
  name: string
  email: string
  phone?: string
  imageUrl?: string
  totalSpent: number
  tasks: Task[]
  isActive: boolean
  latestPlanName?: string
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
