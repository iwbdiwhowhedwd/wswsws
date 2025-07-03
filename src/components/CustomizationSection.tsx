
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, Palette } from "lucide-react";

const CustomizationSection = () => {
  const [settings, setSettings] = useState({
    theme: "light",
    backgroundColor: "white",
    textColor: "black",
    fontFamily: "modern",
    fontSize: "medium",
  });
  
  const { toast } = useToast();

  // حفظ واسترجاع الإعدادات من التخزين المحلي
  useEffect(() => {
    const savedSettings = localStorage.getItem('customizationSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
  }, []);

  // تطبيق التخصيصات على الصفحة فوراً
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // تطبيق لون الخلفية
    if (settings.backgroundColor === "gold") {
      body.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)';
      body.style.minHeight = '100vh';
      root.style.setProperty('--bg-primary', '#fef3c7');
      root.style.setProperty('--bg-secondary', '#fed7aa');
    } else if (settings.backgroundColor === "black") {
      body.style.background = 'linear-gradient(135deg, #1f2937 0%, #374151 100%)';
      body.style.minHeight = '100vh';
      root.style.setProperty('--bg-primary', '#1f2937');
      root.style.setProperty('--bg-secondary', '#374151');
    } else {
      body.style.background = 'linear-gradient(135deg, #fef7ed 0%, #fff7ed 100%)';
      body.style.minHeight = '100vh';
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f9fafb');
    }
    
    // تطبيق لون الخط
    if (settings.textColor === "gold") {
      root.style.setProperty('--text-primary', '#d97706');
      root.style.setProperty('--text-secondary', '#92400e');
    } else if (settings.textColor === "white") {
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#f3f4f6');
    } else {
      root.style.setProperty('--text-primary', '#1f2937');
      root.style.setProperty('--text-secondary', '#374151');
    }
    
    // تطبيق حجم الخط
    const fontSize = settings.fontSize === "small" ? "14px" : 
                    settings.fontSize === "large" ? "18px" : "16px";
    root.style.setProperty('--font-size-base', fontSize);
    
    // تطبيق نوع الخط
    let fontFamily = '"Inter", sans-serif';
    if (settings.fontFamily === "traditional") {
      fontFamily = '"Times New Roman", serif';
    } else if (settings.fontFamily === "clear") {
      fontFamily = '"Arial", sans-serif';
    }
    root.style.setProperty('--font-family-base', fontFamily);
    
  }, [settings]);

  const backgroundOptions = [
    { value: "white", label: "أبيض كلاسيكي", class: "bg-white", preview: "#ffffff" },
    { value: "black", label: "أسود أنيق", class: "bg-gray-900", preview: "#1f2937" },
    { value: "gold", label: "ذهبي فاخر", class: "bg-gradient-to-br from-amber-100 to-amber-200", preview: "#fef3c7" },
  ];

  const textColorOptions = [
    { value: "black", label: "أسود", class: "text-black", preview: "#000000" },
    { value: "white", label: "أبيض", class: "text-white", preview: "#ffffff" },
    { value: "gold", label: "ذهبي", class: "text-amber-600", preview: "#d97706" },
  ];

  const fontFamilyOptions = [
    { value: "modern", label: "عصري (Inter)" },
    { value: "traditional", label: "تقليدي (Times)" },
    { value: "clear", label: "واضح (Arial)" },
  ];

  const fontSizeOptions = [
    { value: "small", label: "صغير (14px)" },
    { value: "medium", label: "متوسط (16px)" },
    { value: "large", label: "كبير (18px)" },
  ];

  const applySettings = () => {
    // حفظ الإعدادات في التخزين المحلي
    localStorage.setItem('customizationSettings', JSON.stringify(settings));
    
    toast({
      title: "تم حفظ الإعدادات ✅",
      description: "تم تطبيق التخصيصات بنجاح وحفظها في المتصفح",
    });
  };

  const resetSettings = () => {
    const defaultSettings = {
      theme: "light",
      backgroundColor: "white",
      textColor: "black",
      fontFamily: "modern",
      fontSize: "medium",
    };
    
    setSettings(defaultSettings);
    localStorage.removeItem('customizationSettings');
    
    toast({
      title: "تم إعادة تعيين الإعدادات ↺",
      description: "تم استعادة الإعدادات الافتراضية",
    });
  };

  const previewSettings = () => {
    toast({
      title: "معاينة التخصيصات 👁️",
      description: "يمكنك رؤية التغييرات مباشرة على الصفحة",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
        <CardHeader>
          <CardTitle className="text-xl text-amber-800 text-center flex items-center justify-center gap-2">
            <Palette className="h-6 w-6" />
            تخصيص التطبيق - نظام متقدم
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-sm">
              🎨 نظام التخصيص يعمل بشكل فعلي! التغييرات تظهر فوراً وتُحفظ في متصفحك
            </p>
          </div>

          {/* وضع الإضاءة */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-amber-800 flex items-center gap-2">
              <Sun className="h-4 w-4" />
              وضع الإضاءة
            </Label>
            <div className="flex gap-4">
              <Button
                variant={settings.theme === "light" ? "default" : "outline"}
                onClick={() => setSettings(prev => ({ ...prev, theme: "light" }))}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Sun className="h-4 w-4" />
                نهاري
              </Button>
              <Button
                variant={settings.theme === "dark" ? "default" : "outline"}
                onClick={() => setSettings(prev => ({ ...prev, theme: "dark" }))}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Moon className="h-4 w-4" />
                ليلي
              </Button>
            </div>
          </div>

          {/* لون الخلفية */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-amber-800">لون الخلفية</Label>
            <div className="grid grid-cols-1 gap-3">
              {backgroundOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={settings.backgroundColor === option.value ? "default" : "outline"}
                  onClick={() => setSettings(prev => ({ ...prev, backgroundColor: option.value }))}
                  className={`h-16 justify-between ${
                    settings.backgroundColor === option.value 
                      ? "border-amber-500 bg-amber-500 text-white" 
                      : "border-gray-300 hover:border-amber-300"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: option.preview }}
                  ></div>
                </Button>
              ))}
            </div>
          </div>

          {/* لون الخط */}
          <div className="space-y-3">
            <Label className="text-base font-medium text-amber-800">لون الخط</Label>
            <div className="grid grid-cols-1 gap-3">
              {textColorOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={settings.textColor === option.value ? "default" : "outline"}
                  onClick={() => setSettings(prev => ({ ...prev, textColor: option.value }))}
                  className={`h-12 justify-between ${
                    settings.textColor === option.value 
                      ? "border-amber-500 bg-amber-500 text-white" 
                      : "border-gray-300"
                  }`}
                >
                  <span className="font-medium">{option.label}</span>
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: option.preview }}
                  ></div>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium text-amber-800">نوع الخط</Label>
            <div className="grid grid-cols-1 gap-3">
              {fontFamilyOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={settings.fontFamily === option.value ? "default" : "outline"}
                  onClick={() => setSettings(prev => ({ ...prev, fontFamily: option.value }))}
                  className={`h-12 ${
                    settings.fontFamily === option.value 
                      ? "border-amber-500 bg-amber-500 text-white" 
                      : "border-gray-300"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium text-amber-800">حجم الخط</Label>
            <div className="grid grid-cols-1 gap-3">
              {fontSizeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={settings.fontSize === option.value ? "default" : "outline"}
                  onClick={() => setSettings(prev => ({ ...prev, fontSize: option.value }))}
                  className={`h-12 ${
                    settings.fontSize === option.value 
                      ? "border-amber-500 bg-amber-500 text-white" 
                      : "border-gray-300"
                  }`}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* معاينة */}
          <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
            <h4 className="text-amber-800 font-medium mb-3 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              معاينة التخصيصات الحالية
            </h4>
            <div className="space-y-2 text-sm">
              <p><strong>الخلفية:</strong> {backgroundOptions.find(o => o.value === settings.backgroundColor)?.label}</p>
              <p><strong>لون الخط:</strong> {textColorOptions.find(o => o.value === settings.textColor)?.label}</p>
              <p><strong>نوع الخط:</strong> {fontFamilyOptions.find(o => o.value === settings.fontFamily)?.label}</p>
              <p><strong>حجم الخط:</strong> {fontSizeOptions.find(o => o.value === settings.fontSize)?.label}</p>
            </div>
          </div>

          {/* أزرار التحكم */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={previewSettings}
              variant="outline"
              className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              معاينة مباشرة 👁️
            </Button>
            <Button
              onClick={applySettings}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              حفظ التغييرات ✅
            </Button>
            <Button
              variant="outline"
              onClick={resetSettings}
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              إعادة التعيين ↺
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomizationSection;
