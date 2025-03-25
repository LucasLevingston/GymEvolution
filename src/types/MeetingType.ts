import type { UserType } from './userType';
import type { Purchase } from './PurchaseType';

export type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface Meeting {
  id: string;
  title: string;
  description?: string | null;
  meetLink?: string | null;
  meetingCode?: string | null;
  startTime: Date | string;
  endTime: Date | string;
  status: MeetingStatus;

  // User relationships
  professional: UserType;
  professionalId: string;
  student: UserType;
  studentId: string;

  // Purchase relationship
  purchase?: Purchase | null;
  purchaseId?: string | null;

  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
}
