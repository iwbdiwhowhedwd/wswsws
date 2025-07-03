
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Palette, Type, Monitor, Smartphone } from "lucide-react";
import ImageUpload from "./ImageUpload";

interface AppCustomizationProps {
  onSave: (settings: any) => void;
}

const AppCustomization = ({ onSave }: AppCustomizationProps) => {
  const [appSettings, setAppSettings] = useState({
    appName: "مجوهرات أبو رميلة",
    appDescription: "تطبيق لعرض أسعار الذهب والمجوهرات",
    appIcon: undefined as string | undefined,
    primaryColor: "#d97706",
    secondaryColor: "#fed7aa",
    fontFamily: "Cairo",
    headerTitle: "مجوهرات أبو رميلة",
    footerText: "جميع الحقوق محفوظة © 2024",
    welcomeMessage: "مرحباً بكم في متجر أبو رميلة للمجوهرات",
    contactInfo: {
      address: "عمان - الأردن",
      phone: "+962 7 1234 5678",
      email: "info@aburumailajewelry.com"
    }
  });

  const { toast } = useToast();

  const handleSave = () => {
    onSave(appSettings);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تطبيق تخصيصات التطبيق بنجاح",
    });
  };

  const resetToDefault = () => {
    setAppSettings({
      appName: "مجوهرات أبو رميلة",
      appDescription: "تطبيق لعرض أسعار الذهب والمجوهرات",
      appIcon: undefined,
      primaryColor: "#d97706",
      secondaryColor: "#fed7aa",
      fontFamily: "Cairo",
      headerTitle: "مجوهرات أبو رميلة",
      footerText: "جميع الحقوق محفوظة © 2024",
      welcomeMessage: "مرحباً بكم في متجر أبو رميلة للمجوهرات",
      contactInfo: {
        address: "عمان - الأردن",
        phone: "+962 7 1234 5678",
        email: "info@aburumailajewelry.com"
      }
    });
    toast({
      title: "تمت الإعادة",
      description: "تم إعادة تعيين الإعدادات للوضع الافتراضي",
    });
  };

  return (
    <div className="space-y-6 max-h-96 overflow-y-auto">
      <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
        <CardHeader>
          <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            تخصيص التطبيق
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* معلومات التطبيق الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>اسم التطبيق</Label>
              <Input
                value={appSettings.appName}
                onChange={(e) => setAppSettings({
                  ...appSettings,
                  appName: e.target.value
                })}
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
            
            <div>
              <Label>عنوان الرأس</Label>
              <Input
                value={appSettings.headerTitle}
                onChange={(e) => setAppSettings({
                  ...appSettings,
                  headerTitle: e.target.value
                })}
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
          </div>

          {/* أيقونة التطبيق */}
          <div>
            <Label className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              أيقونة التطبيق
            </Label>
            <ImageUpload
              currentImage={appSettings.appIcon}
              onImageChange={(image) => setAppSettings({
                ...appSettings,
                appIcon: image
              })}
              label="اختر أيقونة التطبيق"
            />
          </div>

          {/* وصف التطبيق */}
          <div>
            <Label>وصف التطبيق</Label>
            <Textarea
              value={appSettings.appDescription}
              onChange={(e) => setAppSettings({
                ...appSettings,
                appDescription: e.target.value
              })}
              className="border-amber-300 focus:border-amber-500"
              rows={3}
            />
          </div>

          {/* الألوان */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                اللون الأساسي
              </Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={appSettings.primaryColor}
                  onChange={(e) => setAppSettings({
                    ...appSettings,
                    primaryColor: e.target.value
                  })}
                  className="w-16 h-10 p-1 border-amber-300"
                />
                <Input
                  value={appSettings.primaryColor}
                  onChange={(e) => setAppSettings({
                    ...appSettings,
                    primaryColor: e.target.value
                  })}
                  className="flex-1 border-amber-300 focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <Label>اللون الثانوي</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={appSettings.secondaryColor}
                  onChange={(e) => setAppSettings({
                    ...appSettings,
                    secondaryColor: e.target.value
                  })}
                  className="w-16 h-10 p-1 border-amber-300"
                />
                <Input
                  value={appSettings.secondaryColor}
                  onChange={(e) => setAppSettings({
                    ...appSettings,
                    secondaryColor: e.target.value
                  })}
                  className="flex-1 border-amber-300 focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* الخط */}
          <div>
            <Label className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              نوع الخط
            </Label>
            <select
              value={appSettings.fontFamily}
              onChange={(e) => setAppSettings({
                ...appSettings,
                fontFamily: e.target.value
              })}
              className="w-full h-10 px-3 py-2 border border-amber-300 rounded-md focus:border-amber-500 focus:outline-none"
            >
              <option value="Cairo">Cairo</option>
              <option value="Amiri">Amiri</option>
              <option value="Tajawal">Tajawal</option>
              <option value="Almarai">Almarai</option>
            </select>
          </div>

          {/* رسالة الترحيب */}
          <div>
            <Label>رسالة الترحيب</Label>
            <Input
              value={appSettings.welcomeMessage}
              onChange={(e) => setAppSettings({
                ...appSettings,
                welcomeMessage: e.target.value
              })}
              className="border-amber-300 focus:border-amber-500"
            />
          </div>

          {/* نص التذييل */}
          <div>
            <Label>نص التذييل</Label>
            <Input
              value={appSettings.footerText}
              onChange={(e) => setAppSettings({
                ...appSettings,
                footerText: e.target.value
              })}
              className="border-amber-300 focus:border-amber-500"
            />
          </div>

          {/* معلومات الاتصال */}
          <div className="space-y-3">
            <Label className="text-base font-medium">معلومات الاتصال</Label>
            <div className="grid grid-cols-1 gap-3">
              <Input
                placeholder="العنوان"
                value={appSettings.contactInfo.address}
                onChange={(e) => setAppSettings({
                  ...appSettings,
                  contactInfo: {
                    ...appSettings.contactInfo,
                    address: e.target.value
                  }
                })}
                className="border-amber-300 focus:border-amber-500"
              />
              <Input
                placeholder="رقم الهاتف"
                value={appSettings.contactInfo.phone}
                onChange={(e) => setAppSettings({
                  ...appSettings,
                  contactInfo: {
                    ...appSettings.contactInfo,
                    phone: e.target.value
                  }
                })}
                className="border-amber-300 focus:border-amber-500"
              />
              <Input
                placeholder="البريد الإلكتروني"
                value={appSettings.contactInfo.email}
                onChange={(e) => setAppSettings({
                  ...appSettings,
                  contactInfo: {
                    ...appSettings.contactInfo,
                    email: e.target.value
                  }
                })}
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
          </div>

          {/* معاينة */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
            <h4 className="text-sm font-medium text-amber-800 mb-2">معاينة</h4>
            <div 
              className="p-3 rounded-md text-center"
              style={{ 
                backgroundColor: appSettings.secondaryColor,
                color: appSettings.primaryColor,
                fontFamily: appSettings.fontFamily
              }}
            >
              {appSettings.appIcon && (
                <img
                  src={appSettings.appIcon}
                  alt="App Icon"
                  className="w-8 h-8 mx-auto mb-2 rounded"
                />
              )}
              <h5 className="font-bold">{appSettings.headerTitle}</h5>
              <p className="text-xs mt-1">{appSettings.welcomeMessage}</p>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              حفظ التخصيصات
            </Button>
            <Button
              variant="outline"
              onClick={resetToDefault}
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              إعادة تعيين
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppCustomization;
