
import OneSignal from 'react-onesignal';
import { supabase } from '@/integrations/supabase/client';

// OneSignal configuration
const ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID'; // You'll need to replace this with your actual OneSignal App ID

export interface NotificationData {
  title: string;
  message: string;
  type: 'general' | 'new_item' | 'price_update' | 'reservation';
  data?: any;
}

export interface PushToken {
  id: string;
  user_identifier: string;
  token: string;
  platform: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

class NotificationService {
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      await OneSignal.init({
        appId: ONESIGNAL_APP_ID,
        safari_web_id: 'web.onesignal.auto.YOUR_SAFARI_WEB_ID', // Optional for Safari
        notifyButton: {
          enable: true,
          prenotify: true,
          showCredit: false,
          text: {
            'tip.state.unsubscribed': 'Subscribe to notifications',
            'tip.state.subscribed': "You're subscribed to notifications",
            'tip.state.blocked': "You've blocked notifications",
            'message.prenotify': 'Click to subscribe to notifications',
            'message.action.subscribed': "Thanks for subscribing!",
            'message.action.resubscribed': "You're subscribed to notifications",
            'message.action.unsubscribed': "You won't receive notifications again",
            'message.action.subscribing': "Please wait...",
            'dialog.main.title': 'Manage Site Notifications',
            'dialog.main.button.subscribe': 'SUBSCRIBE',
            'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
            'dialog.blocked.title': 'Unblock Notifications',
            'dialog.blocked.message': "Follow these instructions to allow notifications:"
          }
        },
        allowLocalhostAsSecureOrigin: true, // For development
      });

      this.initialized = true;
      
      // Request permission and get user ID
      await this.requestPermission();
      
      // Listen for subscription changes
      OneSignal.User.PushSubscription.addEventListener('change', (event) => {
        console.log('Subscription changed:', event);
        if (event.current.optedIn) {
          this.saveUserToken();
        }
      });

      console.log('OneSignal initialized successfully');
    } catch (error) {
      console.error('Error initializing OneSignal:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    try {
      const permission = await OneSignal.Notifications.permission;
      
      if (!permission) {
        await OneSignal.Slidedown.promptPush();
      }
      
      return permission === true;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async saveUserToken() {
    try {
      const userId = OneSignal.User.onesignalId;
      const pushToken = OneSignal.User.PushSubscription.id;
      
      if (userId && pushToken) {
        const deviceInfo = this.getDeviceInfo();
        
        // Save token to Supabase
        const { error } = await supabase
          .from('push_tokens')
          .upsert({
            user_identifier: userId,
            token: pushToken,
            platform: deviceInfo.platform,
            active: true,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_identifier'
          });

        if (error) {
          console.error('Error saving push token:', error);
        } else {
          console.log('Push token saved successfully');
        }
      }
    } catch (error) {
      console.error('Error getting user token:', error);
    }
  }

  private getDeviceInfo() {
    const userAgent = navigator.userAgent.toLowerCase();
    let platform = 'web';
    
    if (userAgent.includes('android')) {
      platform = 'android';
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
      platform = 'ios';
    }
    
    return { platform };
  }

  async sendNotification(data: NotificationData): Promise<boolean> {
    try {
      // Save notification to database first
      const { data: savedNotification, error: dbError } = await supabase
        .from('notifications')
        .insert({
          title: data.title,
          message: data.message,
          type: data.type,
          data: data.data || null,
          sent_count: 0,
          success_count: 0
        })
        .select()
        .single();

      if (dbError) {
        console.error('Error saving notification to database:', dbError);
        return false;
      }

      // Send notification via OneSignal
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic YOUR_ONESIGNAL_REST_API_KEY` // You'll need to replace this
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          included_segments: ['All'],
          headings: { en: data.title, ar: data.title },
          contents: { en: data.message, ar: data.message },
          data: data.data || {},
          web_url: window.location.origin,
          chrome_web_icon: '/favicon.ico',
          firefox_icon: '/favicon.ico'
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        // Update notification with sent count
        await supabase
          .from('notifications')
          .update({
            sent_count: result.recipients || 0,
            success_count: result.recipients || 0
          })
          .eq('id', savedNotification.id);

        console.log('Notification sent successfully:', result);
        return true;
      } else {
        console.error('Error sending notification:', result);
        return false;
      }
    } catch (error) {
      console.error('Error in sendNotification:', error);
      return false;
    }
  }

  async sendNotificationToSpecificUsers(data: NotificationData, userIds: string[]): Promise<boolean> {
    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic YOUR_ONESIGNAL_REST_API_KEY`
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          include_player_ids: userIds,
          headings: { en: data.title, ar: data.title },
          contents: { en: data.message, ar: data.message },
          data: data.data || {},
          web_url: window.location.origin
        })
      });

      const result = await response.json();
      return response.ok;
    } catch (error) {
      console.error('Error sending targeted notification:', error);
      return false;
    }
  }

  async getStoredTokens(): Promise<PushToken[]> {
    try {
      const { data, error } = await supabase
        .from('push_tokens')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching push tokens:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getStoredTokens:', error);
      return [];
    }
  }

  async getNotificationHistory() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('sent_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching notification history:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getNotificationHistory:', error);
      return [];
    }
  }
}

export const notificationService = new NotificationService();

// Auto-notification helpers
export const sendNewItemNotification = async (itemName: string, price: number) => {
  return await notificationService.sendNotification({
    title: 'قطعة ذهبية جديدة! ✨',
    message: `تم إضافة ${itemName} بسعر ${price} دينار أردني`,
    type: 'new_item',
    data: { itemName, price }
  });
};

export const sendPriceUpdateNotification = async (itemName: string, newPrice: number) => {
  return await notificationService.sendNotification({
    title: 'تحديث السعر 💰',
    message: `تم تحديث سعر ${itemName} إلى ${newPrice} دينار أردني`,
    type: 'price_update',
    data: { itemName, newPrice }
  });
};

export const sendReservationNotification = async (itemName: string, customerName: string) => {
  return await notificationService.sendNotification({
    title: 'حجز جديد 📝',
    message: `تم حجز ${itemName} من قبل ${customerName}`,
    type: 'reservation',
    data: { itemName, customerName }
  });
};
