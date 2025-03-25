import type { UserType } from './userType';
import type { Purchase } from './PurchaseType';

export type RelationshipStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Relationship {
  id: string;

  // Nutritionist relationship
  nutritionist?: UserType | null;
  nutritionistId?: string | null;
  student?: UserType | null;
  studentId?: string | null;

  // Trainer relationship
  trainer?: UserType | null;
  trainerId?: string | null;
  student2?: UserType | null;
  student2Id?: string | null;

  status: RelationshipStatus;
  purchase?: Purchase | null;

  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
}
