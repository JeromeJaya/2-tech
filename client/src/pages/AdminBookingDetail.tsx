import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Users, Phone, Mail, MapPin, Palette, Gift, CreditCard, QrCode, X, Image, Lightbulb, Coffee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import { WhatsAppPhotoShare } from "@/components/booking/WhatsAppPhotoShare";
import { 
  safeParseJSON, 
  extractAddons, 
  extractPhotoUrls, 
  validateBookingData, 
  formatCurrency,
  calculateAddonsTotal,
  safeGet
} from "@/utils/bookingDataUtils";

// Image Modal Component
const DecorationImageWithModal = ({ decorationId, decorationName, decorationPrice }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);

  const getImagePath = (decorationId) => {
    if (!decorationId) return '/placeholder.svg';
    const match = decorationId.match(/dec_(\d+)_/);
    if (match && match[1]) {
      return `/${match[1]}.jpg`;
    }
    const numbers = decorationId.match(/\d+/);
    if (numbers && numbers[0]) {
      return `/${numbers[0]}.jpg`;
    }
    return '/placeholder.svg';
  };

  const handleTouchStart = () => {
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

  return (
    <>
      <div className="relative w-full h-32 bg-muted rounded-lg overflow-hidden group">
        <img
          src={getImagePath(decorationId)}
          alt={decorationName}
          className="w-full h-full object-cover cursor-pointer"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseUp={handleTouchEnd}
          onMouseLeave={handleTouchEnd}
          onClick={() => setIsImageModalOpen(true)}
          onError={(e) => {
            const currentSrc = e.currentTarget.src;
            if (currentSrc.includes('.jpg')) {
              const match = decorationId.match(/dec_(\d+)_/);
              if (match && match[1]) {
                e.currentTarget.src = `/${match[1]}.png`;
              } else {
                e.currentTarget.src = '/placeholder.svg';
              }
            } else {
              e.currentTarget.src = '/placeholder.svg';
            }
          }}
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Hold to view
        </div>
      </div>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-screen-lg w-full h-full max-h-screen p-0 bg-black/95">
          <DialogHeader className="absolute top-4 left-4 right-4 z-10">
            <div className="flex justify-between items-center">
              <DialogTitle className="text-white text-lg">
                {decorationName}
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
              src={getImagePath(decorationId)}
              alt={decorationName}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
          
          <div className="absolute bottom-4 left-4 right-4 text-center">
            <div className="bg-black/50 text-white px-4 py-2 rounded-lg inline-block">
              <p className="font-semibold">{decorationName}</p>
              <p className="text-sm">Price: {formatCurrency(decorationPrice)}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const AdminBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrCodeError, setQrCodeError] = useState("");

  useEffect(() => {
    if (id) {
      fetchBookingDetail(id);
    }
  }, [id, navigate]);

  const generateQRCode = async (qrData) => {
    try {
      if (qrData.length > 2000) {
        const simplifiedData = `Booking ID: ${booking?.booking_id || id}`;
        const qrUrl = await QRCode.toDataURL(simplifiedData);
        setQrCodeUrl(qrUrl);
        setQrCodeError("QR code contains simplified data due to size limits");
      } else {
        const qrUrl = await QRCode.toDataURL(qrData);
        setQrCodeUrl(qrUrl);
        setQrCodeError("");
      }
    } catch (error) {
      console.error('QR Code generation error:', error);
      setQrCodeError("Failed to generate QR code");
      try {
        const fallbackData = `Booking: ${booking?.booking_id || id}`;
        const fallbackQrUrl = await QRCode.toDataURL(fallbackData);
        setQrCodeUrl(fallbackQrUrl);
        setQrCodeError("QR code shows booking ID only");
      } catch (fallbackError) {
        console.error('Fallback QR Code generation failed:', fallbackError);
        setQrCodeUrl("");
        setQrCodeError("Cannot generate QR code");
      }
    }
  };

  const fetchBookingDetail = async (bookingId) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        // Process add-ons using enhanced utilities
        const selectedAddonsData = safeParseJSON(data.selected_addons, []);
        const processedAddons = extractAddons(selectedAddonsData);
        
        // Process balloon colors - fetch color details from IDs
        let processedBalloonColors = [];
        const balloonColorIds = safeParseJSON<string[]>(data.balloon_colors, []);
        
        if (balloonColorIds.length > 0) {
          try {
            const { data: colorData, error: colorError } = await supabase
              .from('balloon_colors')
              .select('id, name, hex_code')
              .in('id', balloonColorIds);
            
            if (!colorError && colorData) {
              processedBalloonColors = colorData;
            }
          } catch (colorFetchError) {
            console.error('Error fetching balloon colors:', colorFetchError);
            // Fallback: use IDs as names
            processedBalloonColors = balloonColorIds.map((id, index) => ({
              id,
              name: `Color ${index + 1}`,
              hex_code: '#000000'
            }));
          }
        }
        
        // Process photos using enhanced utilities
        const hangingPhotosUrls = extractPhotoUrls(
          (data as any).hanging_photos_urls,
          data.uploaded_image_urls
        );
        
        const processedData = {
          ...data,
          balloon_colors: processedBalloonColors,
          selected_addons: processedAddons,
          hanging_photos_urls: hangingPhotosUrls,
          // Handle age light - try both column names
          age_light_number: safeGet(data, 'age_light_number') || safeGet(data, 'age_light_age'),
        };
        
        // Validate the processed data
        const validation = validateBookingData(processedData);
        if (validation.warnings.length > 0) {
          console.warn('Booking data validation warnings:', validation.warnings);
        }
        
        setBooking(processedData);

        if (processedData?.qr_code_data) {
          setTimeout(() => {
            generateQRCode(processedData.qr_code_data);
          }, 100);
        }
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      toast({
        title: "Error",
        description: "Failed to fetch booking details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (newStatus: string, newPaymentStatus?: string) => {
    if (!booking) return;

    setUpdating(true);
    try {
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newPaymentStatus) {
        updates.payment_status = newPaymentStatus;
      }

      if (newStatus === "confirmed") {
        updates.is_verified = true;
        updates.verified_at = new Date().toISOString();
        updates.verified_by = "admin";
      }

      const { error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", booking.id);

      if (error) throw error;

      setBooking({ ...booking, ...updates });
      toast({
        title: "Success",
        description: "Booking updated successfully",
      });
    } catch (error) {
      console.error('Error updating booking:', error);
      toast({
        title: "Error",
        description: "Failed to update booking",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading booking details...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Booking not found</h2>
          <Button onClick={() => navigate("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => navigate("/admin/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Booking Details</h1>
            <p className="text-muted-foreground">ID: {booking.booking_id}</p>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-lg">{booking.applicant_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact
                </Label>
                <p>{booking.contact}</p>
              </div>
              {booking.email && (
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <p>{booking.email}</p>
                </div>
              )}
              {booking.address && (
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </Label>
                  <p>{booking.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Event Type</Label>
                <p className="text-lg">{booking.event_type}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Event Date</Label>
                <p>{new Date(booking.event_date).toLocaleDateString()}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Time Slot</Label>
                <p>{booking.time_slot}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Guests</Label>
                <p>{booking.guests} people</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Plan Type</Label>
                <Badge>{booking.plan_type}</Badge>
              </div>
              {booking.decoration_name && (
                <div>
                  <Label className="text-sm font-medium">Decoration</Label>
                  <p>{booking.decoration_name}</p>
                </div>
              )}
              {booking.birthday_name && (
                <div>
                  <Label className="text-sm font-medium">Birthday Person</Label>
                  <p>{booking.birthday_name}</p>
                </div>
              )}
              {booking.bride_name && (
                <div>
                  <Label className="text-sm font-medium">Bride Name</Label>
                  <p>{booking.bride_name}</p>
                </div>
              )}
              {booking.groom_name && (
                <div>
                  <Label className="text-sm font-medium">Groom Name</Label>
                  <p>{booking.groom_name}</p>
                </div>
              )}
              {booking.couple_name1 && (
                <div>
                  <Label className="text-sm font-medium">Couple Names</Label>
                  <p>{booking.couple_name1} & {booking.couple_name2}</p>
                </div>
              )}
              {booking.selected_drink && (
                <div>
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Coffee className="w-4 h-4" />
                    Welcome Drink
                  </Label>
                  <p>{booking.selected_drink === 'rosemilk' ? 'Rose Milk' : booking.selected_drink === 'mojito' ? 'Virgin Mojito' : booking.selected_drink}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Total Amount</Label>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(booking.total_amount)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Base Price</Label>
                  <p>{formatCurrency(booking.base_price)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Decoration</Label>
                  <p>{formatCurrency(booking.decoration_price)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Add-ons Price</Label>
                <p>{formatCurrency(booking.addons_price)}</p>
              </div>
              {booking.enhanced_features_price > 0 && (
                <div>
                  <Label className="text-sm font-medium">Enhanced Features</Label>
                  <p>{formatCurrency(booking.enhanced_features_price)}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Advance Paid</Label>
                  <p className="text-blue-600">{formatCurrency(booking.advance_paid)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Balance Due</Label>
                  <p className="text-orange-600">{formatCurrency(booking.balance_amount)}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Payment Status</Label>
                <div className="mt-1">
                  <Badge variant={booking.payment_status === 'completed' ? 'default' : 'outline'}>
                    {booking.payment_status || 'pending'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Features */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Hanging Photos */}
            {booking.hanging_photos_urls && booking.hanging_photos_urls.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Image className="w-5 h-5" />
                    Hanging Photos ({booking.hanging_photos_urls.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total: {booking.hanging_photos_urls.length} photos</span>
                      <WhatsAppPhotoShare 
                        photos={booking.hanging_photos_urls}
                        bookingId={booking.booking_id}
                        customerName={booking.applicant_name}
                        eventDate={booking.event_date}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {booking.hanging_photos_urls.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Hanging photo ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border shadow-sm"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              Photo {index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">Hanging Photos Cost</p>
                      <p className="text-xs text-green-700 mt-1">
                        {booking.hanging_photos_urls.length} photos × ₹80 = ₹{(booking.hanging_photos_urls.length * 80).toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        💡 This amount is collected separately via WhatsApp
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

          {/* LED & Age Lights */}
          {(booking.led_light_name || booking.age_light_number || booking.age_light_age) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  LED & Age Lights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {booking.led_light_name && (
                  <div>
                    <Label className="text-sm font-medium">LED Light Name</Label>
                    <p className="text-lg font-mono bg-muted px-3 py-2 rounded">{booking.led_light_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Cost: {booking.plan_type === 'elite' ? 'Included' : '₹80'}
                    </p>
                  </div>
                )}
                {(booking.age_light_number || booking.age_light_age) && (
                  <div>
                    <Label className="text-sm font-medium">Age Light Number</Label>
                    <p className="text-lg font-mono bg-muted px-3 py-2 rounded">
                      {booking.age_light_number || booking.age_light_age}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Cost: {booking.plan_type === 'elite' ? 'Included' : '₹80'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Welcome Drink Selection */}
          {booking.selected_drink && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Welcome Drink Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Selected Drink</Label>
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-lg font-medium text-green-800">
                      {booking.selected_drink === 'rosemilk' ? 'Rose Milk' : 
                       booking.selected_drink === 'mojito' ? 'Virgin Mojito' : 
                       booking.selected_drink.charAt(0).toUpperCase() + booking.selected_drink.slice(1)}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {(booking.plan_type === 'premium' || booking.plan_type === 'elite') ? 
                        '✓ Complimentary with plan' : 'Additional service'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Available for Premium and Elite plans only
                </div>
              </CardContent>
            </Card>
          )}
          </div>
        </div>

        {/* Customizations and Visual Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Selected Decoration Image */}
          {booking.decoration_name && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Selected Decoration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-lg font-medium">{booking.decoration_name}</p>
                  {booking.decoration_id && (
                    <DecorationImageWithModal
                      decorationId={booking.decoration_id}
                      decorationName={booking.decoration_name}
                      decorationPrice={booking.decoration_price}
                    />
                  )}
                  <p className="text-sm text-muted-foreground">
                    Price: {formatCurrency(booking.decoration_price)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Balloon Colors */}
          {booking.balloon_colors && booking.balloon_colors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Balloon Colors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {booking.balloon_colors.map((color, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          style={{ backgroundColor: color.hex_code || color.color || '#000000' }}
                        />
                        <span className="text-sm font-medium">{color.name || `Color ${index + 1}`}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border">
                    <p className="text-xs text-muted-foreground mb-2">Color Preview:</p>
                    <div className="flex gap-1">
                      {booking.balloon_colors.map((color, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                          style={{ backgroundColor: color.hex_code || color.color || '#000000' }}
                          title={color.name || `Color ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add-ons */}
        {booking.selected_addons && booking.selected_addons.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Selected Add-ons ({booking.selected_addons.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {booking.selected_addons.map((addon, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-muted/50">
                    <div className="flex-1">
                      <p className="font-medium">{addon.name}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Qty: {addon.quantity || 1}</span>
                        {addon.customText && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            "{addon.customText}"
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="font-medium text-primary">
                      ₹{((addon.price || 0) * (addon.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Management */}
        <Card>
          <CardHeader>
            <CardTitle>Status Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Current Status</Label>
                <div className="mt-1">
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'outline'}>
                    {booking.status || 'pending'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Verified</Label>
                <div className="mt-1">
                  <Badge variant={booking.is_verified ? 'default' : 'destructive'}>
                    {booking.is_verified ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Created</Label>
                <p className="text-sm text-muted-foreground">
                  {booking.created_at ? new Date(booking.created_at).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => updateBookingStatus("confirmed", undefined)}
                disabled={updating || booking.status === "confirmed"}
                variant={booking.status === "confirmed" ? "default" : "outline"}
              >
                {updating ? "Updating..." : "Confirm Booking"}
              </Button>
              <Button
                onClick={() => updateBookingStatus("completed", "completed")}
                disabled={updating || booking.status === "completed"}
                variant={booking.status === "completed" ? "default" : "outline"}
              >
                {updating ? "Updating..." : "Mark Completed"}
              </Button>
              <Button
                onClick={() => updateBookingStatus("cancelled", undefined)}
                disabled={updating || booking.status === "cancelled"}
                variant={booking.status === "cancelled" ? "destructive" : "outline"}
              >
                {updating ? "Updating..." : "Cancel Booking"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        {(qrCodeUrl || qrCodeError || booking.qr_code_data) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                QR Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-3">
                {qrCodeUrl && (
                  <img src={qrCodeUrl} alt="Booking QR Code" className="w-48 h-48" />
                )}
                {qrCodeError && (
                  <div className="text-center">
                    <p className="text-sm text-yellow-600 mb-2">{qrCodeError}</p>
                    {!qrCodeUrl && (
                      <p className="text-xs text-muted-foreground">
                        QR data exists but cannot be displayed due to size limitations
                      </p>
                    )}
                  </div>
                )}
                {!qrCodeUrl && !qrCodeError && booking.qr_code_data && (
                  <p className="text-sm text-muted-foreground">Generating QR code...</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminBookingDetail;
