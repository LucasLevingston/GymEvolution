export type PurchaseStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface Purchase {
  id: string;
  buyerId: string;
  professionalId: string;
  planId: string;
  planName: string;
  planDescription?: string;
  amount: number;
  status: PurchaseStatus;
  paymentMethod?: string;
  paymentId?: string;
  cancelReason?: string;
  cancelComment?: string;
  cancelledAt?: string;
  relationshipId?: string;
  createdAt: string;
  updatedAt: string;
  buyer?: {
    id: string;
    name?: string;
    email: string;
  };
  professional?: {
    id: string;
    name?: string;
    email: string;
    role: string;
  };
  relationship?: {
    id: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CreatePurchaseDto {
  buyerId: string;
  professionalId: string;
  planId: string;
  planName: string;
  planDescription?: string;
  amount: number;
  paymentMethod?: string;
  paymentId?: string;
}

export interface UpdatePurchaseDto {
  status?: PurchaseStatus;
  paymentMethod?: string;
  paymentId?: string;
  cancelReason?: string;
  cancelComment?: string;
  cancelledAt?: Date;
}

export interface CancelPurchaseDto {
  reason: string;
  comment?: string;
}

export interface CompletePurchaseDto {
  paymentMethod: string;
  paymentId: string;
}
