
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GoldItem {
  name: string;
  description: string;
  image?: string;
  prices: {
    jod: number;
    usd: number;
    ils: number;
  };
  lastUpdated: string;
}

interface AddGoldItemDialogProps {
  onAddItem: (item: GoldItem) => void;
}

const AddGoldItemDialog = ({ onAddItem }: AddGoldItemDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    jodPrice: "",
    usdPrice: "",
    ilsPrice: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.jodPrice || !formData.usdPrice || !formData.ilsPrice) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const newItem: GoldItem = {
      name: formData.name,
      description: formData.description,
      prices: {
        jod: parseFloat(formData.jodPrice),
        usd: parseFloat(formData.usdPrice),
        ils: parseFloat(formData.ilsPrice),
      },
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    onAddItem(newItem);
    setFormData({
      name: "",
      description: "",
      jodPrice: "",
      usdPrice: "",
      ilsPrice: "",
    });
    setOpen(false);
    
    toast({
      title: "تم الإضافة بنجاح",
      description: "تم إضافة القطعة الجديدة بنجاح",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="h-4 w-4 ml-2" />
          إضافة قطعة
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-amber-800">إضافة قطعة ذهب جديدة</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">اسم القطعة *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="مثال: خاتم ذهب عيار 21"
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div>
            <Label htmlFor="description">الوصف</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="وصف مختصر للقطعة"
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div>
              <Label htmlFor="jodPrice">السعر بالدينار الأردني *</Label>
              <Input
                id="jodPrice"
                type="number"
                step="0.01"
                value={formData.jodPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, jodPrice: e.target.value }))}
                placeholder="0.00"
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
            
            <div>
              <Label htmlFor="usdPrice">السعر بالدولار الأمريكي *</Label>
              <Input
                id="usdPrice"
                type="number"
                step="0.01"
                value={formData.usdPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, usdPrice: e.target.value }))}
                placeholder="0.00"
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
            
            <div>
              <Label htmlFor="ilsPrice">السعر بالشيكل الإسرائيلي *</Label>
              <Input
                id="ilsPrice"
                type="number"
                step="0.01"
                value={formData.ilsPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, ilsPrice: e.target.value }))}
                placeholder="0.00"
                className="border-amber-300 focus:border-amber-500"
              />
            </div>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              إضافة القطعة
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoldItemDialog;
