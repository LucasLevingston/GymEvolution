'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Notification, CreateNotificationDto } from '@/types/NotificationType';
import { toast } from 'sonner';
import api from '@/lib/api';
import { useUserStore } from '@/store/user-store';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useUserStore();

  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/notifications?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Failed to fetch notifications');
      }

      setNotifications(response.data);
      setUnreadCount(
        response.data.filter((notification: Notification) => !notification.read).length
      );
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, token]);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id, fetchNotifications]);

  const addNotification = async (notification: Omit<CreateNotificationDto, 'userId'>) => {
    if (!user?.id) {
      // If no userId is provided, just show a toast
      toast(notification.message);
      return null;
    }

    try {
      const response = await api.post(
        '/notifications',
        {
          ...notification,
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error('Failed to create notification');
      }

      const newNotification = response.data;
      setNotifications((prev) => [newNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show toast for new notification
      toast(notification.message);

      return newNotification;
    } catch (err) {
      console.error('Error creating notification:', err);
      return null;
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await api.patch(
        `/notifications/${id}`,
        { read: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error('Failed to update notification');
      }

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id || notifications.length === 0) return false;

    try {
      const response = await api.patch(
        `/notifications/mark-all-read/${user.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data) {
        throw new Error('Failed to mark all notifications as read');
      }

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );

      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  };

  const removeNotification = async (id: string) => {
    try {
      const response = await api.delete(`/notifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Failed to delete notification');
      }

      const wasUnread = notifications.find((n) => n.id === id)?.read === false;

      setNotifications((prev) => prev.filter((notification) => notification.id !== id));

      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return true;
    } catch (err) {
      console.error('Error removing notification:', err);
      return false;
    }
  };

  const clearAllNotifications = async () => {
    if (!user?.id || notifications.length === 0) return false;

    try {
      const response = await api.delete(`/notifications/clear-all/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data) {
        throw new Error('Failed to clear all notifications');
      }

      setNotifications([]);
      setUnreadCount(0);
      return true;
    } catch (err) {
      console.error('Error clearing all notifications:', err);
      return false;
    }
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  };
};
