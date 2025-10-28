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
import { Calendar, Users, Clock, CreditCard, CheckCircle, CalendarIcon, Palette } from "lucide-react";

// Define the props for the component
interface BookingFormProps {
  selectedPlan?: string;
  onBookingComplete: (bookingData: any) => void;
}

// Define the structure for event types and their specific fields
const eventTypes = [
  { value: "birthday", label: "Birthday", fields: ["birthdayName"] },
  { value: "anniversary", label: "Anniversary", fields: ["coupleName1", "coupleName2"] },
  { value: "bride-to-be", label: "Bride to Be", fields: ["brideName"] },
  { value: "groom-to-be", label: "Groom to Be", fields: ["groomName"] }
];

// Define available time slots for booking
const timeSlots = [
  "11:00 AM - 12:00 PM", "12:15 PM - 1:15 PM", "1:30 PM - 2:30 PM", "2:45 PM - 3:45 PM",
  "4:00 PM - 5:00 PM", "5:15 PM - 6:15 PM", "6:30 PM - 7:30 PM", "7:45 PM - 8:45 PM",
  "9:00 PM - 10:00 PM", "10:15 PM - 11:15 PM"
];

// Data for the decoration options, including image paths
// IMPORTANT: Replace these '/images/...' paths with the actual paths to your images.
const decorations = [
  { id: "dec_1600_1", name: "Cozy Black & Gold Setup", price: 1600, src: "/1600.jpg", planType: "basic" },
  { id: "dec_1900_1", name: "Classic Gold Glamour", price: 1900, src: "/1900.jpg", planType: "basic" },
  { id: "dec_2000_1", name: "Elegant Green Arch", price: 2000, src: "/2000 rs.jpg", planType: "basic" },
  { id: "dec_2000_2", name: "Modern Black & Pink Arch", price: 2000, src: "/2000 price.jpg", planType: "basic" },
  { id: "dec_2300_1", name: "White & Gold Circle Arch", price: 2300, src: "/2300.jpg", planType: "basic" },
  { id: "dec_2300_2", name: "Pastel Eyelash Arch", price: 2300, src: "/2300 rs.jpg", planType: "basic" },
  { id: "dec_2400_1", name: "White & Gold Circle Arch", price: 2400, src: "/2400 pri.jpg", planType: "basic" },
  { id: "dec_2400_2", name: "Black & Gold Milestone", price: 2400, src: "/2400 price 2.jpg", planType: "basic" },
  { id: "dec_2400_3", name: "Black & Gold Milestone", price: 2400, src: "/2400 rs (1).jpg", planType: "basic" },
  { id: "dec_2400_4", name: "Black & Gold Milestone", price: 2400, src: "/2400 rs 3.jpg", planType: "basic" },
  { id: "dec_2400_5", name: "Black & Gold Milestone", price: 2400, src: "/2400 rs 4.jpg", planType: "basic" },
  { id: "dec_2400_6", name: "Black & Gold Milestone", price: 2400, src: "/2400 rs.jpg", planType: "basic" },
  { id: "dec_2500_1", name: "Black & Gold Milestone", price: 2500, src: "/2500 rs h.jpg", planType: "basic" },
  { id: "dec_2500_2", name: "Black & Gold Milestone", price: 2500, src: "/2500 rs.jpg", planType: "basic" },
  { id: "dec_2500_3", name: "Black & Gold Milestone", price: 2500, src: "/2500.jpg", planType: "basic" },
  { id: "dec_2600_1", name: "Black & Gold Milestone", price: 2600, src: "/2600 rs.jpg", planType: "basic" },
  { id: "dec_2600_2", name: "Black & Gold Milestone", price: 2600, src: "/2600.jpg", planType: "basic" },
  { id: "dec_2700_1", name: "Black & Gold Milestone", price: 2700, src: "/2700 rs.jpg", planType: "basic" },
  { id: "dec_2400_2", name: "Black & Gold Milestone", price: 2700, src: "/2700.jpg", planType: "basic" },
  { id: "dec_2800_1", name: "Black & Gold Milestone", price: 2800, src: "/2800.jpg", planType: "basic" },
  { id: "dec_2900_1", name: "Black & Gold Milestone", price: 2900, src: "/2900.jpg", planType: "basic" },
  { id: "dec_3000_1", name: "Black & Gold Milestone", price: 3000, src: "/3000.jpg", planType: "basic" },
  { id: "dec_3500_1", name: "Black & Gold Milestone", price: 3500, src: "/3500.jpg", planType: "premium" },
  { id: "dec_3600_1", name: "Black & Gold Milestone", price: 3600, src: "/3600.jpg", planType: "premium" },
  { id: "dec_3700_1", name: "Black & Gold Milestone", price: 3700, src: "/3700.jpg", planType: "premium" },
  { id: "dec_3900_1", name: "Black & Gold Milestone", price: 3900, src: "/3900 rs (2).jpg", planType: "premium" },
  { id: "dec_3900_2", name: "Black & Gold Milestone", price: 3900, src: "/3900 rs.jpg", planType: "premium" },
  { id: "dec_3900_3", name: "Black & Gold Milestone", price: 3900, src: "/3900.jpg", planType: "premium" },
  { id: "dec_4000_1", name: "Black & Gold Milestone", price: 4000, src: "/4000 rs 2.jpg", planType: "premium" },
  { id: "dec_4000_2", name: "Black & Gold Milestone", price: 4000, src: "/4000 rs 3.jpg", planType: "premium" },
  { id: "dec_4000_3", name: "Black & Gold Milestone", price: 4000, src: "/4000 rs.jpg", planType: "premium" },
  { id: "dec_4000_4", name: "Black & Gold Milestone", price: 4000, src: "/4000.jpg", planType: "premium" },
  { id: "dec_4200_1", name: "Black & Gold Milestone", price: 4200, src: "/4200 rs 3.jpg", planType: "premium" },
  { id: "dec_4200_2", name: "Black & Gold Milestone", price: 4200, src: "/4200 rs.jpg", planType: "premium" },
  { id: "dec_4200_3", name: "Black & Gold Milestone", price: 4200, src: "/4200.jpg", planType: "premium" },
  { id: "dec_4500_1", name: "Black & Gold Milestone", price: 4500, src: "/4500.jpg", planType: "premium" },
  { id: "dec_4800_1", name: "Black & Gold Milestone", price: 4800, src: "/4800 (2).jpg", planType: "premium" },
  { id: "dec_4800_2", name: "Black & Gold Milestone", price: 4800, src: "/4800.jpg", planType: "premium" },
  { id: "dec_4900_1", name: "Black & Gold Milestone", price: 4900, src: "/4900 6.jpg", planType: "premium" },
  { id: "dec_4900_2", name: "Black & Gold Milestone", price: 4900, src: "/4900 7.jpg", planType: "premium" },
  { id: "dec_4900_3", name: "Black & Gold Milestone", price: 4900, src: "/4900 rs 2.jpg", planType: "premium" },
  { id: "dec_4900_4", name: "Black & Gold Milestone", price: 4900, src: "/4900 rs 3.jpg", planType: "premium" },
  { id: "dec_4900_5", name: "Black & Gold Milestone", price: 4900, src: "/4900 rs 4.jpg", planType: "premium" },
  { id: "dec_4900_6", name: "Black & Gold Milestone", price: 4900, src: "/4900 rs 5.jpg", planType: "premium" },
  { id: "dec_4900_7", name: "Black & Gold Milestone", price: 4900, src: "/4900 rs.jpg", planType: "premium" },
  { id: "dec_4900_8", name: "Black & Gold Milestone", price: 4900, src: "/4900.jpg", planType: "premium" },
  { id: "dec_5000_1", name: "Black & Gold Milestone", price: 5000, src: "/5000 rs.jpg", planType: "premium" },
  { id: "dec_5200_1", name: "Black & Gold Milestone", price: 5200, src: "/5200 rs.jpg", planType: "premium" },
  { id: "dec_5200_2", name: "Black & Gold Milestone", price: 5200, src: "/5200.jpg", planType: "premium" },
  { id: "dec_5300_1", name: "Black & Gold Milestone", price: 5300, src: "/5300 rs.jpg", planType: "premium" },
  { id: "dec_5300_2", name: "Black & Gold Milestone", price: 5300, src: "/5300.jpg", planType: "premium" }
];

export const BookingForm = ({ selectedPlan, onBookingComplete }: BookingFormProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<{
    eventType: string;
    applicantName: string;
    contact: string;
    address: string;
    birthdayName: string;
    coupleName1: string;
    coupleName2: string;
    brideName: string;
    groomName: string;
    guests: string;
    date?: Date;
    timeSlot: string;
    otpVerified: boolean;
    selectedDecoration: string; // Will store the ID of the decoration
  }>({
    eventType: "", applicantName: "", contact: "", address: "", birthdayName: "", coupleName1: "",
    coupleName2: "", brideName: "", groomName: "", guests: "", date: undefined, timeSlot: "",
    otpVerified: false, selectedDecoration: ""
  });

  const handleNext = () => { if (step < 3) setStep(step + 1); };
  const handleBack = () => { if (step > 1) setStep(step - 1); };

  const handleSubmit = () => {
    const finalDecoration = decorations.find(d => d.id === formData.selectedDecoration);
    onBookingComplete({
      ...formData,
      bookingId: `C3-${Date.now()}`,
      timestamp: new Date().toISOString(),
      decorationDetails: finalDecoration, // Send full decoration object
      amount: finalDecoration?.price || 0,
    });
  };

  const selectedEventType = eventTypes.find(type => type.value === formData.eventType);
  const selectedDecorationDetails = decorations.find(d => d.id === formData.selectedDecoration);

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header with Step Indicator */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
          Book Your Perfect Celebration
        </h1>
        <div className="flex justify-center">
          <div className="flex items-center space-x-2 md:space-x-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= num ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {step > num ? <CheckCircle className="h-4 w-4" /> : num}
                </div>
                {num < 3 && <div className={`w-8 md:w-12 h-0.5 ${step > num ? 'bg-primary' : 'bg-muted'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step 1: Customer Information */}
      {step === 1 && (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" />Customer Information</CardTitle>
            <CardDescription>Tell us about your celebration and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="eventType">Event Type</Label>
                <Select value={formData.eventType} onValueChange={(value) => setFormData({...formData, eventType: value})}>
                    <SelectTrigger><SelectValue placeholder="Select your event type" /></SelectTrigger>
                    <SelectContent>{eventTypes.map((type) => (<SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>))}</SelectContent>
                </Select>
              </div>

              {selectedEventType && (
                <div className="space-y-4 p-4 bg-accent/50 rounded-lg">
                    <h4 className="font-medium">Event Details</h4>
                    {selectedEventType.fields.includes("birthdayName") && (<div><Label htmlFor="birthdayName">Birthday Person's Name</Label><Input id="birthdayName" value={formData.birthdayName} onChange={(e) => setFormData({...formData, birthdayName: e.target.value})} placeholder="Enter name" /></div>)}
                    {selectedEventType.fields.includes("coupleName1") && (<><div><Label htmlFor="coupleName1">Partner 1 Name</Label><Input id="coupleName1" value={formData.coupleName1} onChange={(e) => setFormData({...formData, coupleName1: e.target.value})} placeholder="Enter first partner's name"/></div><div><Label htmlFor="coupleName2">Partner 2 Name</Label><Input id="coupleName2" value={formData.coupleName2} onChange={(e) => setFormData({...formData, coupleName2: e.target.value})} placeholder="Enter second partner's name"/></div></>)}
                    {selectedEventType.fields.includes("brideName") && (<div><Label htmlFor="brideName">Bride's Name</Label><Input id="brideName" value={formData.brideName} onChange={(e) => setFormData({...formData, brideName: e.target.value})} placeholder="Enter bride's name"/></div>)}
                    {selectedEventType.fields.includes("groomName") && (<div><Label htmlFor="groomName">Groom's Name</Label><Input id="groomName" value={formData.groomName} onChange={(e) => setFormData({...formData, groomName: e.target.value})} placeholder="Enter groom's name"/></div>)}
                </div>
              )}
              
              <div><Label htmlFor="applicantName">Applicant Name (Person Booking)</Label><Input id="applicantName" value={formData.applicantName} onChange={(e) => setFormData({...formData, applicantName: e.target.value})} placeholder="Your full name"/></div>
              <div><Label htmlFor="contact">Contact Number</Label><Input id="contact" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} placeholder="Your phone number"/></div>
              <div><Label htmlFor="address">Address</Label><Textarea id="address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} placeholder="Your complete address" rows={3}/></div>
              
              <div className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-medium">Verification</h4>
                <Button variant="outline" className="w-full" onClick={() => setFormData({...formData, otpVerified: true})} disabled={formData.otpVerified}>{formData.otpVerified ? "✓ Verified" : "Send OTP & Verify"}</Button>
              </div>
            </div>
            <Button onClick={handleNext} size="lg" className="w-full" disabled={!formData.eventType || !formData.applicantName || !formData.contact || !formData.otpVerified}>Continue to Booking Details</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Booking Details with Image & Price Grid */}
      {step === 2 && (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" />Booking Details</CardTitle>
            <CardDescription>Choose your decoration, date, and preferred time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {/* ===== UPDATED IMAGE & PRICE GRID ===== */}
              <div>
                <Label className="flex items-center gap-2 mb-2 font-semibold"><Palette/>Choose your Decoration</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2 bg-muted/50 rounded-lg">
                  {decorations.map((deco) => (
                    <div
                      key={deco.id}
                      className={`relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all group ${formData.selectedDecoration === deco.id ? 'border-primary ring-2 ring-primary/70' : 'border-transparent hover:border-primary/50'}`}
                      onClick={() => setFormData({ ...formData, selectedDecoration: deco.id })}
                    >
                      <img src={deco.src} alt={`Decoration priced at ${deco.price}`} className="w-full h-auto aspect-square object-cover"/>
                      <div className="absolute bottom-0 left-0 right-0 text-center font-bold p-2 bg-black/50 text-white group-hover:bg-primary/80 transition-colors">
                        ₹{deco.price.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="date">Date of Event</Label>
                <Popover>
                  <PopoverTrigger asChild><Button variant={"outline"} className={`w-full justify-start text-left font-normal ${!formData.date && "text-muted-foreground"}`}><CalendarIcon className="mr-2 h-4 w-4" />{formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}</Button></PopoverTrigger>
                  <PopoverContent className="w-auto p-0"><CalendarComponent mode="single" selected={formData.date} onSelect={(date) => setFormData({ ...formData, date })} disabled={(date) => date < new Date() || date > new Date(new Date().setFullYear(new Date().getFullYear() + 1))} initialFocus /></PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <Input id="guests" type="number" value={formData.guests} onChange={(e) => setFormData({...formData, guests: e.target.value})} placeholder="Expected number of guests" min="1" max="50" />
              </div>
              
              <div>
                <Label htmlFor="timeSlot">Preferred Time Slot</Label>
                <Select value={formData.timeSlot} onValueChange={(value) => setFormData({...formData, timeSlot: value})}>
                  <SelectTrigger><SelectValue placeholder="Select your preferred time" /></SelectTrigger>
                  <SelectContent>{timeSlots.map((slot) => (<SelectItem key={slot} value={slot}><div className="flex items-center gap-2"><Clock className="h-4 w-4" />{slot}</div></SelectItem>))}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 order-2 md:order-1">Back</Button>
              <Button onClick={handleNext} size="lg" className="flex-1 order-1 md:order-2" disabled={!formData.selectedDecoration || !formData.guests || !formData.timeSlot || !formData.date}>Continue to Payment</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment & Confirmation */}
      {step === 3 && (
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary" />Payment & Confirmation</CardTitle>
            <CardDescription>Review your booking and complete the advance payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4 p-4 bg-accent/50 rounded-lg">
              <h4 className="font-medium">Booking Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>Event: <span className="font-semibold">{formData.eventType}</span></div>
                <div>Date: <span className="font-semibold">{formData.date ? format(formData.date, "PPP") : 'N/A'}</span></div>
                <div>Guests: <span className="font-semibold">{formData.guests}</span></div>
                <div>Time: <span className="font-semibold">{formData.timeSlot}</span></div>
                <div className="sm:col-span-2">Decoration: <span className="font-semibold">{selectedDecorationDetails?.name || 'N/A'}</span></div>
              </div>
            </div>
            
            <div className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <span>Total Decoration Amount:</span>
                <span className="font-semibold text-lg">
                  ₹{selectedDecorationDetails ? selectedDecorationDetails.price.toLocaleString() : '0'}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Minimum Advance Payable:</span>
                <span className="text-primary">₹500</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <Button variant="outline" onClick={handleBack} className="flex-1 order-2 md:order-1">Back</Button>
              <Button onClick={handleSubmit} size="lg" className="flex-1 order-1 md:order-2">Pay ₹500 & Confirm Booking</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};