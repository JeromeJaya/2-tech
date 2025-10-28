import React from "react";
import { EnhancedBookingForm } from "@/components/booking/EnhancedBookingForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function AdminNewBooking() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleBookingComplete = (bookingData: any) => {
    toast({
      title: "Booking Created Successfully",
      description: `Booking ID: ${bookingData.booking_id}`,
    });
    // Navigate to the booking detail page
    navigate(`/admin/booking/${bookingData.id}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Create New Booking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Create a new booking for customers directly from the admin panel.
          </p>
          
          <EnhancedBookingForm onBookingComplete={handleBookingComplete} />
        </CardContent>
      </Card>
    </div>
  );
}