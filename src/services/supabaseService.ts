import { supabase } from "@/integrations/supabase/client";
import { sendNewItemNotification, sendPriceUpdateNotification, sendReservationNotification } from './notificationService';

// أنواع البيانات
export interface GoldItem {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price_jod: number;
  price_usd: number;
  price_ils: number;
  reserved: boolean;
  is_favorite: boolean;
  category?: string;
  allow_booking: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  item_id?: string;
  customer_name: string;
  phone: string;
  email?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface Review {
  id: string;
  item_id?: string;
  customer_name: string;
  rating: number;
  comment?: string;
  approved: boolean;
  created_at: string;
}

export interface AppInfo {
  id: string;
  title: string;
  description?: string;
  vision?: string;
  mission?: string;
  history?: string;
  features?: string;
  updated_at: string;
}

export interface AboutInfo {
  id: string;
  content: string;
  phone?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  address?: string;
  hours?: string;
  image?: string;
  updated_at: string;
}

// خدمات القطع الذهبية
export const goldItemsService = {
  // جلب جميع القطع
  async getAll(): Promise<GoldItem[]> {
    const { data, error } = await supabase
      .from('gold_items')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // إضافة قطعة جديدة
  async create(item: Omit<GoldItem, 'id' | 'created_at' | 'updated_at'>): Promise<GoldItem> {
    const { data, error } = await supabase
      .from('gold_items')
      .insert(item)
      .select()
      .single();
    
    if (error) throw error;
    
    // Send automatic notification for new item
    try {
      await sendNewItemNotification(data.title, data.price_jod);
    } catch (notifError) {
      console.error('Failed to send new item notification:', notifError);
    }
    
    return data;
  },

  // تحديث قطعة
  async update(id: string, updates: Partial<GoldItem>): Promise<GoldItem> {
    // Get original item to compare prices
    const { data: originalItem } = await supabase
      .from('gold_items')
      .select('*')
      .eq('id', id)
      .single();
    
    const { data, error } = await supabase
      .from('gold_items')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    // Send price update notification if price changed
    if (originalItem && updates.price_jod && originalItem.price_jod !== updates.price_jod) {
      try {
        await sendPriceUpdateNotification(data.title, data.price_jod);
      } catch (notifError) {
        console.error('Failed to send price update notification:', notifError);
      }
    }
    
    return data;
  },

  // حذف قطعة
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('gold_items')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// خدمات الحجوزات
export const reservationsService = {
  // جلب جميع الحجوزات
  async getAll(): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    // تحويل البيانات لضمان توافق الأنواع
    return (data || []).map(item => ({
      ...item,
      status: item.status as 'pending' | 'confirmed' | 'cancelled'
    }));
  },

  // إضافة حجز جديد
  async create(reservation: Omit<Reservation, 'id' | 'created_at'>): Promise<Reservation> {
    const { data, error } = await supabase
      .from('reservations')
      .insert(reservation)
      .select()
      .single();
    
    if (error) throw error;
    
    // Get item name for notification
    if (reservation.item_id) {
      try {
        const { data: itemData } = await supabase
          .from('gold_items')
          .select('title')
          .eq('id', reservation.item_id)
          .single();
        
        if (itemData) {
          await sendReservationNotification(itemData.title, reservation.customer_name);
        }
      } catch (notifError) {
        console.error('Failed to send reservation notification:', notifError);
      }
    }
    
    return {
      ...data,
      status: data.status as 'pending' | 'confirmed' | 'cancelled'
    };
  },

  // تحديث حالة الحجز
  async updateStatus(id: string, status: string): Promise<Reservation> {
    const { data, error } = await supabase
      .from('reservations')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      status: data.status as 'pending' | 'confirmed' | 'cancelled'
    };
  }
};

// خدمات التصنيفات
export const categoriesService = {
  // جلب جميع التصنيفات
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // إضافة تصنيف جديد
  async create(category: Omit<Category, 'id' | 'created_at'>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // تحديث تصنيف
  async update(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // حذف تصنيف
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// خدمات المراجعات
export const reviewsService = {
  // جلب المراجعات المعتمدة
  async getApproved(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approved', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // جلب جميع المراجعات
  async getAll(): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  // إضافة مراجعة جديدة
  async create(review: Omit<Review, 'id' | 'created_at' | 'approved'>): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .insert({ ...review, approved: false })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // الموافقة على مراجعة
  async approve(id: string): Promise<Review> {
    const { data, error } = await supabase
      .from('reviews')
      .update({ approved: true })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // حذف مراجعة
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// خدمات معلومات التطبيق
export const appInfoService = {
  // جلب معلومات التطبيق
  async get(): Promise<AppInfo | null> {
    const { data, error } = await supabase
      .from('app_info')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // تحديث معلومات التطبيق
  async update(info: Partial<AppInfo>): Promise<AppInfo> {
    // أولاً نتحقق من وجود سجل
    const existing = await this.get();
    
    if (existing) {
      const { data, error } = await supabase
        .from('app_info')
        .update({ ...info, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // التأكد من وجود العنوان عند الإنشاء
      const insertData = {
        title: info.title || 'مجوهرات أبو رميلة',
        description: info.description,
        vision: info.vision,
        mission: info.mission,
        history: info.history,
        features: info.features
      };
      
      const { data, error } = await supabase
        .from('app_info')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
};

// خدمات معلومات "من نحن"
export const aboutInfoService = {
  // جلب معلومات "من نحن"
  async get(): Promise<AboutInfo | null> {
    const { data, error } = await supabase
      .from('about_info')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // تحديث معلومات "من نحن"
  async update(info: Partial<AboutInfo>): Promise<AboutInfo> {
    // أولاً نتحقق من وجود سجل
    const existing = await this.get();
    
    if (existing) {
      const { data, error } = await supabase
        .from('about_info')
        .update({ ...info, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      // التأكد من وجود المحتوى عند الإنشاء
      const insertData = {
        content: info.content || 'معلومات عن المحل',
        phone: info.phone,
        whatsapp: info.whatsapp,
        facebook: info.facebook,
        instagram: info.instagram,
        address: info.address,
        hours: info.hours,
        image: info.image
      };
      
      const { data, error } = await supabase
        .from('about_info')
        .insert(insertData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  }
};
