import { Meeting } from './MeetingType'
import { Plan } from './PlanType'
import { Relationship } from './RelationshipType'
import { UserType } from './userType'

export type paymentStatusType = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED'
export type purchaseStatusType = 'WAITINGPAYMENT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface Purchase {
  id: string

  buyer: UserType
  buyerId: string
  professional: UserType
  professionalId: string

  planId: string
  Plan: Plan
  amount: number
  paymentStatus: paymentStatusType
  status: purchaseStatusType
  paymentMethod: string
  paymentId?: string | null

  cancelReason?: string | null
  cancelComment?: string | null
  cancelledAt?: Date | string | null

  relationship?: Relationship | null
  relationshipId?: string | null
  meetingId: string
  meetings?: Meeting[]

  createdAt: Date | string
  updatedAt: Date | string
}

export interface CreatePurchaseDto {
  buyerId: string
  professionalId: string
  planId: string
  amount: number
  paymentMethod?: string
  paymentId?: string
}

export interface UpdatePurchaseDto {
  paymentStatusType?: paymentStatusType
  paymentMethod?: string
  paymentId?: string
  cancelReason?: string
  cancelComment?: string
  cancelledAt?: Date | string
}

export interface CancelPurchaseDto {
  reason: string
  comment?: string
}

export interface CompletePurchaseDto {
  paymentMethod: string
  paymentId: string
}
