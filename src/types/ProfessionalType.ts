import { ProfessionalSettings } from './userType'

export interface Review {
  id: string
  rating: number
  content: string
  date: string
  author: {
    id: string
    name: string
    initials: string
  }
}

export interface Professional {
  id: string
  name: string
  email: string
  role: 'NUTRITIONIST' | 'TRAINER'
  bio?: string
  city?: string
  state?: string
  phone?: string
  imageUrl?: string
  location: string
  specialty: string
  experience?: number
  available: boolean
  specialties?: string[]
  certifications?: string[]
  education?: string[]
  availability?: string[]
  reviews?: Review[]
  professionalSettings: ProfessionalSettings
}

export interface Task {
  id: string
  type: 'TRAINING' | 'DIET' | 'FEEDBACK' | 'CONSULTATION' | 'RETURN'
  title: string
  description: string
  clientName: string
  clientId: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
  purchaseId: string
  featureId: string
  linkToResolve?: string
  dueDate?: string | null
}
