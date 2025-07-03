
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare } from "lucide-react";

interface ReviewDialogProps {
  itemId: string;
  itemName: string;
  onSubmitReview: (reviewData: any) => void;
}

const ReviewDialog = ({ itemId, itemName, onSubmitReview }: ReviewDialogProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || rating === 0) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const reviewData = {
      customerName,
      itemId,
      itemName,
      rating,
      comment,
      date: new Date().toISOString(),
      approved: false
    };

    onSubmitReview(reviewData);
    setOpen(false);
    setRating(0);
    setComment("");
    setCustomerName("");
    
    toast({
      title: "تم إرسال التقييم",
      description: "شكراً لك، سيتم مراجعة تقييمك قريباً",
    });
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-6 w-6 cursor-pointer transition-colors ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300 hover:text-yellow-200"
        }`}
        onClick={() => setRating(i + 1)}
      />
    ));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
          <MessageSquare className="h-4 w-4 ml-2" />
          اكتب مراجعة
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-amber-800">تقييم {itemName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="customerName">اسمك *</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="أدخل اسمك"
              className="border-amber-300 focus:border-amber-500"
            />
          </div>
          
          <div>
            <Label>التقييم *</Label>
            <div className="flex gap-1 mt-2">
              {renderStars()}
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment">تعليقك</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="اكتب رأيك في هذه القطعة..."
              className="border-amber-300 focus:border-amber-500"
              rows={4}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              إرسال التقييم
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

export default ReviewDialog;
