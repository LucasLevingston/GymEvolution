import { Meeting } from './MeetingType';
import { Plan } from './PlanType';
import { Relationship } from './RelationshipType';
import { UserType } from './userType';

export type paymentStatusType = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
export type statusPurchaseType =
  | 'WAITINGPAYMENT'
  | 'SCHEDULEMEETING'
  | 'SCHEDULEDMEETING'
  | 'WAITINGSPREADSHEET'
  | 'SPREADSHEET SENT'
  | 'SCHEDULE RETURN'
  | 'FINALIZED';

export interface Purchase {
  id: string;

  buyer: UserType;
  buyerId: string;
  professional: UserType;
  professionalId: string;

  planId: string;
  Plan: Plan;
  amount: number;
  status: statusPurchaseType;
  paymentStatus: paymentStatusType;
  paymentMethod: string;
  paymentId?: string | null;

  // Cancellation details
  cancelReason?: string | null;
  cancelComment?: string | null;
  cancelledAt?: Date | string | null;

  // Relationship connection
  relationship?: Relationship | null;
  relationshipId?: string | null;

  // Additional connections
  meetings?: Meeting[];
  User?: UserType | null;
  userId?: string | null;

  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreatePurchaseDto {
  buyerId: string;
  professionalId: string;
  planId: string;
  amount: number;
  paymentMethod?: string;
  paymentId?: string;
}

export interface UpdatePurchaseDto {
  paymentStatusType?: paymentStatusType;
  status?: statusPurchaseType;
  paymentMethod?: string;
  paymentId?: string;
  cancelReason?: string;
  cancelComment?: string;
  cancelledAt?: Date | string;
}

export interface CancelPurchaseDto {
  reason: string;
  comment?: string;
}

export interface CompletePurchaseDto {
  paymentMethod: string;
  paymentId: string;
}
