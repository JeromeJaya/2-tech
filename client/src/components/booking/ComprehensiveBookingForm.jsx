import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Users, Clock, CreditCard, CheckCircle, CalendarIcon, Palette, Mail, Crown, Sparkles, Star, Upload, X, MessageCircle, Image, Lightbulb } from "lucide-react";
import { BalloonColorSelector } from "./BalloonColorSelector";
import { createBooking, getAvailableSlots } from "@/services/bookingService";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';

// BookingFormProps: onBookingComplete function

const eventTypes = [
  { value: "birthday", label: "Birthday", fields: ["birthdayName"] },
  { value: "anniversary", label: "Anniversary", fields: ["coupleName1", "coupleName2"] },
  { value: "bride-to-be", label: "Bride to Be", fields: ["brideName"] },
  { value: "groom-to-be", label: "Groom to Be", fields: ["groomName"] }
];

const timeSlots = [
  "11:00 AM - 12:00 PM", "12:15 PM - 1:15 PM", "1:30 PM - 2:30 PM", "2:45 PM - 3:45 PM",
  "4:00 PM - 5:00 PM", "5:15 PM - 6:15 PM", "6:30 PM - 7:30 PM", "7:45 PM - 8:45 PM",
  "9:00 PM - 10:00 PM", "10:15 PM - 11:15 PM"
];

// Enhanced helper function to get the correct image path with specific mappings
const getImagePath = (decorationId) => {
  if (!decorationId) return '/placeholder.svg';
  
  // Create specific mappings for decoration IDs to actual image files
  const imageMap = {
    // Basic Plan Decorations
    'dec_1600_1': '/1600.jpg',
    'dec_1900_1': '/1900.jpg',
    'dec_2000_1': '/2000.jpg',
    'dec_2000_2': '/2000 rs.jpg',
    'dec_2000_3': '/2000 price.jpg',
    'dec_2300_1': '/2300.jpg',
    'dec_2300_2': '/2300 rs.jpg',
    'dec_2300_3': '/2300 rs 2.jpg',
    'dec_2400_1': '/2400.jpg',
    'dec_2400_2': '/2400 rs.jpg',
    'dec_2400_3': '/2400 pri.jpg',
    'dec_2400_4': '/2400 price 2.jpg',
    'dec_2400_5': '/2400 rs (1).jpg',
    'dec_2400_6': '/2400 rs 3.jpg',
    'dec_2400_7': '/2400 rs 4.jpg',
    'dec_2500_1': '/2500.jpg',
    'dec_2500_2': '/2500 rs.jpg',
    'dec_2500_3': '/2500 rs h.jpg',
    'dec_2600_1': '/2600.jpg',
    'dec_2600_2': '/2600 rs.jpg',
    'dec_2700_1': '/2700.jpg',
    'dec_2700_2': '/2700 rs.jpg',
    'dec_2800_1': '/2800.jpg',
    'dec_2900_1': '/2900.jpg',
    'dec_3000_1': '/3000.jpg',
    
    // Premium Plan Decorations
    'dec_3500_1': '/3500.jpg',
    'dec_3600_1': '/3600.jpg',
    'dec_3700_1': '/3700.jpg',
    'dec_3900_1': '/3900.jpg',
    'dec_3900_2': '/3900 rs.jpg',
    'dec_3900_3': '/3900 rs (2).jpg',
    'dec_4000_1': '/4000.jpg',
    'dec_4000_2': '/4000 rs.jpg',
    'dec_4000_3': '/4000 rs 2.jpg',
    'dec_4000_4': '/4000 rs 3.jpg',
    'dec_4200_1': '/4200.jpg',
    'dec_4200_2': '/4200 rs.jpg',
    'dec_4200_3': '/4200 rs 3.jpg',
    'dec_4500_1': '/4500.jpg',
    'dec_4700_1': '/4700.jpg',
    'dec_4800_1': '/4800.jpg',
    'dec_4800_2': '/4800 (2).jpg',
    'dec_4900_1': '/4900.jpg',
    'dec_4900_2': '/4900 6.jpg',
    'dec_4900_3': '/4900 7.jpg',
    'dec_4900_4': '/4900 rs.jpg',
    'dec_4900_5': '/4900 rs 2.jpg',
    'dec_4900_6': '/4900 rs 3.jpg',
    'dec_4900_7': '/4900 rs 4.jpg',
    'dec_4900_8': '/4900 rs 5.jpg',
    'dec_5000_1': '/5000.jpg',
    'dec_5000_2': '/5000 rs.jpg',
    'dec_5200_1': '/5200.jpg',
    'dec_5200_2': '/5200 rs.jpg',
    'dec_5300_1': '/5300.jpg',
    'dec_5300_2': '/5300 rs.jpg',
    'dec_5300_3': '/5300 rs2.jpg',
    
    // Elite Plan Decorations
    'dec_5500_1': '/5500.jpg',
    'dec_5900_1': '/5900.jpg',
    'dec_5900_2': '/5900 (1).jpg',
    'dec_5900_3': '/5900 (2).jpg',
    'dec_5900_4': '/5900 rs.jpg',
    'dec_6000_1': '/6000.jpg',
    'dec_6000_2': '/6000 (2).jpg',
    'dec_6200_1': '/6200.jpg',
    'dec_6200_2': '/6200 (2).jpg',
    'dec_6300_1': '/6300.jpg',
    'dec_6400_1': '/6400.jpg',
    'dec_6400_2': '/6400 (2).jpg',
    'dec_6400_3': '/6400 (3).jpg',
    'dec_6400_4': '/6400 (4).jpg',
    'dec_6500_1': '/6500.jpg',
    'dec_6500_2': '/6500 (2).jpg',
    'dec_6500_3': '/6500 (3).jpg',
    'dec_6500_4': '/6500 (4).jpg',
    'dec_6500_5': '/6500 (5).jpg',
    'dec_6500_6': '/6500 (6).jpg',
    'dec_6500_7': '/6500 (7).jpg',
    'dec_6500_8': '/6500 (8).jpg',
    'dec_6500_9': '/6500 (9).jpg',
    'dec_6500_10': '/6500 rs.jpg',
    'dec_6700_1': '/6700.jpg',
    'dec_6700_2': '/6700 (2).jpg',
    'dec_6800_1': '/6800.jpg',
    'dec_6800_2': '/6800 (1).jpg',
    'dec_6800_3': '/6800 (2).jpg',
    'dec_6800_4': '/6800 (3).jpg',
    'dec_6800_5': '/6800 (4).jpg',
    'dec_6800_6': '/6800 (5).jpg',
    'dec_6800_7': '/6800 (6).jpg',
    'dec_6800_8': '/6800 (7).jpg',
    'dec_6800_9': '/6800 (8).jpg',
    'dec_6800_10': '/6800 (9).jpg',
    'dec_6800_11': '/6800 (10).jpg',
    'dec_6800_12': '/6800 (11).jpg',
    'dec_6800_13': '/6800 (12).jpg',
    'dec_6800_14': '/6800 rs.jpg',
    'dec_6900_1': '/6900.jpg',
    'dec_6900_2': '/6900 (2).jpg',
    'dec_6900_3': '/6900 (3).jpg',
    'dec_6900_4': '/6900 (4).jpg',
    'dec_6900_5': '/6900 (5).jpg',
    'dec_6900_6': '/6900 (6).jpg',
    'dec_6900_7': '/6900 (7).jpg',
    'dec_6900_8': '/6900 (8).jpg',
    'dec_6900_9': '/6900 (9).jpg',
    'dec_6900_10': '/6900 (10).jpg',
    'dec_7000_1': '/7000.jpg',
    'dec_7000_2': '/7000 (2).jpg',
    'dec_7200_1': '/7200.jpg',
    'dec_7200_2': '/7200 (2).jpg',
    'dec_7300_1': '/7300.jpg',
    'dec_7500_1': '/7500.jpg',
    'dec_7500_2': '/7500 (2).jpg',
    'dec_7800_1': '/7800.jpg'
  };
  
  // Return the specific mapped image first
  if (imageMap[decorationId]) {
    return imageMap[decorationId];
  }
  
  // Enhanced fallback with better pattern matching
  const match = decorationId.match(/dec_(\d+)_/);
  if (match && match[1]) {
    const price = match[1];
    
    // Try multiple common image naming patterns
    const possibleImages = [
      `/${price}.jpg`,           // Most common: 1600.jpg
      `/${price} rs.jpg`,        // Common variant: 1600 rs.jpg 
      `/${price} price.jpg`,     // Price variant: 1600 price.jpg
      `/${price} pri.jpg`,       // Short variant: 1600 pri.jpg
      `/${price} (2).jpg`,       // Numbered variant: 1600 (2).jpg
      `/${price} rs 2.jpg`,      // RS numbered: 1600 rs 2.jpg
      `/${price} rs 3.jpg`,      // RS numbered: 1600 rs 3.jpg
      `/${price} rs (1).jpg`,    // RS parentheses: 1600 rs (1).jpg
      `/${price} rs (2).jpg`,    // RS parentheses: 1600 rs (2).jpg
      `/${price} price 2.jpg`,   // Price numbered: 1600 price 2.jpg
      `/${price} rs h.jpg`,      // RS with h: 2500 rs h.jpg
      `/${price} rs2.jpg`,       // RS without space: 5300 rs2.jpg
      `/${price}.png`            // PNG variant
    ];
    
    // Return the first (most common) pattern
    return possibleImages[0];
  }
  
  // Final fallback to placeholder
  console.warn(`No image mapping found for decoration: ${decorationId}`);
  return '/placeholder.svg';
};

// Decoration Selection Card Component
const DecorationSelectionCard = ({ decoration, isSelected, onSelect }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);

  const handleTouchStart = (e) => {
    e.preventDefault();
    const timer = setTimeout(() => {
      setIsImageModalOpen(true);
    }, 500);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  const handleClick = () => {
    if (!longPressTimer) {
      onSelect();
    }
  };

  return (
    <>
      <div
        className={`relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all group ${
          isSelected ? 'border-orange ring-2 ring-orange/70' : 'border-transparent hover:border-orange/50'
        }`}
        onClick={handleClick}
      >
        <img
          src={getImagePath(decoration.id)}
          alt={`${decoration.name} - ₹${decoration.price}`}
          className="w-full h-auto aspect-square object-cover"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onError={(e) => {
            const currentSrc = e.currentTarget.src;
            const match = decoration.id.match(/dec_(\d+)_/);
            
            if (match && match[1]) {
              const price = match[1];
              
              // Try different image variants in order of preference
              const imageVariants = [
                `/${price}.jpg`,
                `/${price} rs.jpg`,
                `/${price} price.jpg`,
                `/${price} pri.jpg`,
                `/${price} (2).jpg`,
                `/${price} rs 2.jpg`,
                `/${price} rs 3.jpg`,
                `/${price} rs 4.jpg`,
                `/${price} rs 5.jpg`,
                `/${price} rs (1).jpg`,
                `/${price} rs (2).jpg`,
                `/${price} price 2.jpg`,
                `/${price} rs h.jpg`,
                `/${price} rs2.jpg`,
                `/${price} 6.jpg`,
                `/${price} 7.jpg`,
                `/${price}.png`
              ];
              
              // Find current variant index and try next one
              const currentIndex = imageVariants.findIndex(variant => currentSrc.includes(variant.substring(1)));
              const nextIndex = currentIndex + 1;
              
              if (nextIndex < imageVariants.length) {
                e.currentTarget.src = imageVariants[nextIndex];
              } else {
                // All variants failed, use placeholder
                console.warn(`All image variants failed for decoration ${decoration.id} (price: ${price})`);
                e.currentTarget.src = '/placeholder.svg';
              }
            } else {
              // No price pattern found, use placeholder
              console.warn(`Invalid decoration ID pattern: ${decoration.id}`);
              e.currentTarget.src = '/placeholder.svg';
            }
          }}
        />
        
        <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Hold
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 text-center font-bold p-2 bg-black/50 text-white group-hover:bg-orange/80 transition-colors">
          ₹{decoration.price.toLocaleString()}
        </div>
        
        {decoration.planType === "basic" && <Badge className="absolute top-2 left-2 bg-blue-500">Basic</Badge>}
        {decoration.planType === "premium" && <Badge className="absolute top-2 left-2 bg-purple-500">Premium</Badge>}
        {decoration.planType === "elite" && <Badge className="absolute top-2 left-2 bg-gold text-black">Elite</Badge>}
      </div>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-screen-lg w-full h-full max-h-screen p-0 bg-black/95">
          <DialogHeader className="absolute top-4 left-4 right-4 z-10">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-white text-lg">
                {decoration.name}
              </DialogTitle>
              <button
                onClick={() => setIsImageModalOpen(false)}
                className="text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </DialogHeader>
          
          <div className="flex items-center justify-center w-full h-full p-4">
            <img
              src={getImagePath(decoration.id)}
              alt={decoration.name}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                const currentSrc = e.currentTarget.src;
                const match = decoration.id.match(/dec_(\d+)_/);
                
                if (match && match[1]) {
                  const price = match[1];
                  
                  // Try different image variants in order of preference
                  const imageVariants = [
                    `/${price}.jpg`,
                    `/${price} rs.jpg`,
                    `/${price} price.jpg`,
                    `/${price} pri.jpg`,
                    `/${price} (2).jpg`,
                    `/${price} rs 2.jpg`,
                    `/${price} rs 3.jpg`,
                    `/${price} rs 4.jpg`,
                    `/${price} rs 5.jpg`,
                    `/${price} rs (1).jpg`,
                    `/${price} rs (2).jpg`,
                    `/${price} price 2.jpg`,
                    `/${price} rs h.jpg`,
                    `/${price} rs2.jpg`,
                    `/${price} 6.jpg`,
                    `/${price} 7.jpg`,
                    `/${price}.png`
                  ];
                  
                  // Find current variant index and try next one
                  const currentIndex = imageVariants.findIndex(variant => currentSrc.includes(variant.substring(1)));
                  const nextIndex = currentIndex + 1;
                  
                  if (nextIndex < imageVariants.length) {
                    e.currentTarget.src = imageVariants[nextIndex];
                  } else {
                    // All variants failed, use placeholder
                    console.warn(`All modal image variants failed for decoration ${decoration.id} (price: ${price})`);
                    e.currentTarget.src = '/placeholder.svg';
                  }
                } else {
                  // No price pattern found, use placeholder
                  console.warn(`Invalid decoration ID pattern in modal: ${decoration.id}`);
                  e.currentTarget.src = '/placeholder.svg';
                }
              }}
            />
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <div className="bg-black/50 text-white px-4 py-2 rounded-lg inline-block">
              <p className="font-semibold">{decoration.name}</p>
              <p className="text-sm">Price: ₹{decoration.price?.toLocaleString()}</p>
              <p className="text-xs opacity-75">Plan: {decoration.planType}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const decorations = [
  // Basic Plan Decorations (1600-3000 price range)
  { id: "dec_1600_1", name: "Cozy Black & Gold Setup", price: 1600, planType: "basic" },
  { id: "dec_1900_1", name: "Classic Gold Glamour", price: 1900, planType: "basic" },
  { id: "dec_2000_1", name: "Elegant Green Arch", price: 2000, planType: "basic" },
  { id: "dec_2000_2", name: "Modern Black & Pink Arch", price: 2000, planType: "basic" },
  { id: "dec_2000_3", name: "Birthday Special Setup", price: 2000, planType: "basic" },
  { id: "dec_2300_1", name: "White & Gold Circle Arch", price: 2300, planType: "basic" },
  { id: "dec_2300_2", name: "Pastel Eyelash Arch", price: 2300, planType: "basic" },
  { id: "dec_2300_3", name: "Gold Theme Party", price: 2300, planType: "basic" },
  { id: "dec_2400_1", name: "White & Gold Circle Arch", price: 2400, planType: "basic" },
  { id: "dec_2400_2", name: "Black & Gold Milestone", price: 2400, planType: "basic" },
  { id: "dec_2400_3", name: "Classic Party Setup", price: 2400, planType: "basic" },
  { id: "dec_2400_4", name: "Birthday Backdrop", price: 2400, planType: "basic" },
  { id: "dec_2400_5", name: "Elegant Celebration", price: 2400, planType: "basic" },
  { id: "dec_2400_6", name: "Golden Party Theme", price: 2400, planType: "basic" },
  { id: "dec_2400_7", name: "Premium Basic Setup", price: 2400, planType: "basic" },
  { id: "dec_2500_1", name: "Enhanced Party Theme", price: 2500, planType: "basic" },
  { id: "dec_2500_2", name: "Colorful Celebration", price: 2500, planType: "basic" },
  { id: "dec_2500_3", name: "Special Birthday Setup", price: 2500, planType: "basic" },
  { id: "dec_2600_1", name: "Upgraded Party Decor", price: 2600, planType: "basic" },
  { id: "dec_2600_2", name: "Enhanced Milestone", price: 2600, planType: "basic" },
  { id: "dec_2700_1", name: "Deluxe Basic Theme", price: 2700, planType: "basic" },
  { id: "dec_2700_2", name: "Superior Setup", price: 2700, planType: "basic" },
  { id: "dec_2800_1", name: "Advanced Party Decor", price: 2800, planType: "basic" },
  { id: "dec_2900_1", name: "Elite Basic Setup", price: 2900, planType: "basic" },
  { id: "dec_3000_1", name: "Top Basic Theme", price: 3000, planType: "basic" },

  // Premium Plan Decorations (3500-5300 price range)
  { id: "dec_3500_1", name: "Premium Setup", price: 3500, planType: "premium" },
  { id: "dec_3600_1", name: "Premium Arch", price: 3600, planType: "premium" },
  { id: "dec_3700_1", name: "Premium Milestone", price: 3700, planType: "premium" },
  { id: "dec_3900_1", name: "Premium Elegance", price: 3900, planType: "premium" },
  { id: "dec_3900_2", name: "Premium Garden Theme", price: 3900, planType: "premium" },
  { id: "dec_3900_3", name: "Premium Celebration", price: 3900, planType: "premium" },
  { id: "dec_4000_1", name: "Premium Deluxe", price: 4000, planType: "premium" },
  { id: "dec_4000_2", name: "Premium Royal Setup", price: 4000, planType: "premium" },
  { id: "dec_4000_3", name: "Premium Birthday Theme", price: 4000, planType: "premium" },
  { id: "dec_4000_4", name: "Premium Party Deluxe", price: 4000, planType: "premium" },
  { id: "dec_4200_1", name: "Premium Luxury", price: 4200, planType: "premium" },
  { id: "dec_4200_2", name: "Premium Gold Theme", price: 4200, planType: "premium" },
  { id: "dec_4200_3", name: "Premium Elegant Setup", price: 4200, planType: "premium" },
  { id: "dec_4500_1", name: "Premium Elite", price: 4500, planType: "premium" },
  { id: "dec_4700_1", name: "Premium Superior", price: 4700, planType: "premium" },
  { id: "dec_4800_1", name: "Premium Plus", price: 4800, planType: "premium" },
  { id: "dec_4800_2", name: "Premium Deluxe Plus", price: 4800, planType: "premium" },
  { id: "dec_4900_1", name: "Premium Special Theme", price: 4900, planType: "premium" },
  { id: "dec_4900_2", name: "Premium Birthday Special", price: 4900, planType: "premium" },
  { id: "dec_4900_3", name: "Premium Celebration Plus", price: 4900, planType: "premium" },
  { id: "dec_4900_4", name: "Premium Royal Plus", price: 4900, planType: "premium" },
  { id: "dec_4900_5", name: "Premium Grand Setup", price: 4900, planType: "premium" },
  { id: "dec_4900_6", name: "Premium Magnificent", price: 4900, planType: "premium" },
  { id: "dec_4900_7", name: "Premium Ultimate", price: 4900, planType: "premium" },
  { id: "dec_4900_8", name: "Premium Elite Plus", price: 4900, planType: "premium" },
  { id: "dec_5000_1", name: "Premium Master Setup", price: 5000, planType: "premium" },
  { id: "dec_5000_2", name: "Premium Grand Theme", price: 5000, planType: "premium" },
  { id: "dec_5200_1", name: "Premium Supreme", price: 5200, planType: "premium" },
  { id: "dec_5200_2", name: "Premium Royal Supreme", price: 5200, planType: "premium" },
  { id: "dec_5300_1", name: "Premium Top Tier", price: 5300, planType: "premium" },
  { id: "dec_5300_2", name: "Premium Ultimate Plus", price: 5300, planType: "premium" },
  { id: "dec_5300_3", name: "Premium Grand Finale", price: 5300, planType: "premium" },

  // Elite Plan Decorations (Above 5300 price range)
  { id: "dec_5500_1", name: "Elite Farm Theme", price: 5500, planType: "elite" },
  { id: "dec_5900_1", name: "Elite Luxury Theme", price: 5900, planType: "elite" },
  { id: "dec_5900_2", name: "Elite Royal Setup", price: 5900, planType: "elite" },
  { id: "dec_5900_3", name: "Elite Premium Plus", price: 5900, planType: "elite" },
  { id: "dec_5900_4", name: "Elite Celebration Supreme", price: 5900, planType: "elite" },
  { id: "dec_6000_1", name: "Elite Master Theme", price: 6000, planType: "elite" },
  { id: "dec_6000_2", name: "Elite Grand Celebration", price: 6000, planType: "elite" },
  { id: "dec_6200_1", name: "Elite Supreme Setup", price: 6200, planType: "elite" },
  { id: "dec_6200_2", name: "Elite Royal Supreme", price: 6200, planType: "elite" },
  { id: "dec_6300_1", name: "Elite Ultra Premium", price: 6300, planType: "elite" },
  { id: "dec_6400_1", name: "Elite Grand Master", price: 6400, planType: "elite" },
  { id: "dec_6400_2", name: "Elite Luxury Plus", price: 6400, planType: "elite" },
  { id: "dec_6400_3", name: "Elite Royal Plus", price: 6400, planType: "elite" },
  { id: "dec_6400_4", name: "Elite Supreme Plus", price: 6400, planType: "elite" },
  { id: "dec_6500_1", name: "Elite Ultimate Setup", price: 6500, planType: "elite" },
  { id: "dec_6500_2", name: "Elite Magnificent Theme", price: 6500, planType: "elite" },
  { id: "dec_6500_3", name: "Elite Royal Deluxe", price: 6500, planType: "elite" },
  { id: "dec_6500_4", name: "Elite Grand Deluxe", price: 6500, planType: "elite" },
  { id: "dec_6500_5", name: "Elite Premium Master", price: 6500, planType: "elite" },
  { id: "dec_6500_6", name: "Elite Luxury Master", price: 6500, planType: "elite" },
  { id: "dec_6500_7", name: "Elite Supreme Master", price: 6500, planType: "elite" },
  { id: "dec_6500_8", name: "Elite Royal Master", price: 6500, planType: "elite" },
  { id: "dec_6500_9", name: "Elite Grand Master Plus", price: 6500, planType: "elite" },
  { id: "dec_6500_10", name: "Elite Ultimate Plus", price: 6500, planType: "elite" },
  { id: "dec_6700_1", name: "Elite Platinum Setup", price: 6700, planType: "elite" },
  { id: "dec_6700_2", name: "Elite Platinum Theme", price: 6700, planType: "elite" },
  { id: "dec_6800_1", name: "Elite Diamond Setup", price: 6800, planType: "elite" },
  { id: "dec_6800_2", name: "Elite Diamond Theme", price: 6800, planType: "elite" },
  { id: "dec_6800_3", name: "Elite Diamond Plus", price: 6800, planType: "elite" },
  { id: "dec_6800_4", name: "Elite Diamond Royal", price: 6800, planType: "elite" },
  { id: "dec_6800_5", name: "Elite Diamond Master", price: 6800, planType: "elite" },
  { id: "dec_6800_6", name: "Elite Diamond Supreme", price: 6800, planType: "elite" },
  { id: "dec_6800_7", name: "Elite Diamond Deluxe", price: 6800, planType: "elite" },
  { id: "dec_6800_8", name: "Elite Diamond Premium", price: 6800, planType: "elite" },
  { id: "dec_6800_9", name: "Elite Diamond Luxury", price: 6800, planType: "elite" },
  { id: "dec_6800_10", name: "Elite Diamond Ultimate", price: 6800, planType: "elite" },
  { id: "dec_6800_11", name: "Elite Diamond Grand", price: 6800, planType: "elite" },
  { id: "dec_6800_12", name: "Elite Diamond Elite", price: 6800, planType: "elite" },
  { id: "dec_6900_1", name: "Elite Platinum Plus", price: 6900, planType: "elite" },
  { id: "dec_6900_2", name: "Elite Platinum Royal", price: 6900, planType: "elite" },
  { id: "dec_6900_3", name: "Elite Platinum Master", price: 6900, planType: "elite" },
  { id: "dec_6900_4", name: "Elite Platinum Supreme", price: 6900, planType: "elite" },
  { id: "dec_6900_5", name: "Elite Platinum Deluxe", price: 6900, planType: "elite" },
  { id: "dec_6900_6", name: "Elite Platinum Premium", price: 6900, planType: "elite" },
  { id: "dec_6900_7", name: "Elite Platinum Luxury", price: 6900, planType: "elite" },
  { id: "dec_6900_8", name: "Elite Platinum Ultimate", price: 6900, planType: "elite" },
  { id: "dec_6900_9", name: "Elite Platinum Grand", price: 6900, planType: "elite" },
  { id: "dec_6900_10", name: "Elite Platinum Elite", price: 6900, planType: "elite" },
  { id: "dec_7000_1", name: "Elite Gold Master", price: 7000, planType: "elite" },
  { id: "dec_7000_2", name: "Elite Gold Supreme", price: 7000, planType: "elite" },
  { id: "dec_7200_1", name: "Elite Crystal Setup", price: 7200, planType: "elite" },
  { id: "dec_7200_2", name: "Elite Crystal Theme", price: 7200, planType: "elite" },
  { id: "dec_7300_1", name: "Elite Sapphire Setup", price: 7300, planType: "elite" },
  { id: "dec_7500_1", name: "Elite Ruby Setup", price: 7500, planType: "elite" },
  { id: "dec_7500_2", name: "Elite Ruby Theme", price: 7500, planType: "elite" },
  { id: "dec_7800_1", name: "Elite Emerald Master", price: 7800, planType: "elite" }
];

const welcomeDrinks = [
  { value: "rosemilk", label: "Rose Milk" },
  { value: "mojito", label: "Virgin Mojito" }
];

const basicAddOns = [
  { id: 'big_poppers', name: 'Big Poppers', price: 100 },
  { id: 'crown', name: 'Crown', price: 120 },
  { id: 'birthday_sash', name: 'Birthday Sash', price: 80 }
];

export const ComprehensiveBookingForm = ({ onBookingComplete }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [bookedSlots, setBookedSlots] = useState([]);

  const [formData, setFormData] = useState({
    selectedPlan: "",
    eventType: "",
    applicantName: "",
    contact: "",
    email: "",
    address: "",
    birthdayName: "",
    coupleName1: "",
    coupleName2: "",
    brideName: "",
    groomName: "",
    guests: "",
    date: undefined,
    timeSlot: "",
    selectedDecoration: "",
    balloonColors: [],
    selectedAddOns: [],
    selectedDrink: "",
    needComplimentaryItems: false,
    otpVerified: false,
    // New fields for enhanced features
    hangingPhotos: [],
    ledLightName: "",
    ageLightNumber: "",
    needHangingPhotos: false,
    needLedLight: false,
    needAgeLight: false,
  });

  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (formData.date) {
        const selectedDate = format(formData.date, 'yyyy-MM-dd');
        try {
          const availableSlots = await getAvailableSlots(selectedDate);
          console.log('Available slots from API:', availableSlots);
          // Get booked slots by inverting the available slots
          const allSlots = timeSlots;
          const bookedSlots = allSlots.filter(slot => !availableSlots.includes(slot));
          console.log('Calculated booked slots:', bookedSlots);
          setBookedSlots(bookedSlots);
        } catch (error) {
          console.error('Error fetching booked slots:', error);
          // On error, assume all slots are available (empty booked slots)
          setBookedSlots([]);
        }
      }
    };

    fetchBookedSlots();
  }, [formData.date]);

  const handleNext = () => { if (step < 5) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };

  const handleAddOnChange = (addon, quantity) => {
    setFormData(prev => {
      const existingIndex = prev.selectedAddOns.findIndex(item => item.id === addon.id);
      const newAddOns = [...prev.selectedAddOns];

      if (quantity === 0) {
        if (existingIndex >= 0) {
          newAddOns.splice(existingIndex, 1);
        }
      } else {
        if (existingIndex >= 0) {
          newAddOns[existingIndex] = { ...addon, quantity };
        } else {
          newAddOns.push({ ...addon, quantity });
        }
      }

      return { ...prev, selectedAddOns: newAddOns };
    });
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const maxPhotos = 9;
    
    if (formData.hangingPhotos.length + files.length > maxPhotos) {
      toast({
        title: "Too many photos",
        description: `You can only upload up to ${maxPhotos} photos.`,
        variant: "destructive"
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      hangingPhotos: [...prev.hangingPhotos, ...files].slice(0, maxPhotos)
    }));
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      hangingPhotos: prev.hangingPhotos.filter((_, i) => i !== index)
    }));
  };

  const uploadPhotosToSupabase = async (photos) => {
    const uploadedUrls = [];
    
    for (const photo of photos) {
      try {
        // Create a unique filename
        const fileExt = photo.name.split('.').pop();
        const fileName = `hanging-photos/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Create form data for upload
        const formData = new FormData();
        formData.append('file', photo);
        formData.append('filename', fileName);
        
        const response = await api.post('/upload/booking-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        
        if (response.data && response.data.success) {
          uploadedUrls.push(response.data.url);
        } else {
          console.error('Photo upload error:', response.data);
          toast({
            title: "Upload Permission Error",
            description: "Some photos could not be uploaded. Your booking will still be created.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Photo upload error:', error);
        continue;
      }
    }
    
    return uploadedUrls;
  };

  const calculatePricing = () => {
    const selectedDecorationDetails = decorations.find(d => d.id === formData.selectedDecoration);
    const decorationPrice = selectedDecorationDetails?.price || 0;

    let addOnsPrice = 0;
    let premiumPrice = 0;
    let eliteIncludedItems = [];
    let enhancedFeaturesPrice = 0;

    // Calculate enhanced features pricing (for all plans except elite which has name/age lights included)
    if (formData.selectedPlan !== 'elite') {
      if (formData.needLedLight) enhancedFeaturesPrice += 80;
      if (formData.needAgeLight) enhancedFeaturesPrice += 80;
    }
    
    // Hanging photos pricing (for all plans)
    if (formData.needHangingPhotos) {
      enhancedFeaturesPrice += formData.hangingPhotos.length * 80;
    }

    if (formData.selectedPlan === 'elite') {
      eliteIncludedItems = [
        'Complimentary 1 kg themed cake',
        'Name light & age light included',
        '6 cupcakes',
        'Welcome drinks (Mojito & Rose Milk)',
        'Up to 30 guests complimentary',
        'All basic add-ons included',
        'Special menu will be pre order based'
      ];
      addOnsPrice = 0;
      premiumPrice = 0;
    } else {
      addOnsPrice = formData.selectedAddOns.reduce((total, addon) => total + (addon.price * addon.quantity), 0);

      if (formData.selectedPlan === 'premium') {
        if (formData.needComplimentaryItems) premiumPrice += 300;
      }
    }

    const totalAmount = decorationPrice + addOnsPrice + premiumPrice + enhancedFeaturesPrice;
    const advancePaid = 500;
    const balanceAmount = totalAmount - advancePaid;

    return {
      decorationPrice,
      addOnsPrice,
      premiumPrice,
      enhancedFeaturesPrice,
      totalAmount,
      advancePaid,
      balanceAmount: Math.max(balanceAmount, 0),
      eliteIncludedItems
    };
  };

  const generateQRCode = async (bookingData) => {
    try {
      const qrData = {
        bookingId: bookingData.booking_id,
      };

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      return qrCodeDataURL;
    } catch (error) {
      console.error('Error generating QR code:', error);
      return null;
    }
  };

  const checkAvailability = async () => {
    try {
      const selectedDate = format(formData.date, 'yyyy-MM-dd');
      const availableSlots = await getAvailableSlots(selectedDate);
      
      // Check if the selected time slot is in the available slots
      return availableSlots.includes(formData.timeSlot);
    } catch (error) {
      console.error('Error in checkAvailability:', error);
      return true; // Assume available on error
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const isSlotAvailable = await checkAvailability();
    if (!isSlotAvailable) {
        toast({
            title: "Booking Failed",
            description: "The selected time slot is no longer available. Please choose another slot.",
            variant: "destructive",
        });
        setIsSubmitting(false);
        return;
    }

    try {
      const pricing = calculatePricing();
      const selectedDecorationDetails = decorations.find(d => d.id === formData.selectedDecoration);
      const bookingId = `C3-${Date.now()}`;

      // Upload hanging photos if any
      let uploadedPhotoUrls = [];
      if (formData.needHangingPhotos && formData.hangingPhotos.length > 0) {
        try {
          console.log('Starting photo upload for', formData.hangingPhotos.length, 'photos');
          uploadedPhotoUrls = await uploadPhotosToSupabase(formData.hangingPhotos);
          console.log('Photos uploaded successfully:', uploadedPhotoUrls);
          
          if (uploadedPhotoUrls.length === 0) {
            toast({
              title: "Photo Upload Warning",
              description: "Photos could not be uploaded due to system restrictions. Your booking will still be created without photos.",
              variant: "destructive"
            });
          } else if (uploadedPhotoUrls.length < formData.hangingPhotos.length) {
            toast({
              title: "Partial Photo Upload",
              description: `Only ${uploadedPhotoUrls.length} out of ${formData.hangingPhotos.length} photos were uploaded successfully.`,
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error('Photo upload failed:', error);
          toast({
            title: "Photo Upload Failed",
            description: "Photos could not be uploaded. Your booking will still be created without photos.",
            variant: "destructive"
          });
        }
      }

      const bookingData = {
        booking_id: bookingId,
        applicant_name: formData.applicantName,
        contact: formData.contact,
        email: formData.email || null,
        address: formData.address || null,
        event_type: formData.eventType,
        birthday_name: formData.birthdayName || null,
        couple_name1: formData.coupleName1 || null,
        couple_name2: formData.coupleName2 || null,
        bride_name: formData.brideName || null,
        groom_name: formData.groomName || null,
        plan_type: formData.selectedPlan,
        event_date: formData.date.toISOString().split('T')[0],
        time_slot: formData.timeSlot,
        guests: parseInt(formData.guests),
        decoration_id: formData.selectedDecoration,
        decoration_name: selectedDecorationDetails?.name,
        decoration_price: pricing.decorationPrice,
        base_price: pricing.decorationPrice,
        addons_price: pricing.addOnsPrice + pricing.premiumPrice + pricing.enhancedFeaturesPrice,
        total_amount: pricing.totalAmount,
        advance_paid: pricing.advancePaid,
        balance_amount: pricing.balanceAmount,
        status: 'pending',
        payment_status: 'advance_paid',
        // Use existing database columns
        led_light_name: formData.needLedLight ? formData.ledLightName : null,
        age_light_age: formData.needAgeLight ? parseInt(formData.ageLightNumber) || null : null,
        selected_addons: JSON.stringify({
          addons: formData.selectedAddOns,
          hanging_photos: formData.needHangingPhotos ? {
            enabled: true,
            count: formData.hangingPhotos.length,
            urls: uploadedPhotoUrls
          } : { enabled: false },
          led_light: { enabled: formData.needLedLight, name: formData.ledLightName },
          age_light: { enabled: formData.needAgeLight, number: formData.ageLightNumber }
        }),
        balloon_colors: JSON.stringify(formData.balloonColors),
        // uploaded_image_urls: uploadedPhotoUrls.length > 0 ? uploadedPhotoUrls : null,
      };

      // Skip selected_drink for now until database is updated
      // if (formData.selectedDrink) {
      //   bookingData.selected_drink = formData.selectedDrink;
      // }

      const qrCodeData = await generateQRCode(bookingData);
      if (qrCodeData) {
        bookingData.qr_code_data = qrCodeData;
      }

      // Save to database via MongoDB API
      const data = await createBooking(bookingData);

      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been successfully created with advance payment."
      });

      const successData = {
        ...data,
        selected_addons: formData.selectedAddOns,
        balloon_colors: formData.balloonColors,
        hanging_photos_urls: uploadedPhotoUrls,
        hanging_photos_count: uploadedPhotoUrls.length,
        enhanced_features: {
          hanging_photos: { enabled: formData.needHangingPhotos, urls: uploadedPhotoUrls },
          led_light: { enabled: formData.needLedLight, name: formData.ledLightName },
          age_light: { enabled: formData.needAgeLight, number: formData.ageLightNumber }
        },
        decorationDetails: selectedDecorationDetails,
        pricing
      };

      onBookingComplete(successData);

    } catch (error) {
      console.error('Error creating booking:', error);
      
      let errorMessage = "There was an error creating your booking. Please try again.";
      
      // Handle specific error types
      if (error?.message) {
        if (error.message.includes('age_light_number') || error.message.includes('age_light_age')) {
          errorMessage = "There was an issue with the age light configuration. Please try again.";
        } else if (error.message.includes('schema cache')) {
          errorMessage = "Database configuration issue. Please contact support or try again later.";
        } else if (error.message.includes('row-level security')) {
          errorMessage = "Permission issue detected. Your booking data is valid but couldn't be saved.";
        } else if (error.code === '23505') {
          errorMessage = "This booking ID already exists. Please try again.";
        }
      }
      
      toast({
        title: "Booking Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEventType = eventTypes.find(type => type.value === formData.eventType);
  const selectedDecorationDetails = decorations.find(d => d.id === formData.selectedDecoration);
  const pricing = calculatePricing();

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header with Step Indicator */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-orange to-primary bg-clip-text text-transparent">
          Book Your Perfect Celebration
        </h1>
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 md:space-x-4">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-orange text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > num ? <CheckCircle className="h-4 w-4" /> : num}
                </div>
                {num < 5 && <div className={`w-8 md:w-12 h-0.5 ${step > num ? 'bg-orange' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {step === 1 && "Plan Selection"}
          {step === 2 && "Customer Information"}
          {step === 3 && "Event Details & Decoration"}
          {step === 4 && "Customization & Add-ons"}
          {step === 5 && "Payment & Confirmation"}
        </div>
      </div>

      {/* Step 1: Plan Selection */}
      {step === 1 && (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange" />
              Choose Your Plan
            </CardTitle>
            <CardDescription>Select the plan that best fits your celebration needs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              {/* Basic Plan */}
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.selectedPlan === 'basic' ? 'border-orange bg-orange/5' : 'border-muted hover:border-orange/50'
                }`}
                onClick={() => setFormData({...formData, selectedPlan: 'basic'})}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Basic Plan</h3>
                  <Badge variant="outline">₹1,600 - ₹3,000</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Hanging Photos - ₹80 per photo (up to 9 photos)</li>
                  <li>• LED Light - ₹80 (custom name)</li>
                  <li>• Age Light - ₹80 (custom age)</li>
                  <li>• Big Poppers - ₹100</li>
                  <li>• Crown - ₹120</li>
                  <li>• Birthday Sash - ₹80</li>
                  <li>• Balloon Color Customization</li>
                  <li>• Basic decoration setups</li>
                </ul>
              </div>

              {/* Premium Plan */}
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.selectedPlan === 'premium' ? 'border-orange bg-orange/5' : 'border-muted hover:border-orange/50'
                }`}
                onClick={() => setFormData({...formData, selectedPlan: 'premium'})}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Premium Plan</h3>
                  <Badge variant="secondary">₹3,500 - ₹4,800</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Hanging Photos - ₹80 per photo (up to 9 photos)</li>
                  <li>• LED Light - ₹80 (custom name)</li>
                  <li>• Age Light - ₹80 (custom age)</li>
                  <li>• Complimentary welcome drinks (Rose Milk & Mojito)</li>
                  <li>• Complimentary ½ kg cake</li>
                  <li>• Sash, crown, and poppers (chargeable)</li>
                  <li>• Maximum of 30 guests allowed</li>
                  <li>• Premium decoration setups</li>
                </ul>
              </div>

              {/* Elite Plan */}
              <div
                className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.selectedPlan === 'elite' ? 'border-orange bg-orange/5' : 'border-muted hover:border-orange/50'
                }`}
                onClick={() => setFormData({...formData, selectedPlan: 'elite'})}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Elite Plan</h3>
                  <Badge className="bg-gold text-black">₹4,900 - ₹6,000</Badge>
                </div>
                <ul className="space-y-2 text-sm">
                  <li>• Hanging Photos - ₹80 per photo (up to 9 photos)</li>
                  <li>• Complimentary 1 kg themed cake</li>
                  <li>• Name light & age light included</li>
                  <li>• 6 cupcakes included</li>
                  <li>• Welcome drinks (Mojito & Rose Milk)</li>
                  <li>• Complimentary for up to 30 guests</li>
                  <li>• All basic add-ons included</li>
                  <li>• Special menu will be pre order based</li>
                  <li>• Premium decorations included</li>
                  <li>• Priority booking & support</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleNext}
              size="lg"
              className="w-full bg-orange hover:bg-orange-dark"
              disabled={!formData.selectedPlan}
            >
              Continue with {formData.selectedPlan ? formData.selectedPlan.charAt(0).toUpperCase() + formData.selectedPlan.slice(1) : ''} Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Customer Information */}
      {step === 2 && (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange" />
              Customer Information
            </CardTitle>
            <CardDescription>Tell us about your celebration and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value})}>
                  <SelectTrigger><SelectValue placeholder="Select your event type" /></SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedEventType && (
                <div className="space-y-4 p-4 bg-orange/5 rounded-lg border border-orange/20">
                  <h4 className="font-medium">Event Details</h4>
                  {selectedEventType.fields.includes("birthdayName") && (
                    <div>
                      <Label htmlFor="birthdayName">Birthday Person's Name</Label>
                      <Input
                        id="birthdayName"
                        value={formData.birthdayName}
                        onChange={(e) => setFormData({...formData, birthdayName: e.target.value})}
                        placeholder="Enter name"
                      />
                    </div>
                  )}
                  {selectedEventType.fields.includes("coupleName1") && (
                    <>
                      <div>
                      <Label htmlFor="coupleName1">Partner 1 Name</Label>
                        <Input
                          id="coupleName1"
                          value={formData.coupleName1}
                          onChange={(e) => setFormData({...formData, coupleName1: e.target.value})}
                          placeholder="Enter first partner's name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="coupleName2">Partner 2 Name</Label>
                        <Input
                          id="coupleName2"
                          value={formData.coupleName2}
                          onChange={(e) => setFormData({...formData, coupleName2: e.target.value})}
                          placeholder="Enter second partner's name"
                        />
                      </div>
                    </>
                  )}
                  {selectedEventType.fields.includes("brideName") && (
                    <div>
                      <Label htmlFor="brideName">Bride's Name</Label>
                      <Input
                        id="brideName"
                        value={formData.brideName}
                        onChange={(e) => setFormData({...formData, brideName: e.target.value})}
                        placeholder="Enter bride's name"
                      />
                    </div>
                  )}
                  {selectedEventType.fields.includes("groomName") && (
                    <div>
                      <Label htmlFor="groomName">Groom's Name</Label>
                      <Input
                        id="groomName"
                        value={formData.groomName}
                        onChange={(e) => setFormData({...formData, groomName: e.target.value})}
                        placeholder="Enter groom's name"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="applicantName">Applicant Name (Person Booking)</Label>
                <Input
                  id="applicantName"
                  value={formData.applicantName}
                  onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  placeholder="Your phone number"
                />
              </div>

              {/* <div>
                <Label htmlFor="email">Email Address (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Your email address"
                />
              </div> */}

              {/* <div>
                <Label htmlFor="address">Address (Optional)</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Your complete address"
                  rows={3}
                />
              </div> */}
            </div>

            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleNext}
                size="lg"
                className="flex-1 bg-orange hover:bg-orange-dark"
                disabled={!formData.eventType || !formData.applicantName || !formData.contact}
              >
                Continue to Event Details
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Event Details & Decoration */}
      {step === 3 && (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange" />
              Event Details & Decoration
            </CardTitle>
            <CardDescription>Choose your decoration, date, and preferred time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label className="flex items-center gap-2 mb-2 font-semibold">
                  <Palette className="h-4 w-4" />
                  Choose your Decoration
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2 bg-muted/50 rounded-lg">
                  {formData.selectedPlan ? (
                    decorations
                      .filter(deco => deco.planType === formData.selectedPlan)
                      .map((deco) => (
                        <DecorationSelectionCard
                          key={deco.id}
                          decoration={deco}
                          isSelected={formData.selectedDecoration === deco.id}
                          onSelect={() => setFormData({ ...formData, selectedDecoration: deco.id })}
                        />
                      ))
                  ) : (
                    <p className="col-span-full text-center text-muted-foreground">
                      Please select a plan in Step 1 to see available decorations.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="guests">Number of Guests</Label>
                  <Input
                    id="guests"
                    type="number"
                    value={formData.guests}
                    onChange={(e) => setFormData({...formData, guests: e.target.value})}
                    placeholder="Enter guest count"
                  />
                </div>

                <div>
                  <Label>Event Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.date}
                        onSelect={(date) => setFormData({...formData, date})}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div>
                <Label htmlFor="timeSlot">Preferred Time Slot</Label>
                <Select value={formData.timeSlot} onValueChange={(value) => setFormData({...formData, timeSlot: value})}>
                  <SelectTrigger><SelectValue placeholder="Select time slot" /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                        {slot} {bookedSlots.includes(slot) && "(Booked)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleNext}
                size="lg"
                className="flex-1 bg-orange hover:bg-orange-dark"
                disabled={!formData.selectedDecoration || !formData.guests || !formData.date || !formData.timeSlot}
              >
                Continue to Customization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Customization & Add-ons */}
      {step === 4 && (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange" />
              Customization & Add-ons
            </CardTitle>
            <CardDescription>Enhance your {formData.selectedPlan} plan with add-ons and customizations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Balloon Color Selection */}
            <div>
              <Label className="font-semibold mb-3 block">Balloon Color Customization</Label>
              <BalloonColorSelector
                selectedColors={formData.balloonColors}
                onColorsChange={(colors) => setFormData({...formData, balloonColors: colors})}
                balloonImage={getImagePath(formData.selectedDecoration)}
                selectedPlan={formData.selectedPlan}
              />
            </div>

            <Separator />

            {/* Welcome Drink Selection for Premium and Elite */}
            {(formData.selectedPlan === 'premium' || formData.selectedPlan === 'elite') && (
              <div className="space-y-4">
                <h4 className="font-semibold">Welcome Drink Selection</h4>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <Label htmlFor="drinkChoice">Choose your complimentary welcome drink:</Label>
                  <Select value={formData.selectedDrink} onValueChange={(value) => setFormData({...formData, selectedDrink: value})}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Mojito or Rose Milk?" />
                    </SelectTrigger>
                    <SelectContent>
                      {welcomeDrinks.map((drink) => (
                        <SelectItem key={drink.value} value={drink.value}>{drink.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            <Separator />

            {/* Enhanced Features - For All Plans */}
            <div className="space-y-4">
              <h4 className="font-semibold">Enhanced Features (All Plans)</h4>
              
              {/* Hanging Photos */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hangingPhotos"
                      checked={formData.needHangingPhotos}
                      onCheckedChange={(checked) => setFormData({...formData, needHangingPhotos: !!checked})}
                    />
                    <Label htmlFor="hangingPhotos" className="font-medium flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Hanging Photos
                    </Label>
                  </div>
                  <span className="text-sm font-medium">₹80 per photo</span>
                </div>
                
                <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium mb-1">📱 WhatsApp Photo Sharing</p>
                  <p className="text-xs text-green-700">
                    Photos can be shared via WhatsApp to +91 88254 74043 for easier communication.
                    The hanging photos cost (₹80 per photo) will be collected separately via WhatsApp.
                  </p>
                </div>
                
                {formData.needHangingPhotos && (
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      {formData.hangingPhotos.length}/9 photos selected
                      {formData.hangingPhotos.length > 0 && ` • Total: ₹${formData.hangingPhotos.length * 80}`}
                    </p>
                  </div>
                )}
              </div>

              {/* LED Light */}
              {(formData.selectedPlan !== 'elite') && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ledLight"
                        checked={formData.needLedLight}
                        onCheckedChange={(checked) => setFormData({...formData, needLedLight: !!checked})}
                      />
                      <Label htmlFor="ledLight" className="font-medium flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        LED Light (Custom Name)
                      </Label>
                    </div>
                    <span className="text-sm font-medium">₹80</span>
                  </div>
                  
                  {formData.needLedLight && (
                    <div className="space-y-2">
                      <Label htmlFor="ledLightName">Name to display on LED Light</Label>
                      <Input
                        id="ledLightName"
                        value={formData.ledLightName}
                        onChange={(e) => setFormData({...formData, ledLightName: e.target.value})}
                        placeholder="Enter name for LED display"
                        maxLength={20}
                      />
                      <p className="text-xs text-muted-foreground">Maximum 20 characters</p>
                    </div>
                  )}
                </div>
              )}

              {/* Age Light */}
              {(formData.selectedPlan !== 'elite') && (
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="ageLight"
                        checked={formData.needAgeLight}
                        onCheckedChange={(checked) => setFormData({...formData, needAgeLight: !!checked})}
                      />
                      <Label htmlFor="ageLight" className="font-medium flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Age Light (Custom Age)
                      </Label>
                    </div>
                    <span className="text-sm font-medium">₹80</span>
                  </div>
                  
                  {formData.needAgeLight && (
                    <div className="space-y-2">
                      <Label htmlFor="ageLightNumber">Age to display on Age Light</Label>
                      <Input
                        id="ageLightNumber"
                        value={formData.ageLightNumber}
                        onChange={(e) => setFormData({...formData, ageLightNumber: e.target.value})}
                        placeholder="Enter age number"
                        maxLength={3}
                      />
                      <p className="text-xs text-muted-foreground">Enter age number (e.g., 25, 30)</p>
                    </div>
                  )}
                </div>
              )}

              {/* Elite Plan Notice */}
              {formData.selectedPlan === 'elite' && (
                <div className="p-4 bg-gold/10 border border-gold rounded-lg">
                  <h5 className="font-medium mb-2 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Elite Plan - LED & Age Lights Included
                  </h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Your Elite plan includes LED Light and Age Light at no extra cost. Please provide the details below:
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="eliteLedName">Name for LED Light (Included)</Label>
                      <Input
                        id="eliteLedName"
                        value={formData.ledLightName}
                        onChange={(e) => setFormData({...formData, ledLightName: e.target.value, needLedLight: true})}
                        placeholder="Enter name for LED display"
                        maxLength={20}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="eliteAgeNumber">Age for Age Light (Included)</Label>
                      <Input
                        id="eliteAgeNumber"
                        value={formData.ageLightNumber}
                        onChange={(e) => setFormData({...formData, ageLightNumber: e.target.value, needAgeLight: true})}
                        placeholder="Enter age number"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Elite Plan - Everything Included */}
            {formData.selectedPlan === 'elite' && (
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Your Elite plan also includes:
                </h4>
                <div className="p-4 bg-gold/10 border border-gold rounded-lg">
                  <ul className="text-sm space-y-1">
                    <li>• Complimentary 1 kg themed cake</li>
                    <li>• 6 cupcakes</li>
                    <li>• Welcome drinks (Mojito & Rose Milk)</li>
                    <li>• All basic add-ons (poppers, crown, sash)</li>
                    <li>• Up to 30 guests complimentary</li>
                    <li>• Special menu will be pre order based</li>
                    <li>• Priority booking & support</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Basic Plan Add-ons */}
            {formData.selectedPlan === 'basic' && (
              <div className="space-y-4">
                <h4 className="font-semibold">Basic Plan Add-Ons</h4>
                <div className="grid gap-4">
                  {basicAddOns.map((addon) => (
                    <div key={addon.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">{addon.name}</h5>
                          <p className="text-sm text-muted-foreground">₹{addon.price} each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const current = formData.selectedAddOns.find(a => a.id === addon.id)?.quantity || 0;
                              handleAddOnChange(addon, Math.max(0, current - 1));
                            }}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center">
                            {formData.selectedAddOns.find(a => a.id === addon.id)?.quantity || 0}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const current = formData.selectedAddOns.find(a => a.id === addon.id)?.quantity || 0;
                              handleAddOnChange(addon, current + 1);
                            }}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Plan Features */}
            {formData.selectedPlan === 'premium' && (
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  Premium Plan Features
                </h4>

                {/* Complimentary Items */}
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <h5 className="font-medium mb-2">Included Complimentary:</h5>
                  <ul className="text-sm space-y-1">
                    <li>• Welcome drinks (Rose Milk & Mojito)</li>
                    <li>• ½ kg cake</li>
                    <li>• Maximum of 30 guests allowed</li>
                  </ul>
                </div>

                {/* Available Add-ons for Premium */}
                <div className="space-y-3">
                  <h5 className="font-medium">Available Add-ons (Chargeable):</h5>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="complimentary"
                        checked={formData.needComplimentaryItems}
                        onCheckedChange={(checked) => setFormData({...formData, needComplimentaryItems: !!checked})}
                      />
                      <Label htmlFor="complimentary" className="font-medium">Crown, Popper, Sash</Label>
                    </div>
                    <span className="text-sm font-medium">+₹300</span>
                  </div>

                  {/* Basic add-ons also available for premium */}
                  <div className="grid gap-4 mt-4">
                    <p className="text-sm font-medium">Basic Add-ons (also available):</p>
                    {basicAddOns.map((addon) => (
                      <div key={addon.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <h6 className="font-medium">{addon.name}</h6>
                            <p className="text-xs text-muted-foreground">₹{addon.price} each</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const current = formData.selectedAddOns.find(a => a.id === addon.id)?.quantity || 0;
                                handleAddOnChange(addon, Math.max(0, current - 1));
                              }}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">
                              {formData.selectedAddOns.find(a => a.id === addon.id)?.quantity || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const current = formData.selectedAddOns.find(a => a.id === addon.id)?.quantity || 0;
                                handleAddOnChange(addon, current + 1);
                              }}
                            >
                              +
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleNext}
                size="lg"
                className="flex-1 bg-orange hover:bg-orange-dark"
              >
                Continue to Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Payment & Confirmation */}
      {step === 5 && (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange" />
              Payment & Confirmation
            </CardTitle>
            <CardDescription>Review your booking and complete the advance payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Booking Summary */}
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-semibold">Booking Summary</h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Customer:</span>
                  <span className="font-medium">{formData.applicantName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Event:</span>
                  <span className="font-medium">{selectedEventType?.label}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date & Time:</span>
                  <span className="font-medium">
                    {formData.date ? format(formData.date, "PPP") : ""} at {formData.timeSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span className="font-medium">{formData.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Decoration:</span>
                  <span className="font-medium">{selectedDecorationDetails?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Plan:</span>
                  <Badge variant={formData.selectedPlan === 'elite' ? 'default' : formData.selectedPlan === 'premium' ? 'secondary' : 'outline'}>
                    {formData.selectedPlan.charAt(0).toUpperCase() + formData.selectedPlan.slice(1)}
                  </Badge>
                </div>
                {formData.selectedDrink && (
                  <div className="flex justify-between">
                    <span>Welcome Drink:</span>
                    <span className="font-medium">{welcomeDrinks.find(d => d.value === formData.selectedDrink)?.label}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Features Summary */}
            {(formData.needHangingPhotos || formData.needLedLight || formData.needAgeLight) && (
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">Enhanced Features</h4>
                <div className="space-y-2 text-sm">
                  {formData.needHangingPhotos && (
                    <div className="flex justify-between">
                      <span>Hanging Photos ({formData.hangingPhotos.length}):</span>
                      <span>₹{(formData.hangingPhotos.length * 80).toLocaleString()}</span>
                    </div>
                  )}
                  {formData.needLedLight && (
                    <div className="flex justify-between">
                      <span>LED Light ({formData.ledLightName}):</span>
                      <span>{formData.selectedPlan === 'elite' ? 'Included' : '₹80'}</span>
                    </div>
                  )}
                  {formData.needAgeLight && (
                    <div className="flex justify-between">
                      <span>Age Light ({formData.ageLightNumber}):</span>
                      <span>{formData.selectedPlan === 'elite' ? 'Included' : '₹80'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Breakdown */}
            <div className="space-y-4 p-4 border rounded-lg">
              <h4 className="font-semibold">Pricing Breakdown</h4>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Decoration:</span>
                  <span>₹{pricing.decorationPrice.toLocaleString()}</span>
                </div>

                {formData.selectedPlan === 'elite' && (
                  <div className="p-3 bg-gold/10 border border-gold rounded">
                    <p className="font-medium text-sm mb-1">Elite Plan Includes:</p>
                    <ul className="text-xs space-y-1">
                      {pricing.eliteIncludedItems.map((item, index) => (
                        <li key={index}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {formData.selectedPlan !== 'elite' && formData.selectedAddOns.length > 0 && (
                  <div className="space-y-1">
                    <span className="font-medium">Add-ons:</span>
                    {formData.selectedAddOns.map((addon, index) => (
                      <div key={index} className="flex justify-between ml-4">
                        <span>{addon.name} x{addon.quantity}:</span>
                        <span>₹{(addon.price * addon.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {formData.selectedPlan === 'premium' && pricing.premiumPrice > 0 && (
                  <div className="space-y-1">
                    <span className="font-medium">Premium Features:</span>
                    {formData.needComplimentaryItems && (
                      <div className="flex justify-between ml-4">
                        <span>Crown, Popper, Sash:</span>
                        <span>₹300</span>
                      </div>
                    )}
                  </div>
                )}

                {pricing.enhancedFeaturesPrice > 0 && (
                  <div className="space-y-1">
                    <span className="font-medium">Enhanced Features:</span>
                    {formData.needHangingPhotos && (
                      <div className="flex justify-between ml-4">
                        <span>Hanging Photos ({formData.hangingPhotos.length}):</span>
                        <span>₹{(formData.hangingPhotos.length * 80).toLocaleString()}</span>
                      </div>
                    )}
                    {formData.needLedLight && formData.selectedPlan !== 'elite' && (
                      <div className="flex justify-between ml-4">
                        <span>LED Light:</span>
                        <span>₹80</span>
                      </div>
                    )}
                    {formData.needAgeLight && formData.selectedPlan !== 'elite' && (
                      <div className="flex justify-between ml-4">
                        <span>Age Light:</span>
                        <span>₹80</span>
                      </div>
                    )}
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-base">
                  <span>Total Amount:</span>
                  <span>₹{pricing.totalAmount.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-green-600 font-medium">
                  <span>Advance Paid:</span>
                  <span>₹{pricing.advancePaid.toLocaleString()}</span>
                </div>

                <div className="flex justify-between font-semibold text-lg text-primary">
                  <span>Balance Due:</span>
                  <span>₹{pricing.balanceAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleBack} variant="outline" size="lg" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                size="lg"
                className="flex-1 bg-orange hover:bg-orange-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm Booking & Pay ₹500"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
