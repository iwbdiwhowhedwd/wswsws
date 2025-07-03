
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquare, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  customerName: string;
  itemId: string;
  itemName: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

interface ReviewSystemProps {
  reviews: Review[];
  onApproveReview: (reviewId: string) => void;
  onDeleteReview: (reviewId: string) => void;
}

const ReviewSystem = ({ reviews, onApproveReview, onDeleteReview }: ReviewSystemProps) => {
  const { toast } = useToast();

  const handleApprove = (reviewId: string) => {
    onApproveReview(reviewId);
    toast({
      title: "تم الموافقة على المراجعة",
      description: "ستظهر المراجعة الآن للعملاء",
    });
  };

  const handleDelete = (reviewId: string) => {
    onDeleteReview(reviewId);
    toast({
      title: "تم حذف المراجعة",
      description: "تم حذف المراجعة بنجاح",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
      <CardHeader>
        <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          إدارة المراجعات والتقييمات ({reviews.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد مراجعات حالياً</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="p-4 border border-amber-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-amber-800">{review.itemName}</h4>
                  <p className="text-sm text-gray-600">بواسطة: {review.customerName}</p>
                </div>
                <Badge className={review.approved ? "bg-green-500" : "bg-yellow-500"}>
                  {review.approved ? "موافق عليها" : "في الانتظار"}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {renderStars(review.rating)}
                <span className="text-sm text-gray-600">({review.rating}/5)</span>
              </div>
              
              <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                {review.comment}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{new Date(review.date).toLocaleDateString('ar')}</span>
                <div className="flex gap-2">
                  {!review.approved && (
                    <Button
                      size="sm"
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ThumbsUp className="h-3 w-3 ml-1" />
                      موافقة
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(review.id)}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    حذف
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewSystem;
