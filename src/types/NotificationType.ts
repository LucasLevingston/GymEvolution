export type NotificationType = 'success' | 'error' | 'info' | 'default';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  userId: string;
}

export interface UpdateNotificationDto {
  read?: boolean;
}
