import React from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppPhotoShareProps {
  photos: string[];
  bookingId?: string;
  customerName?: string;
  eventDate?: string;
}

export const WhatsAppPhotoShare = ({ 
  photos, 
  bookingId, 
  customerName, 
  eventDate 
}: WhatsAppPhotoShareProps) => {
  
  const handleWhatsAppShare = () => {
    const phoneNumber = "918825474043"; // WhatsApp number without +
    
    // Create message text
    let message = `Hello! I would like to share hanging photos for my booking.\\n\\n`;
    
    if (bookingId) {
      message += `Booking ID: ${bookingId}\\n`;
    }
    
    if (customerName) {
      message += `Customer: ${customerName}\\n`;
    }
    
    if (eventDate) {
      message += `Event Date: ${eventDate}\\n`;
    }
    
    message += `\\nI have ${photos.length} hanging photo${photos.length > 1 ? 's' : ''} to share for the decoration.\\n\\n`;
    message += `Photos will be shared in the next messages.\\n\\n`;
    message += `Please confirm the additional cost for hanging photos: ₹${photos.length * 80}`;
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  if (photos.length === 0) {
    return null;
  }

  return (
    <Button
      onClick={handleWhatsAppShare}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
      size="sm"
    >
      <MessageCircle className="h-4 w-4" />
      Send Photos via WhatsApp
      <span className="text-xs opacity-90">({photos.length} photos)</span>
    </Button>
  );
};