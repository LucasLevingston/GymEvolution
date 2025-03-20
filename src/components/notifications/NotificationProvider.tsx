'use client';

import type React from 'react';
import { createContext, useContext } from 'react';
import type { Notification } from '@/types/notification';
import { useToast } from '@/hooks/use-toast';
import { useNotifications as useNotificationsHook } from '@/hooks/use-notifications';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'read' | 'userId'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { toast } = useToast();
  const {
    notifications,
    unreadCount,
    addNotification: addNotificationToServer,
    markAsRead: markAsReadOnServer,
    markAllAsRead: markAllAsReadOnServer,
    removeNotification: removeNotificationFromServer,
    clearAllNotifications: clearAllNotificationsFromServer,
  } = useNotificationsHook();

  const addNotification = async (
    notification: Omit<Notification, 'id' | 'createdAt' | 'updatedAt' | 'read' | 'userId'>
  ) => {
    // Show toast regardless of whether we can add to server
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });

    // Try to add to server if possible
    await addNotificationToServer(notification);
  };

  const markAsRead = async (id: string) => {
    await markAsReadOnServer(id);
  };

  const markAllAsRead = async () => {
    await markAllAsReadOnServer();
  };

  const removeNotification = async (id: string) => {
    await removeNotificationFromServer(id);
  };

  const clearAllNotifications = async () => {
    await clearAllNotificationsFromServer();
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
