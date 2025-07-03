import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Settings, Mail, Phone, MessageSquare, Check, X, Star, Shield, Palette, Info, Bell } from "lucide-react";
import AboutSection from "./AboutSection";
import BookingManagement from "./BookingManagement";
import InvoiceGenerator from "./InvoiceGenerator";
import ReviewSystem from "./ReviewSystem";
import ImageUpload from "./ImageUpload";
import AppInfoManagement from "./AppInfoManagement";
import NotificationSystem from "./NotificationSystem";
import PushNotificationSystem from "./PushNotificationSystem";
import {
  goldItemsService,
  categoriesService,
  aboutInfoService,
  type GoldItem as SupabaseGoldItem
} from "@/services/supabaseService";

interface GoldItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  prices: {
    jod: number;
    usd: number;
    ils: number;
  };
  lastUpdated: string;
  isFavorite: boolean;
  isBooked?: boolean;
  category?: string;
  allowBooking?: boolean;
}

interface AboutData {
  content: string;
  phone: string;
  whatsapp: string;
  facebook: string;
  instagram: string;
  address: string;
  hours: string;
  image?: string;
}

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
  itemId: string;
  itemName: string;
  itemPrice: any;
  bookingDate: string;
  status: "pending" | "confirmed" | "cancelled";
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface AppInfo {
  title: string;
  description: string;
  vision: string;
  mission: string;
  history: string;
  features: string;
}

interface AdminPanelProps {
  goldItems: GoldItem[];
  aboutData: AboutData;
  bookings: Booking[];
  categories: Category[];
  onUpdateItems: (items: GoldItem[]) => void;
  onUpdateAbout: (data: AboutData) => void;
  onUpdateBooking: (bookingId: string, status: string) => void;
  onUpdateCategories: (newCategories: Category[]) => void;
  onSendNotification: (notification: any) => void;
  onLogout: () => void;
  currentPassword?: string;
  onPasswordChange?: (newPassword: string) => void;
  reviews?: any[];
  onApproveReview?: (reviewId: string) => void;
  onDeleteReview?: (reviewId: string) => void;
  appInfo?: AppInfo;
  onUpdateAppInfo?: (appInfo: AppInfo) => void;
}

const AdminPanel = ({ 
  goldItems,
  aboutData,
  bookings,
  categories,
  onUpdateItems,
  onUpdateAbout,
  onUpdateBooking,
  onUpdateCategories,
  onSendNotification,
  onLogout,
  currentPassword = "1234",
  onPasswordChange = () => {},
  reviews = [],
  onApproveReview = () => {},
  onDeleteReview = () => {},
  appInfo = {
    title: "مجوهرات أبو رميلة",
    description: "أفضل أنواع الذهب والمجوهرات الفاخرة",
    vision: "نحن نسعى لنكون الخيار الأول للعملاء الباحثين عن الجودة والأناقة",
    mission: "تقديم أجود أنواع المجوهرات بأسعار منافسة وخدمة متميزة",
    history: "تأسست مجوهرات أبو رميلة عام 1950 وأصبحت من أعرق المحلات في المنطقة",
    features: "• خبرة أكثر من 70 عاماً\n• ضمان على جميع المنتجات\n• أسعار منافسة\n• خدمة عملاء متميزة"
  },
  onUpdateAppInfo = () => {}
}: AdminPanelProps) => {
  const [newGoldItem, setNewGoldItem] = useState<Omit<GoldItem, 'id'>>({
    name: "",
    description: "",
    image: "",
    prices: { jod: 0, usd: 0, ils: 0 },
    lastUpdated: new Date().toISOString(),
    isFavorite: false,
    category: categories[0]?.id || "",
    allowBooking: true
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    color: "#d97706",
  });
  const [password, setPassword] = useState(currentPassword);
  const [editingAbout, setEditingAbout] = useState({
    content: aboutData.content,
    phone: aboutData.phone,
    whatsapp: aboutData.whatsapp,
    facebook: aboutData.facebook,
    instagram: aboutData.instagram,
    address: aboutData.address,
    hours: aboutData.hours,
    image: aboutData.image
  });
  const { toast } = useToast();

  const handleAddItem = async () => {
    try {
      const supabaseItem = {
        title: newGoldItem.name,
        description: newGoldItem.description,
        image: newGoldItem.image,
        price_jod: newGoldItem.prices.jod,
        price_usd: newGoldItem.prices.usd,
        price_ils: newGoldItem.prices.ils,
        reserved: false,
        is_favorite: newGoldItem.isFavorite,
        category: newGoldItem.category,
        allow_booking: newGoldItem.allowBooking || true
      };

      await goldItemsService.create(supabaseItem);
      
      setNewGoldItem({
        name: "",
        description: "",
        image: "",
        prices: { jod: 0, usd: 0, ils: 0 },
        lastUpdated: new Date().toISOString(),
        isFavorite: false,
        category: categories[0]?.id || "",
        allowBooking: true
      });
      
      toast({
        title: "تمت إضافة القطعة",
        description: "تمت إضافة القطعة بنجاح وستظهر لجميع المستخدمين",
      });
    } catch (error) {
      console.error('Error adding item:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة القطعة",
        variant: "destructive"
      });
    }
  };

  const handleUpdateItem = async (id: string, updatedItem: GoldItem) => {
    try {
      const supabaseUpdates = {
        title: updatedItem.name,
        description: updatedItem.description,
        image: updatedItem.image,
        price_jod: updatedItem.prices.jod,
        price_usd: updatedItem.prices.usd,
        price_ils: updatedItem.prices.ils,
        reserved: updatedItem.isBooked || false,
        is_favorite: updatedItem.isFavorite,
        category: updatedItem.category,
        allow_booking: updatedItem.allowBooking !== false
      };

      await goldItemsService.update(id, supabaseUpdates);
      
      toast({
        title: "تم تحديث القطعة",
        description: "تم تحديث معلومات القطعة بنجاح",
      });
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث القطعة",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await goldItemsService.delete(id);
      toast({
        title: "تم حذف القطعة",
        description: "تم حذف القطعة بنجاح",
      });
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف القطعة",
        variant: "destructive"
      });
    }
  };

  const handleAddCategory = async () => {
    try {
      await categoriesService.create(newCategory);
      
      setNewCategory({
        name: "",
        description: "",
        color: "#d97706",
      });
      
      toast({
        title: "تمت إضافة التصنيف",
        description: "تمت إضافة التصنيف بنجاح",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة التصنيف",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCategory = async (id: string, updatedCategory: Category) => {
    try {
      await categoriesService.update(id, {
        name: updatedCategory.name,
        description: updatedCategory.description,
        color: updatedCategory.color
      });
      
      toast({
        title: "تم تحديث التصنيف",
        description: "تم تحديث معلومات التصنيف بنجاح",
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث التصنيف",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await categoriesService.delete(id);
      toast({
        title: "تم حذف التصنيف",
        description: "تم حذف التصنيف بنجاح",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حذف التصنيف",
        variant: "destructive"
      });
    }
  };

  const handleSaveAboutChanges = async () => {
    try {
      await aboutInfoService.update(editingAbout);
      onUpdateAbout(editingAbout);
      toast({
        title: "تم حفظ التغييرات ✅",
        description: "تم تحديث معلومات 'من نحن' بنجاح وحفظها في قاعدة البيانات",
      });
    } catch (error) {
      console.error('Error updating about info:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ التغييرات",
        variant: "destructive"
      });
    }
  };

  const handleResetAboutChanges = () => {
    setEditingAbout({
      content: aboutData.content,
      phone: aboutData.phone,
      whatsapp: aboutData.whatsapp,
      facebook: aboutData.facebook,
      instagram: aboutData.instagram,
      address: aboutData.address,
      hours: aboutData.hours,
      image: aboutData.image
    });
    toast({
      title: "تم إعادة التعيين",
      description: "تم إرجاع البيانات للحالة الأصلية",
    });
  };

  const handleChangePassword = () => {
    if (password) {
      onPasswordChange(password);
      toast({
        title: "تم تغيير كلمة المرور",
        description: "تم تغيير كلمة المرور بنجاح",
      });
    }
  };

  const handleToggleBooking = async (id: string) => {
    const item = goldItems.find(item => item.id === id);
    if (item) {
      await handleUpdateItem(id, { ...item, allowBooking: !item.allowBooking });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100">
      <header className="bg-white/50 backdrop-blur-sm py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-amber-800">
            لوحة التحكم - متصل مع Supabase
          </h1>
          <Button onClick={onLogout} variant="outline">
            تسجيل الخروج
          </Button>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="grid w-full grid-cols-8 mb-6 bg-white/50 backdrop-blur-sm">
            <TabsTrigger value="items" className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium">
              القطع الذهبية
            </TabsTrigger>
            <TabsTrigger value="categories" className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium">
              التصنيفات
            </TabsTrigger>
            <TabsTrigger value="about" className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium">
              من نحن
            </TabsTrigger>
            <TabsTrigger value="app-info" className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium">
              عن التطبيق
            </TabsTrigger>
            <TabsTrigger value="bookings" className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium">
              الحجوزات
            </TabsTrigger>
            <TabsTrigger value="notifications" className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium">
              الإشعارات الفورية
            </TabsTrigger>
            <TabsTrigger value="password" className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium">
              كلمة المرور
            </TabsTrigger>
            <TabsTrigger value="invoices" className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium">
              فواتير
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-amber-800 data-[state=active]:bg-amber-500 data-[state=active]:text-white font-medium">
              مراجعات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="items">
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  إدارة القطع الذهبية - متصلة مع Supabase
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    🟢 متصل مع قاعدة البيانات المركزية - جميع التعديلات تظهر فوراً لجميع المستخدمين
                  </p>
                </div>
                
                <h3 className="text-xl font-semibold text-amber-700">إضافة قطعة جديدة</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">اسم القطعة</Label>
                    <Input
                      id="name"
                      value={newGoldItem.name}
                      onChange={(e) => setNewGoldItem({ ...newGoldItem, name: e.target.value })}
                      className="border-amber-300 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">التصنيف</Label>
                    <select
                      id="category"
                      value={newGoldItem.category}
                      onChange={(e) => setNewGoldItem({ ...newGoldItem, category: e.target.value })}
                      className="w-full px-3 py-2 border border-amber-300 rounded-md focus:border-amber-500 focus:outline-none"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="jod">السعر (د.أ)</Label>
                    <Input
                      id="jod"
                      type="text"
                      inputMode="decimal"
                      value={newGoldItem.prices.jod || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          setNewGoldItem({ 
                            ...newGoldItem, 
                            prices: { 
                              ...newGoldItem.prices, 
                              jod: value === "" ? 0 : parseFloat(value) || 0
                            } 
                          });
                        }
                      }}
                      className="border-amber-300 focus:border-amber-500"
                      placeholder="أدخل السعر"
                    />
                  </div>
                  <div>
                    <Label htmlFor="usd">السعر ($)</Label>
                    <Input
                      id="usd"
                      type="text"
                      inputMode="decimal"
                      value={newGoldItem.prices.usd || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          setNewGoldItem({ 
                            ...newGoldItem, 
                            prices: { 
                              ...newGoldItem.prices, 
                              usd: value === "" ? 0 : parseFloat(value) || 0
                            } 
                          });
                        }
                      }}
                      className="border-amber-300 focus:border-amber-500"
                      placeholder="أدخل السعر"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ils">السعر (₪)</Label>
                    <Input
                      id="ils"
                      type="text"
                      inputMode="decimal"
                      value={newGoldItem.prices.ils || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          setNewGoldItem({ 
                            ...newGoldItem, 
                            prices: { 
                              ...newGoldItem.prices, 
                              ils: value === "" ? 0 : parseFloat(value) || 0
                            } 
                          });
                        }
                      }}
                      className="border-amber-300 focus:border-amber-500"
                      placeholder="أدخل السعر"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="allowBooking"
                      checked={newGoldItem.allowBooking || false}
                      onCheckedChange={(checked) => setNewGoldItem({ ...newGoldItem, allowBooking: checked })}
                    />
                    <Label htmlFor="allowBooking" className="text-sm">
                      إظهار زر "احجز الآن"
                    </Label>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={newGoldItem.description}
                    onChange={(e) => setNewGoldItem({ ...newGoldItem, description: e.target.value })}
                    className="border-amber-300 focus:border-amber-500"
                    rows={3}
                  />
                </div>

                <div>
                  <ImageUpload
                    currentImage={newGoldItem.image}
                    onImageChange={(image) => setNewGoldItem({ ...newGoldItem, image: image || "" })}
                    label="صورة القطعة"
                  />
                </div>

                <Button onClick={handleAddItem} className="bg-amber-600 hover:bg-amber-700 text-white">
                  إضافة القطعة إلى Supabase
                </Button>

                <h3 className="text-xl font-semibold text-amber-700 mt-6">تعديل وحذف القطع</h3>
                <div className="space-y-3">
                  {goldItems.map((item) => (
                    <Card key={item.id} className="border border-amber-200 p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                          )}
                          <div>
                            <h4 className="font-semibold text-amber-800">{item.name}</h4>
                            <p className="text-sm text-gray-600">السعر: {item.prices.jod} د.أ</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">احجز الآن:</span>
                              <Switch
                                checked={item.allowBooking !== false}
                                onCheckedChange={() => handleToggleBooking(item.id)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const updatedName = prompt("أدخل الاسم الجديد", item.name);
                              if (updatedName) {
                                handleUpdateItem(item.id, { ...item, name: updatedName });
                              }
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            تعديل الاسم
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteItem(item.id)}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories">
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  إدارة التصنيفات
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <h3 className="text-xl font-semibold text-amber-700">إضافة تصنيف جديد</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">اسم التصنيف</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="border-amber-300 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">لون التصنيف</Label>
                    <Input
                      type="color"
                      id="color"
                      value={newCategory.color}
                      onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      className="h-10 w-full border-amber-300 focus:border-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">الوصف</Label>
                  <Textarea
                    id="description"
                    value={newCategory.description}
                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                    className="border-amber-300 focus:border-amber-500"
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddCategory} className="bg-amber-600 hover:bg-amber-700 text-white">
                  إضافة التصنيف
                </Button>

                <h3 className="text-xl font-semibold text-amber-700 mt-6">تعديل وحذف التصنيفات</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <Card key={category.id} className="border border-amber-200 p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-amber-800">{category.name}</h4>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const updatedName = prompt("أدخل الاسم الجديد", category.name);
                              if (updatedName) {
                                handleUpdateCategory(category.id, { ...category, name: updatedName });
                              }
                            }}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            تعديل الاسم
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            حذف
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about">
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  تعديل معلومات "من نحن" - محرر متقدم
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    ✏️ يمكنك التعديل على جميع الحقول بحرية ثم الضغط على "حفظ التغييرات" لتطبيقها
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="content" className="text-base font-medium text-amber-800">المحتوى الرئيسي</Label>
                  <Textarea
                    id="content"
                    value={editingAbout.content}
                    onChange={(e) => setEditingAbout(prev => ({...prev, content: e.target.value}))}
                    className="border-amber-300 focus:border-amber-500 mt-2"
                    rows={6}
                    placeholder="اكتب المحتوى الرئيسي لصفحة 'من نحن'"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-base font-medium text-amber-800">رقم الهاتف</Label>
                    <Input
                      id="phone"
                      value={editingAbout.phone}
                      onChange={(e) => setEditingAbout(prev => ({...prev, phone: e.target.value}))}
                      className="border-amber-300 focus:border-amber-500 mt-2"
                      placeholder="+962 7 1234 5678"
                    />
                  </div>
                  <div>
                    <Label htmlFor="whatsapp" className="text-base font-medium text-amber-800">رقم الواتساب</Label>
                    <Input
                      id="whatsapp"
                      value={editingAbout.whatsapp}
                      onChange={(e) => setEditingAbout(prev => ({...prev, whatsapp: e.target.value}))}
                      className="border-amber-300 focus:border-amber-500 mt-2"
                      placeholder="962712345678"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facebook" className="text-base font-medium text-amber-800">صفحة الفيسبوك</Label>
                    <Input
                      id="facebook"
                      value={editingAbout.facebook}
                      onChange={(e) => setEditingAbout(prev => ({...prev, facebook: e.target.value}))}
                      className="border-amber-300 focus:border-amber-500 mt-2"
                      placeholder="اسم الصفحة أو الرابط"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instagram" className="text-base font-medium text-amber-800">حساب الانستغرام</Label>
                    <Input
                      id="instagram"
                      value={editingAbout.instagram}
                      onChange={(e) => setEditingAbout(prev => ({...prev, instagram: e.target.value}))}
                      className="border-amber-300 focus:border-amber-500 mt-2"
                      placeholder="اسم الحساب أو الرابط"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address" className="text-base font-medium text-amber-800">العنوان الكامل</Label>
                  <Input
                    id="address"
                    value={editingAbout.address}
                    onChange={(e) => setEditingAbout(prev => ({...prev, address: e.target.value}))}
                    className="border-amber-300 focus:border-amber-500 mt-2"
                    placeholder="العنوان الكامل للمحل"
                  />
                </div>
                
                <div>
                  <Label htmlFor="hours" className="text-base font-medium text-amber-800">ساعات العمل</Label>
                  <Input
                    id="hours"
                    value={editingAbout.hours}
                    onChange={(e) => setEditingAbout(prev => ({...prev, hours: e.target.value}))}
                    className="border-amber-300 focus:border-amber-500 mt-2"
                    placeholder="مثال: السبت - الخميس: 9:00 ص - 10:00 م"
                  />
                </div>

                <div>
                  <Label className="text-base font-medium text-amber-800">صورة المحل أو الشعار</Label>
                  <div className="mt-2">
                    <ImageUpload
                      currentImage={editingAbout.image}
                      onImageChange={(image) => setEditingAbout(prev => ({...prev, image: image || ""}))}
                      label="صورة المحل"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-amber-200">
                  <Button
                    onClick={handleSaveAboutChanges}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    حفظ التغييرات ✅
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetAboutChanges}
                    className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    إعادة التعيين ↺
                  </Button>
                </div>

                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mt-4">
                  <h4 className="text-amber-800 font-medium mb-2">معاينة سريعة:</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><strong>الهاتف:</strong> {editingAbout.phone || "غير محدد"}</p>
                    <p><strong>العنوان:</strong> {editingAbout.address || "غير محدد"}</p>
                    <p><strong>ساعات العمل:</strong> {editingAbout.hours || "غير محدد"}</p>
                    <p><strong>المحتوى:</strong> {editingAbout.content.substring(0, 100)}{editingAbout.content.length > 100 ? "..." : ""}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="app-info">
            <AppInfoManagement 
              appInfo={appInfo}
              onUpdateAppInfo={onUpdateAppInfo}
            />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingManagement bookings={bookings} onUpdateBooking={onUpdateBooking} />
          </TabsContent>

          <TabsContent value="notifications">
            <PushNotificationSystem />
          </TabsContent>

          <TabsContent value="password">
            <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
              <CardHeader>
                <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  تغيير كلمة المرور
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="password">كلمة المرور الجديدة</Label>
                    <Input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-amber-300 focus:border-amber-500"
                    />
                  </div>
                  <Button onClick={handleChangePassword} className="bg-amber-600 hover:bg-amber-700 text-white">
                    تغيير كلمة المرور
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="invoices">
            <InvoiceGenerator bookings={bookings} />
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewSystem 
              reviews={reviews} 
              onApproveReview={onApproveReview}
              onDeleteReview={onDeleteReview}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
