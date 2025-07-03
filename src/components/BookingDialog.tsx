
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "lucide-react";

interface GoldItem {
  id: string;
  name: string;
  description: string;
  image?: string;
  prices: {
    jod: number;
    usd: number;
    ils: number;
  };
  lastUpdated: string;
  isFavorite: boolean;
  isBooked?: boolean;
}

interface BookingDialogProps {
  item: GoldItem;
  onBooking: (bookingData: any) => void;
}

const BookingDialog = ({ item, onBooking }: BookingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.phone) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const bookingData = {
      ...formData,
      itemId: item.id,
      itemName: item.name,
      itemPrice: item.prices,
      bookingDate: new Date().toISOString(),
      status: "pending"
    };

    onBooking(bookingData);
    setFormData({ customerName: "", phone: "", email: "", notes: "" });
    setOpen(false);
    
    toast({
      title: "تم الحجز بنجاح",
      description: "سيتم التواصل معك قريباً",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-amber-600 hover:bg-amber-700 text-white"
          disabled={item.isBooked}
        >
          <Calendar className="h-4 w-4 ml-2" />
          {item.isBooked ? "محجوز" : "احجز الآن"}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-amber-800">حجز {item.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 rounded-lg">
            <h4 className="font-semibold text-amber-800">{item.name}</h4>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="text-sm mt-2">
              <span className="font-medium">الأسعار: </span>
              د.أ {item.prices.jod} | ${item.prices.usd} | ₪{item.prices.ils}
            </div>
          </div>
          
          <div>
            <Label htmlFor="customerName">الاسم *</Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              placeholder="أدخل اسمك الكامل"
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">رقم الهاتف *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="أدخل رقم الهاتف"
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div>
            <Label htmlFor="email">الإيميل</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="أدخل الإيميل (اختياري)"
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">ملاحظات</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="أي ملاحظات إضافية"
              className="border-amber-300 focus:border-amber-500"
              rows={3}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              تأكيد الحجز
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

export default BookingDialog;
