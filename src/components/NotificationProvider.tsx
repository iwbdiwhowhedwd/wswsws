
import { useEffect } from 'react';
import { notificationService } from '@/services/notificationService';

interface NotificationProviderProps {
  children: React.ReactNode;
}

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  useEffect(() => {
    // Initialize notifications when the app starts
    const initNotifications = async () => {
      try {
        await notificationService.initialize();
        console.log('Notification service initialized');
      } catch (error) {
        console.error('Failed to initialize notification service:', error);
      }
    };

    initNotifications();
  }, []);

  return <>{children}</>;
};

export default NotificationProvider;
