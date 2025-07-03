
-- إنشاء جدول القطع الذهبية
CREATE TABLE public.gold_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  price_jod DECIMAL NOT NULL DEFAULT 0,
  price_usd DECIMAL NOT NULL DEFAULT 0,
  price_ils DECIMAL NOT NULL DEFAULT 0,
  reserved BOOLEAN NOT NULL DEFAULT false,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  category TEXT,
  allow_booking BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول الحجوزات
CREATE TABLE public.reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.gold_items(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول التصنيفات
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#d97706',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول المراجعات
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID REFERENCES public.gold_items(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول معلومات التطبيق
CREATE TABLE public.app_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  vision TEXT,
  mission TEXT,
  history TEXT,
  features TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إنشاء جدول معلومات "من نحن"
CREATE TABLE public.about_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  facebook TEXT,
  instagram TEXT,
  address TEXT,
  hours TEXT,
  image TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إدراج بيانات افتراضية للتصنيفات
INSERT INTO public.categories (id, name, description, color) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'خواتم', 'خواتم ذهبية مختلفة', '#d97706'),
  ('550e8400-e29b-41d4-a716-446655440002', 'أطقم', 'أطقم مجوهرات كاملة', '#059669');

-- إدراج بيانات افتراضية للقطع الذهبية
INSERT INTO public.gold_items (id, title, description, price_jod, price_usd, price_ils, category, allow_booking) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'خاتم ذهب عيار 21', 'خاتم ذهب فاخر عيار 21 قيراط', 45, 63, 235, '550e8400-e29b-41d4-a716-446655440001', true),
  ('550e8400-e29b-41d4-a716-446655440012', 'طقم مجوهرات كامل', 'طقم مجوهرات فاخر يشمل العقد والأقراط', 320, 450, 1680, '550e8400-e29b-41d4-a716-446655440002', true);

-- إدراج بيانات افتراضية لمعلومات التطبيق
INSERT INTO public.app_info (title, description, vision, mission, history, features) VALUES
  ('مجوهرات أبو رميلة', 'أفضل أنواع الذهب والمجوهرات الفاخرة', 'نحن نسعى لنكون الخيار الأول للعملاء الباحثين عن الجودة والأناقة', 'تقديم أجود أنواع المجوهرات بأسعار منافسة وخدمة متميزة', 'تأسست مجوهرات أبو رميلة عام 1950 وأصبحت من أعرق المحلات في المنطقة', '• خبرة أكثر من 70 عاماً
• ضمان على جميع المنتجات
• أسعار منافسة
• خدمة عملاء متميزة');

-- إدراج بيانات افتراضية لمعلومات "من نحن"
INSERT INTO public.about_info (content, phone, whatsapp, facebook, instagram, address, hours) VALUES
  ('مرحباً بكم في متجر أبو رميلة للمجوهرات، وجهتكم الأولى للحصول على أفضل أنواع الذهب والمجوهرات الفاخرة. نتميز بخبرة تزيد عن 25 عاماً في مجال الذهب والمجوهرات، ونقدم لعملائنا الكرام أفضل الأسعار وأعلى معايير الجودة.', '+970123456789', '970123456789', 'aburumailajewelry', 'aburumailajewelry', 'شارع الملك حسين، عمان - الأردن', 'السبت - الخميس، 9:00 ص - 9:00 م');

-- تفعيل Real-time للجداول
ALTER TABLE public.gold_items REPLICA IDENTITY FULL;
ALTER TABLE public.reservations REPLICA IDENTITY FULL;
ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER TABLE public.reviews REPLICA IDENTITY FULL;
ALTER TABLE public.app_info REPLICA IDENTITY FULL;
ALTER TABLE public.about_info REPLICA IDENTITY FULL;

-- إضافة الجداول إلى النشر المباشر
ALTER PUBLICATION supabase_realtime ADD TABLE public.gold_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.app_info;
ALTER PUBLICATION supabase_realtime ADD TABLE public.about_info;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX idx_gold_items_category ON public.gold_items(category);
CREATE INDEX idx_reservations_item_id ON public.reservations(item_id);
CREATE INDEX idx_reviews_item_id ON public.reviews(item_id);
CREATE INDEX idx_reviews_approved ON public.reviews(approved);
