
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bell, Send, Settings } from "lucide-react";

interface NotificationSystemProps {
  onSendNotification: (notification: any) => void;
}

const NotificationSystem = ({ onSendNotification }: NotificationSystemProps) => {
  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "general" as "general" | "new_item" | "price_update" | "sale"
  });
  const { toast } = useToast();

  const handleSendNotification = () => {
    if (!notificationData.title || !notificationData.message) {
      toast({
        title: "خطأ",
        description: "يرجى ملء العنوان والرسالة",
        variant: "destructive",
      });
      return;
    }

    onSendNotification({
      ...notificationData,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    });

    setNotificationData({
      title: "",
      message: "",
      type: "general"
    });

    toast({
      title: "تم إرسال الإشعار",
      description: "تم إرسال الإشعار للعملاء بنجاح",
    });
  };

  const quickNotifications = [
    {
      title: "قطعة جديدة",
      message: "تم إضافة قطع ذهبية جديدة إلى المجموعة",
      type: "new_item" as const
    },
    {
      title: "تحديث الأسعار",
      message: "تم تحديث أسعار الذهب اليوم",
      type: "price_update" as const
    },
    {
      title: "عرض خاص",
      message: "عرض خاص لفترة محدودة - خصم على جميع القطع",
      type: "sale" as const
    }
  ];

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
      <CardHeader>
        <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          نظام الإشعارات
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <Label>نوع الإشعار</Label>
            <select
              value={notificationData.type}
              onChange={(e) => setNotificationData({ 
                ...notificationData, 
                type: e.target.value as any 
              })}
              className="w-full h-10 px-3 py-2 border border-amber-300 rounded-md focus:border-amber-500 focus:outline-none"
            >
              <option value="general">عام</option>
              <option value="new_item">قطعة جديدة</option>
              <option value="price_update">تحديث أسعار</option>
              <option value="sale">عرض خاص</option>
            </select>
          </div>
          
          <div>
            <Label>العنوان</Label>
            <Input
              value={notificationData.title}
              onChange={(e) => setNotificationData({ 
                ...notificationData, 
                title: e.target.value 
              })}
              placeholder="أدخل عنوان الإشعار"
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div>
            <Label>الرسالة</Label>
            <Textarea
              value={notificationData.message}
              onChange={(e) => setNotificationData({ 
                ...notificationData, 
                message: e.target.value 
              })}
              placeholder="أدخل نص الرسالة"
              className="border-amber-300 focus:border-amber-500"
              rows={3}
            />
          </div>
        </div>
        
        <Button
          onClick={handleSendNotification}
          className="w-full bg-amber-600 hover:bg-amber-700"
        >
          <Send className="h-4 w-4 ml-2" />
          إرسال الإشعار
        </Button>
        
        <div className="pt-4 border-t border-amber-200">
          <Label className="text-sm font-medium">إشعارات سريعة</Label>
          <div className="grid grid-cols-1 gap-2 mt-2">
            {quickNotifications.map((notif, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setNotificationData(notif)}
                className="text-right justify-start border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                {notif.title}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSystem;
