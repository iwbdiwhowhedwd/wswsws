
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Info } from "lucide-react";

interface AppInfo {
  title: string;
  description: string;
  vision: string;
  mission: string;
  history: string;
  features: string;
}

interface AppInfoManagementProps {
  appInfo: AppInfo;
  onUpdateAppInfo: (appInfo: AppInfo) => void;
}

const AppInfoManagement = ({ appInfo, onUpdateAppInfo }: AppInfoManagementProps) => {
  const { toast } = useToast();

  const handleInputChange = (field: keyof AppInfo, value: string) => {
    onUpdateAppInfo({
      ...appInfo,
      [field]: value
    });
  };

  const handleSave = () => {
    toast({
      title: "تم حفظ المعلومات",
      description: "تم تحديث معلومات التطبيق بنجاح",
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
      <CardHeader>
        <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
          <Info className="h-5 w-5" />
          إدارة معلومات التطبيق
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">عنوان التطبيق</Label>
          <Input
            id="title"
            value={appInfo.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="border-amber-300 focus:border-amber-500"
            placeholder="مثال: مجوهرات أبو رميلة - أفضل المجوهرات"
          />
        </div>

        <div>
          <Label htmlFor="description">وصف التطبيق</Label>
          <Textarea
            id="description"
            value={appInfo.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="border-amber-300 focus:border-amber-500"
            rows={4}
            placeholder="اكتب وصفاً مفصلاً عن التطبيق وما يقدمه..."
          />
        </div>

        <div>
          <Label htmlFor="vision">رؤيتنا</Label>
          <Textarea
            id="vision"
            value={appInfo.vision}
            onChange={(e) => handleInputChange('vision', e.target.value)}
            className="border-amber-300 focus:border-amber-500"
            rows={3}
            placeholder="اكتب رؤية الشركة أو المتجر..."
          />
        </div>

        <div>
          <Label htmlFor="mission">رسالتنا</Label>
          <Textarea
            id="mission"
            value={appInfo.mission}
            onChange={(e) => handleInputChange('mission', e.target.value)}
            className="border-amber-300 focus:border-amber-500"
            rows={3}
            placeholder="اكتب رسالة الشركة أو المتجر..."
          />
        </div>

        <div>
          <Label htmlFor="history">تاريخنا</Label>
          <Textarea
            id="history"
            value={appInfo.history}
            onChange={(e) => handleInputChange('history', e.target.value)}
            className="border-amber-300 focus:border-amber-500"
            rows={4}
            placeholder="اكتب نبذة عن تاريخ الشركة أو المتجر..."
          />
        </div>

        <div>
          <Label htmlFor="features">المميزات والخدمات</Label>
          <Textarea
            id="features"
            value={appInfo.features}
            onChange={(e) => handleInputChange('features', e.target.value)}
            className="border-amber-300 focus:border-amber-500"
            rows={4}
            placeholder="اذكر المميزات والخدمات المقدمة..."
          />
        </div>

        <Button 
          onClick={handleSave}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          حفظ معلومات التطبيق
        </Button>
      </CardContent>
    </Card>
  );
};

export default AppInfoManagement;
