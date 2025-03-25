import type { UserType } from './userType';
import type { Purchase } from './PurchaseType';

export interface Plan {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  duration: number;
  features: string; // JSON string of features array
  isActive: boolean;

  // Relationships
  professional: UserType;
  professionalId: string;
  purchases?: Purchase[];

  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
}
