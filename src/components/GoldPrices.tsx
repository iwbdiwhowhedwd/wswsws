import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Share, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BookingDialog from "./BookingDialog";
import ReviewDialog from "./ReviewDialog";

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
  category?: string;
  allowBooking?: boolean;
}

interface GoldPricesProps {
  goldItems: GoldItem[];
  onBooking?: (bookingData: any) => void;
  categories?: any[];
  onSubmitReview?: (reviewData: any) => void;
  reviews?: any[];
}

const GoldPrices = ({ goldItems, onBooking, categories = [], onSubmitReview, reviews = [] }: GoldPricesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const currencies = {
    jod: { symbol: "د.أ", name: "دينار أردني" },
    usd: { symbol: "$", name: "دولار أمريكي" },
    ils: { symbol: "₪", name: "شيكل إسرائيلي" },
  };

  const filteredItems = goldItems
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(item => selectedCategory === "all" || item.category === selectedCategory);

  const shareItem = (item: GoldItem) => {
    const shareText = `${item.name}\n${item.description}\nالأسعار:\n- ${currencies.jod.symbol}${item.prices.jod}\n- ${currencies.usd.symbol}${item.prices.usd}\n- ${currencies.ils.symbol}${item.prices.ils}`;
    
    if (navigator.share) {
      navigator.share({
        title: item.name,
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "تم نسخ المعلومات",
        description: "تم نسخ معلومات القطعة إلى الحافظة",
      });
    }
  };

  const handleBooking = (bookingData: any) => {
    if (onBooking) {
      onBooking(bookingData);
    }
  };

  const getItemReviews = (itemId: string) => {
    return reviews.filter(review => review.itemId === itemId);
  };

  const getAverageRating = (itemId: string) => {
    const itemReviews = getItemReviews(itemId);
    if (itemReviews.length === 0) return "0";
    const sum = itemReviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / itemReviews.length).toFixed(1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-3 h-4 w-4 text-amber-600" />
          <Input
            placeholder="البحث عن قطعة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 border-amber-300 focus:border-amber-500"
          />
        </div>
        
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-amber-300 rounded-md focus:border-amber-500 focus:outline-none"
          >
            <option value="all">جميع التصنيفات</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const itemReviews = getItemReviews(item.id);
          const averageRating = parseFloat(getAverageRating(item.id));
          
          return (
            <Card key={item.id} className="bg-white/90 backdrop-blur-sm border-amber-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                {item.image && (
                  <div className="w-full h-48 mb-3 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-amber-800 font-bold text-center flex-1">
                    {item.name}
                  </CardTitle>
                  {item.isFavorite && (
                    <Star className="h-4 w-4 text-amber-500 fill-current" />
                  )}
                </div>
                <p className="text-sm text-gray-600 text-center">{item.description}</p>
                {item.isBooked && (
                  <div className="flex justify-center">
                    <Badge className="bg-red-500 text-white">محجوز</Badge>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(currencies).map(([code, currency]) => (
                    <div key={code} className="flex justify-between items-center p-2 bg-amber-50 rounded">
                      <span className="text-sm font-medium text-amber-800">
                        {currency.name}
                      </span>
                      <Badge variant="secondary" className="bg-amber-600 text-white text-center">
                        {currency.symbol}{item.prices[code as keyof typeof item.prices]}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                {/* Reviews section */}
                {itemReviews.length > 0 && (
                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 justify-center">
                      {renderStars(averageRating)}
                      <span className="text-sm text-gray-600">
                        ({averageRating}) - {itemReviews.length} مراجعة
                      </span>
                    </div>
                    {itemReviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="text-xs text-gray-600 mb-1 text-center">
                        <strong>{review.customerName}:</strong> {review.comment.substring(0, 50)}...
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-gray-500">
                    آخر تحديث: {item.lastUpdated}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareItem(item)}
                      className="text-amber-600 hover:text-amber-700"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2 justify-center">
                  {onBooking && item.allowBooking !== false && (
                    <BookingDialog item={item} onBooking={handleBooking} />
                  )}
                  {onSubmitReview && (
                    <ReviewDialog 
                      itemId={item.id} 
                      itemName={item.name} 
                      onSubmitReview={onSubmitReview} 
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">لم يتم العثور على أي قطع تطابق البحث</p>
        </div>
      )}
    </div>
  );
};

export default GoldPrices;
