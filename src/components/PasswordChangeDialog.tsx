
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Key } from "lucide-react";

interface PasswordChangeDialogProps {
  currentPassword: string;
  onPasswordChange: (newPassword: string) => void;
}

const PasswordChangeDialog = ({ currentPassword, onPasswordChange }: PasswordChangeDialogProps) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleChange = () => {
    if (oldPassword !== currentPassword) {
      toast({
        title: "خطأ",
        description: "كلمة المرور الحالية غير صحيحة",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 4) {
      toast({
        title: "خطأ",
        description: "كلمة المرور الجديدة يجب أن تكون 4 أرقام على الأقل",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "خطأ",
        description: "كلمتا المرور غير متطابقتان",
        variant: "destructive",
      });
      return;
    }

    onPasswordChange(newPassword);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOpen(false);
    
    toast({
      title: "تم تغيير كلمة المرور",
      description: "تم تغيير كلمة المرور بنجاح",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="border-amber-300 text-amber-700">
          <Key className="h-4 w-4 ml-2" />
          تغيير كلمة المرور
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white border-amber-200">
        <DialogHeader>
          <DialogTitle className="text-amber-800">تغيير كلمة المرور</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>كلمة المرور الحالية</Label>
            <Input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div>
            <Label>كلمة المرور الجديدة</Label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div>
            <Label>تأكيد كلمة المرور الجديدة</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleChange}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              تغيير
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordChangeDialog;
