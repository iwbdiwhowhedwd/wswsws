
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
  currentPassword: string;
}

const AdminLogin = ({ onLogin, currentPassword }: AdminLoginProps) => {
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleLogin = () => {
    if (password === currentPassword) {
      onLogin();
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في لوحة التحكم",
      });
    } else {
      toast({
        title: "كلمة مرور خاطئة",
        description: "يرجى إدخال كلمة المرور الصحيحة",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-amber-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-amber-800 font-bold">
            صفحة التحكم
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-amber-800">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className="border-amber-300 focus:border-amber-500"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <Button
            onClick={handleLogin}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            دخول
          </Button>
          
          <p className="text-center text-sm text-gray-600">
            صفحة خاصة بصاحب المحل فقط
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
