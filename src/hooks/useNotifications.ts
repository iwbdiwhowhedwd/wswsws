
import { useState, useEffect } from 'react';
import { notificationService, NotificationData, PushToken } from '@/services/notificationService';
import { useToast } from '@/hooks/use-toast';

export const useNotifications = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [tokens, setTokens] = useState<PushToken[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      setLoading(true);
      await notificationService.initialize();
      setIsInitialized(true);
      
      // Check permission status
      const permission = await notificationService.requestPermission();
      setHasPermission(permission);
      
      // Load tokens and history
      await loadTokens();
      await loadHistory();
    } catch (error) {
      console.error('Error initializing notifications:', error);
      toast({
        title: "خطأ في الإشعارات",
        description: "حدث خطأ أثناء تهيئة نظام الإشعارات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTokens = async () => {
    try {
      const tokenData = await notificationService.getStoredTokens();
      setTokens(tokenData);
    } catch (error) {
      console.error('Error loading tokens:', error);
    }
  };

  const loadHistory = async () => {
    try {
      const historyData = await notificationService.getNotificationHistory();
      setHistory(historyData);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const sendNotification = async (data: NotificationData) => {
    try {
      setLoading(true);
      const success = await notificationService.sendNotification(data);
      
      if (success) {
        toast({
          title: "تم إرسال الإشعار",
          description: "تم إرسال الإشعار بنجاح لجميع المستخدمين",
        });
        await loadHistory(); // Refresh history
        return true;
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "خطأ في إرسال الإشعار",
        description: "حدث خطأ أثناء إرسال الإشعار",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      const permission = await notificationService.requestPermission();
      setHasPermission(permission);
      return permission;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  return {
    isInitialized,
    hasPermission,
    tokens,
    history,
    loading,
    sendNotification,
    requestPermission,
    loadTokens,
    loadHistory
  };
};
