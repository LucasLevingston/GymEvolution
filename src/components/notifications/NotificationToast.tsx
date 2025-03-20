'use client';

import type React from 'react';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { Notification } from '@/types/NotificationType';
import { Toast, ToastClose, ToastDescription, ToastTitle } from '@/components/ui/toast';

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onClose,
}) => {
  const { title, message, type } = notification;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <Toast>
      <div className="flex">
        <div className="mr-3">{getIcon()}</div>
        <div className="flex-1">
          <ToastTitle>{title}</ToastTitle>
          <ToastDescription>{message}</ToastDescription>
        </div>
      </div>
      <ToastClose onClick={onClose} />
    </Toast>
  );
};
