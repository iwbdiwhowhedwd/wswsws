import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Facebook, Instagram } from "lucide-react";

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

interface AboutSectionProps {
  aboutData: AboutData;
}

const AboutSection = ({ aboutData }: AboutSectionProps) => {
  const handleCall = () => {
    window.open(`tel:${aboutData.phone}`, "_self");
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${aboutData.whatsapp}`, "_blank");
  };

  const handleFacebook = () => {
    window.open(`https://facebook.com/${aboutData.facebook}`, "_blank");
  };

  const handleInstagram = () => {
    window.open(`https://instagram.com/${aboutData.instagram}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-32 h-32 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            {aboutData.image ? (
              <img
                src={aboutData.image}
                alt="أبو رميلة للمجوهرات"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl font-bold text-white">أر</span>
            )}
          </div>
          <CardTitle className="text-2xl text-amber-800 font-bold">
            أبو رميلة للمجوهرات
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {aboutData.content}
          </p>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">خدماتنا تشمل:</h3>
            <ul className="text-sm text-gray-700 space-y-1 text-right">
              <li>• بيع وشراء الذهب بأفضل الأسعار</li>
              <li>• مجوهرات فاخرة عيار 18 و 21 قيراط</li>
              <li>• تصميم مجوهرات حسب الطلب</li>
              <li>• خدمة صيانة وإصلاح المجوهرات</li>
              <li>• استشارات مجانية حول الاستثمار في الذهب</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
        <CardHeader>
          <CardTitle className="text-xl text-amber-800 text-center">
            تواصل معنا
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={handleCall}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 h-12"
            >
              <Phone className="h-5 w-5" />
              اتصال مباشر
            </Button>
            
            <Button
              onClick={handleWhatsApp}
              className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2 h-12"
            >
              <MessageSquare className="h-5 w-5" />
              واتساب
            </Button>
          </div>
          
          <div className="pt-4 border-t border-amber-200">
            <h4 className="text-center text-amber-800 font-medium mb-3">
              تابعونا على وسائل التواصل الاجتماعي
            </h4>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFacebook}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleInstagram}
                className="border-pink-500 text-pink-600 hover:bg-pink-50"
              >
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-center text-sm text-gray-600 pt-4 border-t border-amber-200">
            <p>📍 العنوان: {aboutData.address}</p>
            <p>⏰ ساعات العمل: {aboutData.hours}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutSection;
