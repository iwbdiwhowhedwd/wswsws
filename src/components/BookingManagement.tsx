
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Phone, Mail, MessageSquare, Check, X } from "lucide-react";

interface Booking {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
  itemId: string;
  itemName: string;
  itemPrice: any;
  bookingDate: string;
  status: "pending" | "confirmed" | "cancelled";
}

interface BookingManagementProps {
  bookings: Booking[];
  onUpdateBooking: (bookingId: string, status: string) => void;
}

const BookingManagement = ({ bookings, onUpdateBooking }: BookingManagementProps) => {
  const { toast } = useToast();
  
  const handleStatusUpdate = (bookingId: string, status: string) => {
    onUpdateBooking(bookingId, status);
    const statusText = status === "confirmed" ? "تأكيد" : "إلغاء";
    toast({
      title: `تم ${statusText} الحجز`,
      description: "تم تحديث حالة الحجز بنجاح",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-yellow-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "مؤكد";
      case "cancelled": return "ملغي";
      default: return "قيد الانتظار";
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
      <CardHeader>
        <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          إدارة الحجوزات ({bookings.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4 max-h-96 overflow-y-auto">
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">لا توجد حجوزات حالياً</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="p-4 border border-amber-200 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-amber-800">{booking.itemName}</h4>
                  <p className="text-sm text-gray-600">العميل: {booking.customerName}</p>
                </div>
                <Badge className={`${getStatusColor(booking.status)} text-white`}>
                  {getStatusText(booking.status)}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-600" />
                  <span>{booking.phone}</span>
                </div>
                {booking.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-amber-600" />
                    <span>{booking.email}</span>
                  </div>
                )}
                {booking.notes && (
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-amber-600 mt-0.5" />
                    <span>{booking.notes}</span>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  تاريخ الحجز: {new Date(booking.bookingDate).toLocaleDateString('ar')}
                </div>
              </div>
              
              {booking.status === "pending" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 ml-1" />
                    تأكيد
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4 ml-1" />
                    إلغاء
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default BookingManagement;
