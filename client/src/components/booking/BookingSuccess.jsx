import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Download, 
  Calendar, 
  Clock, 
  Users, 
  MapPin,
  Phone,
  Sparkles
} from "lucide-react";

export const BookingSuccess = ({ bookingData, onNewBooking }) => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [qrCodeGenerated, setQrCodeGenerated] = useState(false);

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    
    // Simulate QR code generation
    const qrTimer = setTimeout(() => setQrCodeGenerated(true), 2000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(qrTimer);
    };
  }, []);

  const generateQRCodeData = () => {
    return `C3 Café Booking
Booking ID: ${bookingData.bookingId}
Customer: ${bookingData.applicantName}
Event: ${bookingData.eventType}
Time: ${bookingData.timeSlot}
Plan: ${bookingData.plan}
Guests: ${bookingData.guests}
Contact: ${bookingData.contact}`;
  };

  const downloadQR = () => {
    // In a real app, this would generate and download an actual QR code
    const qrData = generateQRCodeData();
    const blob = new Blob([qrData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `C3-Booking-${bookingData.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-primary to-gold confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}

      <div className="space-y-8">
        {/* Success Header */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-primary to-gold flex items-center justify-center shadow-luxury">
              <CheckCircle className="h-12 w-12 text-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-gold animate-pulse" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-gold to-primary bg-clip-text text-transparent animate-luxury-float">
              Congratulations!
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your party hall has been successfully booked! Get ready for an unforgettable celebration at C3 Café.
            </p>
          </div>
        </div>

        {/* Booking Details Card */}
        <Card className="max-w-2xl mx-auto shadow-luxury border-primary/20">
          <CardHeader className="text-center bg-gradient-to-r from-primary/5 to-gold/5">
            <CardTitle className="text-2xl">Booking Confirmation</CardTitle>
            <Badge className="w-fit mx-auto bg-primary text-primary-foreground">
              Booking ID: {bookingData.bookingId}
            </Badge>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Customer Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>{bookingData.applicantName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>{bookingData.contact}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Event Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>Event: {bookingData.eventType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>Time: {bookingData.timeSlot}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Guests: {bookingData.guests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span>Plan: {bookingData.plan}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Payment Info */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Payment Information</h3>
              <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                <span>Advance Paid:</span>
                <span className="text-xl font-bold text-primary">₹500</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Remaining amount will be collected at the venue on the day of event.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Section */}
        <Card className="max-w-md mx-auto shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-elite to-elite-light flex items-center justify-center">
                <span className="text-white text-sm font-bold">QR</span>
              </div>
              Your Entry QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {qrCodeGenerated ? (
              <>
                {/* QR Code Placeholder */}
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-primary/10 to-gold/10 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📱</div>
                    <p className="text-sm text-muted-foreground">QR Code Generated</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  Show this QR code at C3 Café for instant check-in
                </p>
                
                <Button onClick={downloadQR} variant="premium" size="lg" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </>
            ) : (
              <div className="w-48 h-48 mx-auto bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">Generating QR Code...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Venue Information */}
        <Card className="max-w-2xl mx-auto shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Venue Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">C3 Café</h3>
              <p className="text-muted-foreground">Premium Party Hall Experience</p>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-medium">8870005858</span>
                </div>
                <div className="text-muted-foreground">|</div>
                <div className="font-medium text-primary">c3.cafe</div>
              </div>
            </div>
            
            <div className="bg-accent/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Please arrive 10 minutes before your scheduled time. Our team will be ready to make your celebration magical! ✨
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 max-w-md mx-auto">
          <Button variant="outline" onClick={onNewBooking} className="flex-1">
            Book Another Event
          </Button>
          <Button variant="hero" onClick={() => window.print()} className="flex-1">
            Print Details
          </Button>
        </div>
      </div>
    </div>
  );
};