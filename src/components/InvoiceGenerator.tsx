
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Send } from "lucide-react";
import jsPDF from 'jspdf';

interface InvoiceData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  itemName: string;
  itemPrice: number;
  currency: string;
  orderNumber: string;
  date: string;
}

interface InvoiceGeneratorProps {
  bookings: any[];
}

const InvoiceGenerator = ({ bookings }: InvoiceGeneratorProps) => {
  const [selectedBooking, setSelectedBooking] = useState<string>("");
  const { toast } = useToast();

  const generatePDF = (booking: any) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('فاتورة - متجر أبو رميلة للمجوهرات', 105, 30, { align: 'center' });
    
    // Invoice details
    doc.setFontSize(12);
    doc.text(`رقم الفاتورة: ${booking.id}`, 20, 60);
    doc.text(`التاريخ: ${new Date(booking.bookingDate).toLocaleDateString('ar')}`, 20, 75);
    
    // Customer info
    doc.text('بيانات العميل:', 20, 100);
    doc.text(`الاسم: ${booking.customerName}`, 30, 115);
    doc.text(`الهاتف: ${booking.phone}`, 30, 130);
    if (booking.email) {
      doc.text(`الإيميل: ${booking.email}`, 30, 145);
    }
    
    // Item details
    doc.text('تفاصيل القطعة:', 20, 170);
    doc.text(`اسم القطعة: ${booking.itemName}`, 30, 185);
    doc.text(`السعر: ${booking.itemPrice.jod} دينار أردني`, 30, 200);
    
    // Footer
    doc.text('شكراً لتعاملكم معنا', 105, 250, { align: 'center' });
    
    return doc;
  };

  const downloadInvoice = (booking: any) => {
    const pdf = generatePDF(booking);
    pdf.save(`فاتورة-${booking.id}.pdf`);
    
    toast({
      title: "تم إنشاء الفاتورة",
      description: "تم تحميل الفاتورة بنجاح",
    });
  };

  const sendInvoice = (booking: any) => {
    const pdf = generatePDF(booking);
    const pdfBlob = pdf.output('blob');
    
    // Simulate sending via email/WhatsApp
    toast({
      title: "تم إرسال الفاتورة",
      description: "تم إرسال الفاتورة للعميل بنجاح",
    });
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-amber-200">
      <CardHeader>
        <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          نظام الفواتير
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label>اختر الحجز لإنشاء فاتورة</Label>
          <select
            value={selectedBooking}
            onChange={(e) => setSelectedBooking(e.target.value)}
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:border-amber-500 focus:outline-none"
          >
            <option value="">اختر حجز...</option>
            {bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.customerName} - {booking.itemName}
              </option>
            ))}
          </select>
        </div>
        
        {selectedBooking && (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                const booking = bookings.find(b => b.id === selectedBooking);
                if (booking) downloadInvoice(booking);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Download className="h-4 w-4 ml-1" />
              تحميل PDF
            </Button>
            <Button
              onClick={() => {
                const booking = bookings.find(b => b.id === selectedBooking);
                if (booking) sendInvoice(booking);
              }}
              variant="outline"
              className="border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Send className="h-4 w-4 ml-1" />
              إرسال للعميل
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InvoiceGenerator;
