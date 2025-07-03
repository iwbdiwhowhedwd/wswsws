import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import GoldPrices from "@/components/GoldPrices";
import AboutSection from "@/components/AboutSection";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel from "@/components/AdminPanel";
import Header from "@/components/Header";
import ContentProtection from "@/components/ContentProtection";
import NotificationProvider from "@/components/NotificationProvider";
import { useSupabaseData } from "@/hooks/useSupabaseData";
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
} from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const {
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
    setAboutInfo
  } = useSupabaseData();

  const [currentPassword, setCurrentPassword] = useState("1234");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  
  const { toast } = useToast();

  // تحويل البيانات للشكل المتوافق مع المكونات الحالية
  const convertedGoldItems = goldItems.map(item => ({
    id: item.id,
    name: item.title,
    description: item.description || "",
    image: item.image,
    prices: {
      jod: item.price_jod,
      usd: item.price_usd,
      ils: item.price_ils
    },
    lastUpdated: new Date(item.updated_at).toLocaleDateString(),
    isFavorite: item.is_favorite,
    isBooked: item.reserved,
    category: item.category,
    allowBooking: item.allow_booking
  }));

  const convertedReservations = reservations.map(res => ({
    id: res.id,
    customerName: res.customer_name,
    phone: res.phone,
    email: res.email,
    notes: res.notes,
    itemId: res.item_id || "",
    itemName: goldItems.find(item => item.id === res.item_id)?.title || "",
    itemPrice: {
      jod: goldItems.find(item => item.id === res.item_id)?.price_jod || 0,
      usd: goldItems.find(item => item.id === res.item_id)?.price_usd || 0,
      ils: goldItems.find(item => item.id === res.item_id)?.price_ils || 0
    },
    bookingDate: res.created_at,
    status: res.status as "pending" | "confirmed" | "cancelled"
  }));

  const convertedCategories = categories.map(cat => ({
    id: cat.id,
    name: cat.name,
    description: cat.description || "",
    color: cat.color
  }));

  const convertedReviews = reviews.map(review => ({
    id: review.id,
    customerName: review.customer_name,
    itemId: review.item_id || "",
    itemName: goldItems.find(item => item.id === review.item_id)?.title || "",
    rating: review.rating,
    comment: review.comment || "",
    date: new Date(review.created_at).toLocaleDateString(),
    approved: review.approved
  }));

  const convertedAbout = aboutInfo ? {
    content: aboutInfo.content,
    phone: aboutInfo.phone || "",
    whatsapp: aboutInfo.whatsapp || "",
    facebook: aboutInfo.facebook || "",
    instagram: aboutInfo.instagram || "",
    address: aboutInfo.address || "",
    hours: aboutInfo.hours || "",
    image: aboutInfo.image
  } : {
    content: "",
    phone: "",
    whatsapp: "",
    facebook: "",
    instagram: "",
    address: "",
    hours: "",
    image: undefined
  };

  const convertedAppInfo = appInfo ? {
    title: appInfo.title,
    description: appInfo.description || "",
    vision: appInfo.vision || "",
    mission: appInfo.mission || "",
    history: appInfo.history || "",
    features: appInfo.features || ""
  } : {
    title: "مجوهرات أبو رميلة",
    description: "أفضل أنواع الذهب والمجوهرات الفاخرة",
    vision: "",
    mission: "",
    history: "",
    features: ""
  };

  // معالجات التحديث
  const handleUpdateItems = async (items: any[]) => {
    // هذا للتوافق مع المكونات الحالية فقط
    // التحديثات الفعلية تتم من خلال AdminPanel
  };

  const handleUpdateAbout = async (data: any) => {
    try {
      await aboutInfoService.update(data);
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلومات 'من نحن' بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث المعلومات",
        variant: "destructive",
      });
    }
  };

  const handlePasswordChange = (newPassword: string) => {
    setCurrentPassword(newPassword);
  };

  const handleBooking = async (bookingData: any) => {
    try {
      const reservation = {
        item_id: bookingData.itemId,
        customer_name: bookingData.customerName,
        phone: bookingData.phone,
        email: bookingData.email,
        notes: bookingData.notes,
        status: 'pending' as const
      };
      
      await reservationsService.create(reservation);
      
      // تحديث حالة القطعة لتصبح محجوزة
      await goldItemsService.update(bookingData.itemId, { reserved: true });
      
      toast({
        title: "تم الحجز بنجاح",
        description: "سيتم التواصل معك قريباً",
      });
    } catch (error) {
      toast({
        title: "خطأ في الحجز",
        description: "حدث خطأ أثناء إرسال طلب الحجز",
        variant: "destructive",
      });
    }
  };

  const handleUpdateBooking = async (bookingId: string, status: string) => {
    try {
      await reservationsService.updateStatus(bookingId, status);
      toast({
        title: "تم التحديث",
        description: "تم تحديث حالة الحجز بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث الحجز",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategories = async (newCategories: any[]) => {
    // هذا للتوافق مع المكونات الحالية فقط
    // التحديثات الفعلية تتم من خلال AdminPanel
  };

  const handleSendNotification = (notification: any) => {
    console.log("Sending notification:", notification);
  };

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdminLogin(false);
  };
  
  const handleSubmitReview = async (reviewData: any) => {
    try {
      await reviewsService.create({
        item_id: reviewData.itemId,
        customer_name: reviewData.customerName,
        rating: reviewData.rating,
        comment: reviewData.comment
      });
      
      toast({
        title: "تم إرسال المراجعة",
        description: "سيتم مراجعتها والموافقة عليها قريباً",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إرسال المراجعة",
        variant: "destructive",
      });
    }
  };

  const handleApproveReview = async (reviewId: string) => {
    try {
      await reviewsService.approve(reviewId);
      toast({
        title: "تم قبول المراجعة",
        description: "تم قبول المراجعة وسيتم عرضها للعملاء",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء قبول المراجعة",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await reviewsService.delete(reviewId);
      toast({
        title: "تم حذف المراجعة",
        description: "تم حذف المراجعة بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف المراجعة",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAppInfo = async (newAppInfo: any) => {
    try {
      await appInfoService.update(newAppInfo);
      setAppInfo(prev => prev ? { ...prev, ...newAppInfo } : null);
      document.title = newAppInfo.title;
      toast({
        title: "تم التحديث",
        description: "تم تحديث معلومات التطبيق بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث معلومات التطبيق",
        variant: "destructive",
      });
    }
  };

  // معالج الدخول السري (triple click)
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  const handleSecretAccess = () => {
    const currentTime = Date.now();
    
    if (currentTime - lastClickTime < 500) {
      setClickCount(prev => prev + 1);
    } else {
      setClickCount(1);
    }
    
    setLastClickTime(currentTime);
    
    if (clickCount >= 2) {
      setShowAdminLogin(true);
      setClickCount(0);
    }
  };

  if (loading) {
    return (
      <NotificationProvider>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-amber-800 text-lg">جاري تحميل البيانات...</p>
          </div>
        </div>
      </NotificationProvider>
    );
  }

  if (showAdminLogin && !isAdminLoggedIn) {
    return (
      <NotificationProvider>
        <AdminLogin
          onLogin={handleAdminLogin}
          currentPassword={currentPassword}
        />
      </NotificationProvider>
    );
  }

  if (isAdminLoggedIn) {
    return (
      <NotificationProvider>
        <AdminPanel
          goldItems={convertedGoldItems}
          aboutData={convertedAbout}
          bookings={convertedReservations}
          categories={convertedCategories}
          reviews={convertedReviews}
          appInfo={convertedAppInfo}
          onUpdateItems={handleUpdateItems}
          onUpdateAbout={handleUpdateAbout}
          onUpdateBooking={handleUpdateBooking}
          onUpdateCategories={handleUpdateCategories}
          onSendNotification={handleSendNotification}
          onApproveReview={handleApproveReview}
          onDeleteReview={handleDeleteReview}
          onUpdateAppInfo={handleUpdateAppInfo}
          onLogout={handleAdminLogout}
          currentPassword={currentPassword}
          onPasswordChange={handlePasswordChange}
        />
      </NotificationProvider>
    );
  }

  return (
    <NotificationProvider>
      <ContentProtection>
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
          <Header appInfo={convertedAppInfo} />
          
          <div className="container mx-auto px-4 pt-6 pb-20">
            <Tabs defaultValue="prices" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-black/10 backdrop-blur-sm">
                <TabsTrigger 
                  value="prices" 
                  className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium"
                >
                  أسعار الذهب
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium"
                >
                  عن أبو رميلة
                </TabsTrigger>
                <TabsTrigger 
                  value="app-info" 
                  className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium"
                >
                  عن التطبيق
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prices">
                <GoldPrices 
                  goldItems={convertedGoldItems} 
                  onBooking={handleBooking}
                  categories={convertedCategories}
                  onSubmitReview={handleSubmitReview}
                  reviews={convertedReviews}
                />
              </TabsContent>

              <TabsContent value="about">
                <AboutSection aboutData={convertedAbout} />
              </TabsContent>

              <TabsContent value="app-info">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-amber-200">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4 text-center">{convertedAppInfo.title}</h2>
                  <div className="space-y-4 text-gray-700">
                    <div>
                      <h3 className="text-lg font-semibold text-amber-700 mb-2">عن التطبيق</h3>
                      <p className="text-justify leading-relaxed">{convertedAppInfo.description}</p>
                    </div>
                    
                    {convertedAppInfo.vision && (
                      <div>
                        <h3 className="text-lg font-semibold text-amber-700 mb-2">رؤيتنا</h3>
                        <p className="text-justify leading-relaxed">{convertedAppInfo.vision}</p>
                      </div>
                    )}
                    
                    {convertedAppInfo.mission && (
                      <div>
                        <h3 className="text-lg font-semibold text-amber-700 mb-2">رسالتنا</h3>
                        <p className="text-justify leading-relaxed">{convertedAppInfo.mission}</p>
                      </div>
                    )}
                    
                    {convertedAppInfo.history && (
                      <div>
                        <h3 className="text-lg font-semibold text-amber-700 mb-2">تاريخنا</h3>
                        <p className="text-justify leading-relaxed">{convertedAppInfo.history}</p>
                      </div>
                    )}
                    
                    {convertedAppInfo.features && (
                      <div>
                        <h3 className="text-lg font-semibold text-amber-700 mb-2">مميزاتنا</h3>
                        <div className="whitespace-pre-line text-justify leading-relaxed">{convertedAppInfo.features}</div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* الدخول السري - triple click على الشعار */}
            <div 
              className="fixed bottom-4 right-4 cursor-pointer opacity-0 hover:opacity-10 transition-opacity"
              onClick={handleSecretAccess}
            >
              <div className="w-8 h-8 bg-amber-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </ContentProtection>
    </NotificationProvider>
  );
};

export default Index;
