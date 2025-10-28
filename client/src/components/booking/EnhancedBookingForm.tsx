import { useState } from "react";
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
import { Calendar, Users, Clock, CreditCard, CheckCircle, CalendarIcon, Palette, Mail, Lightbulb } from "lucide-react";
import { BalloonColorSelector } from "./BalloonColorSelector";
import { AddOnsSelector } from "./AddOnsSelector";
import { BookingPreview } from "./BookingPreview";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import QRCode from 'qrcode';

interface BookingFormProps {
  selectedPlan?: string;
  onBookingComplete: (bookingData: any) => void;
}

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

interface SlotAvailability {
  [key: string]: boolean;
}

const decorations = [
  { id: "dec_2300_1", name: "Pastel Blue, Pink & White Arch", price: 2300, src: "/image (1).jpg" },
  { id: "dec_3000", name: "Red & Black 50th Birthday Arch", price: 3000, src: "/image (2).jpg" },
  { id: "dec_2800_1", name: "White & Gold 25th Anniversary", price: 2800, src: "/image (3).jpg" },
  { id: "dec_2800_2", name: "Boho Neutral Tones Arch", price: 2800, src: "/image (4).jpg" },
  { id: "dec_2500_1", name: "Hot Pink & White Arch", price: 2500, src: "/image (5).jpg" },
  { id: "dec_2400", name: "Black & Gold 50th Birthday", price: 2400, src: "/image (6).jpg" },
  { id: "dec_2300_2", name: "Rose Gold & Marquee Lights", price: 2300, src: "/image (7).jpg" },
  { id: "dec_2600", name: "Red, Black & Silver Arch", price: 2600, src: "/image (8).jpg" },
  { id: "dec_2700", name: "Rainbow Pastel Arch", price: 2700, src: "/image (9).jpg" },
  { id: "dec_2500_2", name: "Elegant Drapes & Fairy Lights", price: 2500, src: "/image (10).jpg" },
  { id: "dec_2350", name: "White & Gold 18th Birthday", price: 2350, src: "/image (11).jpg" },
  { id: "dec_2200", name: "Pink & White Theme with Backdrop", price: 2200, src: "/image (12).jpg" }
];

export const EnhancedBookingForm = ({ selectedPlan = "basic", onBookingComplete }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slotAvailability, setSlotAvailability] = useState<SlotAvailability>({});
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    eventType: "",
    applicantName: "",
    contact: "",
    birthdayName: "",
    coupleName1: "",
    coupleName2: "",
    brideName: "",
    groomName: "",
    guests: "",
    gender: "",
    ageNumber: "",
    date: undefined as Date | undefined,
    timeSlot: "",
    selectedDecoration: "",
    balloonColors: [] as string[],
    selectedAddOns: [] as any[]
  });

  const handleNext = () => { if (step < 4) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };

  // Check slot availability when date changes
  const checkSlotsAvailability = async (selectedDate: Date) => {
    if (!selectedDate) return;
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    const availability: SlotAvailability = {};
    
    for (const slot of timeSlots) {
      try {
        const { data, error } = await supabase.rpc('check_slot_availability', {
          slot_date: dateStr,
          slot_time: slot
        });
        
        if (error) {
          console.error('Error checking slot availability:', error);
          availability[slot] = true; // Default to available on error
        } else {
          availability[slot] = data;
        }
      } catch (error) {
        console.error('Error checking slot availability:', error);
        availability[slot] = true;
      }
    }
    
    setSlotAvailability(availability);
  };

  const calculatePricing = () => {
    const selectedDecorationDetails = decorations.find(d => d.id === formData.selectedDecoration);
    const decorationPrice = selectedDecorationDetails?.price || 0;
    const addOnsPrice = formData.selectedAddOns.reduce((total, addon) => total + (addon.price * addon.quantity), 0);
    const totalAmount = decorationPrice + addOnsPrice;
    const advancePaid = 500;
    const balanceAmount = totalAmount - advancePaid;

    return {
      decorationPrice,
      addOnsPrice,
      totalAmount,
      advancePaid,
      balanceAmount: Math.max(balanceAmount, 0)
    };
  };

  const generateQRCode = async (bookingData: any) => {
    try {
      const qrData = {
        bookingId: bookingData.booking_id,
        customerName: bookingData.applicant_name,
        eventDate: bookingData.event_date,
        timeSlot: bookingData.time_slot,
        totalAmount: bookingData.total_amount,
        status: bookingData.status
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

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const pricing = calculatePricing();
      const selectedDecorationDetails = decorations.find(d => d.id === formData.selectedDecoration);
      const bookingId = `C3-${Date.now()}`;
      
      // Check slot availability before creating booking
      const isSlotAvailable = await supabase.rpc('check_slot_availability', {
        slot_date: formData.date?.toISOString().split('T')[0],
        slot_time: formData.timeSlot
      });

      if (isSlotAvailable.error || !isSlotAvailable.data) {
        toast({
          title: "Slot Unavailable",
          description: "This time slot is no longer available. Please select another slot.",
          variant: "destructive"
        });
        return;
      }

      const bookingData = {
        booking_id: bookingId,
        applicant_name: formData.applicantName,
        contact: formData.contact,
        event_type: formData.eventType,
        birthday_name: formData.birthdayName,
        couple_name1: formData.coupleName1,
        couple_name2: formData.coupleName2,
        bride_name: formData.brideName,
        groom_name: formData.groomName,
        gender: formData.gender,
        plan_type: selectedPlan,
        event_date: formData.date?.toISOString().split('T')[0], // Convert to string
        time_slot: formData.timeSlot,
        guests: parseInt(formData.guests),
        decoration_id: formData.selectedDecoration,
        decoration_name: selectedDecorationDetails?.name,
        decoration_price: pricing.decorationPrice,
        selected_addons: formData.selectedAddOns,
        balloon_colors: formData.balloonColors,
        base_price: pricing.decorationPrice,
        addons_price: pricing.addOnsPrice,
        total_amount: pricing.totalAmount,
        advance_paid: pricing.advancePaid,
        balance_amount: pricing.balanceAmount,
        status: 'pending',
        payment_status: 'advance_paid'
      };

      // Generate QR code
      const qrCodeData = await generateQRCode(bookingData);

      // Save to database
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData) // Remove array wrapper
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: "Your booking has been successfully created with advance payment."
      });

      onBookingComplete({
        ...data,
        qr_code_data: qrCodeData, // Add QR code to response
        decorationDetails: selectedDecorationDetails,
        pricing
      });

    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error creating your booking. Please try again.",
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
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-orange text-white' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > num ? <CheckCircle className="h-4 w-4" /> : num}
                </div>
                {num < 4 && <div className={`w-8 md:w-12 h-0.5 ${step > num ? 'bg-orange' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {step === 1 && "Customer Information"}
          {step === 2 && "Event Details & Decoration"}
          {step === 3 && "Add-ons & Customization"}
          {step === 4 && "Payment & Confirmation"}
        </div>
      </div>

      {/* Step 1: Customer Information */}
      {step === 1 && (
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
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => setFormData({...formData, gender: value})}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button 
              onClick={handleNext} 
              size="lg" 
              className="w-full bg-orange hover:bg-orange-dark" 
              disabled={!formData.eventType || !formData.applicantName || !formData.contact}
            >
              Continue to Event Details
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Event Details & Decoration */}
      {step === 2 && (
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
                  {decorations.map((deco) => (
                    <div
                      key={deco.id}
                      className={`relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all group ${
                        formData.selectedDecoration === deco.id ? 'border-orange ring-2 ring-orange/70' : 'border-transparent hover:border-orange/50'
                      }`}
                      onClick={() => setFormData({ ...formData, selectedDecoration: deco.id })}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        // Long press zoom functionality could be implemented here
                      }}
                    >
                      <img 
                        src={deco.src} 
                        alt={`Decoration priced at ${deco.price}`} 
                        className="w-full h-auto aspect-square object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 text-center font-bold p-2 bg-black/50 text-white group-hover:bg-orange/80 transition-colors">
                        ₹{deco.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Tip: Long press on images to zoom in for better view
                </p>
              </div>

              <div>
                <Label htmlFor="date">Date of Event</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start text-left font-normal ${!formData.date && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                     <CalendarComponent 
                       mode="single" 
                       selected={formData.date} 
                       onSelect={(date) => {
                         setFormData({ ...formData, date, timeSlot: "" });
                         if (date) checkSlotsAvailability(date);
                       }}
                       disabled={(date) => date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 1))} 
                       initialFocus 
                     />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <Input 
                  id="guests" 
                  type="number" 
                  value={formData.guests} 
                  onChange={(e) => setFormData({...formData, guests: e.target.value})} 
                  placeholder="Expected number of guests" 
                  min="1" 
                  max="50" 
                />
              </div>
              
               <div>
                 <Label htmlFor="timeSlot">Preferred Time Slot</Label>
                 <div className="grid grid-cols-2 gap-3 mt-2">
                   {timeSlots.map((slot) => {
                     const isAvailable = slotAvailability[slot] !== false;
                     return (
                       <button
                         key={slot}
                         type="button"
                         disabled={!isAvailable}
                         className={`p-3 text-sm border rounded-lg transition-colors ${
                           !isAvailable 
                             ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                             : formData.timeSlot === slot 
                               ? 'bg-orange text-white border-orange' 
                               : 'hover:border-orange/50'
                         }`}
                         onClick={() => isAvailable && setFormData({ ...formData, timeSlot: slot })}
                       >
                         {slot}
                         {!isAvailable && (
                           <div className="text-xs mt-1 text-red-500">Not Available</div>
                         )}
                       </button>
                     );
                   })}
                 </div>
               </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 order-2 md:order-1">
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                size="lg" 
                className="flex-1 order-1 md:order-2 bg-orange hover:bg-orange-dark" 
                disabled={!formData.selectedDecoration || !formData.guests || !formData.timeSlot || !formData.date}
              >
                Continue to Customization
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Add-ons & Customization */}
      {step === 3 && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-orange" />
                  Add-ons & Customization
                </CardTitle>
                <CardDescription>Choose balloon colors and add-ons for your celebration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Age Number Input for Age Light */}
                {formData.eventType === 'birthday' && (
                  <div className="p-4 bg-orange/5 rounded-lg border border-orange/20">
                    <Label htmlFor="ageNumber" className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-orange" />
                      Age Number (for Age Light)
                    </Label>
                    <Input
                      id="ageNumber"
                      type="number"
                      value={formData.ageNumber}
                      onChange={(e) => setFormData({...formData, ageNumber: e.target.value})}
                      placeholder="Enter age number"
                      className="max-w-xs"
                    />
                  </div>
                )}
                
                <BalloonColorSelector 
                  selectedColors={formData.balloonColors} 
                  onColorsChange={(colors) => setFormData({...formData, balloonColors: colors})}
                  selectedPlan={selectedPlan}
                />
                
                <AddOnsSelector 
                  planType={selectedPlan}
                  selectedAddOns={formData.selectedAddOns}
                  onAddOnsChange={(addOns) => setFormData({...formData, selectedAddOns: addOns})}
                />
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button onClick={handleBack} variant="outline" size="lg" className="w-full sm:w-auto">
                    Back
                  </Button>
                  <Button onClick={handleNext} size="lg" className="w-full bg-orange hover:bg-orange-dark">
                    Continue to Payment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <BookingPreview 
              selectedAddOns={formData.selectedAddOns}
              balloonColors={formData.balloonColors}
              decoration={selectedDecorationDetails}
              ageNumber={formData.ageNumber}
            />
          </div>
        </div>
      )}

      {/* Step 4: Payment & Confirmation */}
      {step === 4 && (
        <Card className="max-w-3xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange" />
              Payment & Confirmation
            </CardTitle>
            <CardDescription>Review your booking and complete the advance payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Booking Summary */}
              <div className="space-y-4">
                <h4 className="font-medium">Booking Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-semibold capitalize">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Event:</span>
                    <span className="font-semibold">{formData.eventType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-semibold">
                      {formData.date ? format(formData.date, "PPP") : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-semibold">{formData.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Guests:</span>
                    <span className="font-semibold">{formData.guests}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Decoration:</span>
                    <span className="font-semibold text-right">
                      {selectedDecorationDetails?.name || 'N/A'}
                    </span>
                  </div>
                  {formData.balloonColors.length > 0 && (
                    <div className="flex justify-between">
                      <span>Balloon Colors:</span>
                      <span className="font-semibold">{formData.balloonColors.length} selected</span>
                    </div>
                  )}
                  {formData.selectedAddOns.length > 0 && (
                    <div className="space-y-1">
                      <span className="font-medium">Add-ons:</span>
                      {formData.selectedAddOns.map((addon, index) => (
                        <div key={index} className="flex justify-between text-xs ml-4">
                          <span>{addon.name} x{addon.quantity}</span>
                          <span>₹{(addon.price * addon.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-4 p-4 bg-orange/5 rounded-lg border border-orange/20">
                <h4 className="font-medium">Pricing Breakdown</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Decoration:</span>
                    <span>₹{pricing.decorationPrice.toLocaleString()}</span>
                  </div>
                  {pricing.addOnsPrice > 0 && (
                    <div className="flex justify-between">
                      <span>Add-ons:</span>
                      <span>₹{pricing.addOnsPrice.toLocaleString()}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span>₹{pricing.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-orange font-semibold">
                    <span>Advance Paid:</span>
                    <span>₹{pricing.advancePaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Balance Due:</span>
                    <span className="text-primary">₹{pricing.balanceAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 order-2 md:order-1">
                Back
              </Button>
              <Button 
                onClick={handleSubmit} 
                size="lg" 
                className="flex-1 order-1 md:order-2 bg-orange hover:bg-orange-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : `Pay ₹${pricing.advancePaid.toLocaleString()} & Confirm Booking`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};