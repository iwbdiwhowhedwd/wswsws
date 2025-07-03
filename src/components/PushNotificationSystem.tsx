
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { Bell, Send, Settings, Users, History, Smartphone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PushNotificationSystem = () => {
  const {
    isInitialized,
    hasPermission,
    tokens,
    history,
    loading,
    sendNotification,
    requestPermission
  } = useNotifications();

  const [notificationData, setNotificationData] = useState({
    title: "",
    message: "",
    type: "general" as "general" | "new_item" | "price_update" | "reservation"
  });

  const handleSendNotification = async () => {
    if (!notificationData.title || !notificationData.message) {
      return;
    }

    const success = await sendNotification({
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type
    });

    if (success) {
      setNotificationData({
        title: "",
        message: "",
        type: "general"
      });
    }
  };

  const quickNotifications = [
    {
      title: "قطعة جديدة ✨",
      message: "تم إضافة قطع ذهبية جديدة إلى المجموعة",
      type: "new_item" as const
    },
    {
      title: "تحديث الأسعار 💰",
      message: "تم تحديث أسعار الذهب اليوم",
      type: "price_update" as const
    },
    {
      title: "عرض خاص 🎉",
      message: "عرض خاص لفترة محدودة - خصم على جميع القطع",
      type: "general" as const
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'new_item': return 'bg-green-100 text-green-800';
      case 'price_update': return 'bg-blue-100 text-blue-800';
      case 'reservation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'new_item': return 'قطعة جديدة';
      case 'price_update': return 'تحديث سعر';
      case 'reservation': return 'حجز';
      default: return 'عام';
    }
  };

  if (!isInitialized) {
    return (
      <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <p className="text-amber-800">جاري تهيئة نظام الإشعارات...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {!hasPermission && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">تفعيل الإشعارات</p>
                  <p className="text-sm text-yellow-600">يحتاج المستخدمون للموافقة على الإشعارات</p>
                </div>
              </div>
              <Button 
                onClick={requestPermission}
                size="sm"
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                طلب الإذن
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">إرسال إشعار</TabsTrigger>
          <TabsTrigger value="users">المستخدمين ({tokens.length})</TabsTrigger>
          <TabsTrigger value="history">التاريخ ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                <Send className="h-5 w-5" />
                إرسال إشعار فوري
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
                    <option value="reservation">حجز</option>
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
                disabled={loading || !notificationData.title || !notificationData.message}
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                {loading ? "جاري الإرسال..." : "إرسال الإشعار"}
                <Send className="h-4 w-4 mr-2" />
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
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                <Users className="h-5 w-5" />
                المستخدمين المسجلين ({tokens.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {tokens.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لا يوجد مستخدمين مسجلين للإشعارات بعد</p>
              ) : (
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <div key={token.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{token.user_identifier.substring(0, 8)}...</p>
                          <p className="text-xs text-gray-500">
                            {new Date(token.created_at).toLocaleDateString('ar-JO')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={token.platform === 'android' ? 'border-green-500 text-green-700' : token.platform === 'ios' ? 'border-blue-500 text-blue-700' : 'border-gray-500 text-gray-700'}>
                        {token.platform}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                <History className="h-5 w-5" />
                تاريخ الإشعارات ({history.length})
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {history.length === 0 ? (
                <p className="text-gray-500 text-center py-8">لم يتم إرسال أي إشعارات بعد</p>
              ) : (
                <div className="space-y-3">
                  {history.map((notification) => (
                    <div key={notification.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-800">{notification.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        </div>
                        <Badge className={getTypeColor(notification.type)}>
                          {getTypeName(notification.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(notification.sent_at).toLocaleString('ar-JO')}</span>
                        <span>تم الإرسال إلى {notification.sent_count} مستخدم</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PushNotificationSystem;
