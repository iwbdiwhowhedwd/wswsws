
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  goldItemsService,
  reservationsService,
  categoriesService,
  reviewsService,
  appInfoService,
  aboutInfoService,
  type GoldItem,
  type Reservation,
  type Category,
  type Review,
  type AppInfo,
  type AboutInfo
} from '@/services/supabaseService';

export const useSupabaseData = () => {
  const [goldItems, setGoldItems] = useState<GoldItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null);
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // تحميل البيانات الأولية
  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      const [
        itemsData,
        reservationsData,
        categoriesData,
        reviewsData,
        appInfoData,
        aboutInfoData
      ] = await Promise.all([
        goldItemsService.getAll(),
        reservationsService.getAll(),
        categoriesService.getAll(),
        reviewsService.getApproved(),
        appInfoService.get(),
        aboutInfoService.get()
      ]);

      setGoldItems(itemsData);
      setReservations(reservationsData);
      setCategories(categoriesData);
      setReviews(reviewsData);
      setAppInfo(appInfoData);
      setAboutInfo(aboutInfoData);
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل البيانات من الخادم",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // إعداد المزامنة المباشرة
  useEffect(() => {
    loadInitialData();

    // الاستماع للتغييرات المباشرة في القطع الذهبية
    const goldItemsChannel = supabase
      .channel('gold-items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gold_items' },
        (payload) => {
          console.log('Gold items change:', payload);
          if (payload.eventType === 'INSERT') {
            setGoldItems(prev => [payload.new as GoldItem, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setGoldItems(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as GoldItem : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setGoldItems(prev => prev.filter(item => item.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // الاستماع للتغييرات المباشرة في الحجوزات
    const reservationsChannel = supabase
      .channel('reservations-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        (payload) => {
          console.log('Reservations change:', payload);
          if (payload.eventType === 'INSERT') {
            const newReservation = {
              ...payload.new,
              status: payload.new.status as 'pending' | 'confirmed' | 'cancelled'
            } as Reservation;
            setReservations(prev => [newReservation, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedReservation = {
              ...payload.new,
              status: payload.new.status as 'pending' | 'confirmed' | 'cancelled'
            } as Reservation;
            setReservations(prev => prev.map(res => 
              res.id === payload.new.id ? updatedReservation : res
            ));
          }
        }
      )
      .subscribe();

    // الاستماع للتغييرات المباشرة في التصنيفات
    const categoriesChannel = supabase
      .channel('categories-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'categories' },
        (payload) => {
          console.log('Categories change:', payload);
          if (payload.eventType === 'INSERT') {
            setCategories(prev => [payload.new as Category, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setCategories(prev => prev.map(cat => 
              cat.id === payload.new.id ? payload.new as Category : cat
            ));
          } else if (payload.eventType === 'DELETE') {
            setCategories(prev => prev.filter(cat => cat.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    // الاستماع للتغييرات المباشرة في المراجعات
    const reviewsChannel = supabase
      .channel('reviews-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reviews' },
        (payload) => {
          console.log('Reviews change:', payload);
          // إعادة تحميل المراجعات المعتمدة فقط
          if (payload.new && typeof payload.new === 'object' && 'approved' in payload.new) {
            if (payload.new.approved || payload.eventType === 'DELETE') {
              reviewsService.getApproved().then(setReviews);
            }
          } else if (payload.eventType === 'DELETE') {
            reviewsService.getApproved().then(setReviews);
          }
        }
      )
      .subscribe();

    // تنظيف الاستماع عند إلغاء التحميل
    return () => {
      supabase.removeChannel(goldItemsChannel);
      supabase.removeChannel(reservationsChannel);
      supabase.removeChannel(categoriesChannel);
      supabase.removeChannel(reviewsChannel);
    };
  }, []);

  return {
    goldItems,
    reservations,
    categories,
    reviews,
    appInfo,
    aboutInfo,
    loading,
    setGoldItems,
    setReservations,
    setCategories,
    setReviews,
    setAppInfo,
    setAboutInfo,
    refreshData: loadInitialData
  };
};
