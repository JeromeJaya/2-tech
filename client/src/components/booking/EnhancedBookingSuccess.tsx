"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle, Download, Share2, Calendar, MapPin, Phone, Mail, CreditCard, QrCode, X, Image, Lightbulb } from "lucide-react"
import { format } from "date-fns"

interface BookingSuccessProps {
  bookingData: any
  onNewBooking: () => void
}

// Helper function to extract image filename from decoration ID
const getImagePath = (decorationId: string): string => {
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

// Image Modal Component for Success Page
const DecorationImageModal = ({ decorationId, decorationName, decorationPrice, showImage }) => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);

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

  if (!showImage) return null;

  return (
    <>
      <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden group">
        <img
          src={getImagePath(decorationId)}
          alt={decorationName || "Decoration"}
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
        <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          Hold
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
              <p className="text-sm">Price: ₹{decorationPrice?.toLocaleString()}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const EnhancedBookingSuccess = ({ bookingData, onNewBooking }: BookingSuccessProps) => {
  // Safe parsing function that handles both arrays and JSON strings
  const parseArraySafely = (field: any): any[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  // Helper function to safely parse color objects
  const parseColorsSafely = (colors: any): any[] => {
    const parsed = parseArraySafely(colors);
    return parsed.map((color: any) => {
      if (typeof color === 'string') {
        return { name: color, hex_code: color, color: color };
      }
      return {
        name: color.name || `Color`,
        hex_code: color.hex_code || color.color || '#000000',
        color: color.color || color.hex_code || '#000000'
      };
    });
  };

  // Parse the potentially problematic fields with better error handling
  const selectedAddons = parseArraySafely(bookingData?.selected_addons);
  const balloonColors = parseColorsSafely(bookingData?.balloon_colors);
  const hangingPhotos = parseArraySafely(bookingData?.hanging_photos_urls);

  const downloadBookingDetails = () => {
    const details = `
C3 CAFÉ PARTY HALL BOOKING CONFIRMATION

Booking ID: ${bookingData?.booking_id || 'N/A'}
Date: ${bookingData?.created_at ? format(new Date(bookingData.created_at), "PPP") : format(new Date(), "PPP")}

CUSTOMER DETAILS:
Name: ${bookingData?.applicant_name || 'N/A'}
Contact: ${bookingData?.contact || 'N/A'}
Email: ${bookingData?.email || "N/A"}
Address: ${bookingData?.address || "N/A"}

EVENT DETAILS:
Type: ${bookingData?.event_type || 'N/A'}
Date: ${bookingData?.event_date ? format(new Date(bookingData.event_date), "PPP") : "N/A"}
Time: ${bookingData?.time_slot || 'N/A'}
Guests: ${bookingData?.guests || 'N/A'}
Plan: ${bookingData?.plan_type?.toUpperCase() || "N/A"}

DECORATION:
${bookingData?.decoration_name || "Standard Decoration"}
Price: ₹${bookingData?.decoration_price?.toLocaleString() || "0"}

ENHANCED FEATURES:
${hangingPhotos.length > 0 ? `Hanging Photos: ${hangingPhotos.length} photos - ₹${hangingPhotos.length * 80}` : "No hanging photos"}
${bookingData?.led_light_name ? `LED Light: "${bookingData.led_light_name}" - ${bookingData?.plan_type === 'elite' ? 'Included' : '₹80'}` : "No LED light"}
${bookingData?.age_light_number ? `Age Light: "${bookingData.age_light_number}" - ${bookingData?.plan_type === 'elite' ? 'Included' : '₹80'}` : "No age light"}

ADD-ONS:
${
  selectedAddons.length > 0
    ? selectedAddons.map((addon: any) => `${addon.name || "Unknown"} x${addon.quantity || 1} - ₹${((addon.price || 0) * (addon.quantity || 1)).toLocaleString()}`).join("\n")
    : "None"
}

BALLOON COLORS:
${balloonColors.length > 0 ? `${balloonColors.length} colors selected` : "None"}

PRICING:
Total Amount: ₹${bookingData?.total_amount?.toLocaleString() || "0"}
Advance Paid: ₹${bookingData?.advance_paid?.toLocaleString() || "500"}
Balance Due: ₹${bookingData?.balance_amount?.toLocaleString() || "0"}

STATUS: ${bookingData?.status?.toUpperCase() || "PENDING"}

Thank you for choosing C3 Café Party Hall!
Contact us: c3cafe@gmail.com
WhatsApp: 8825474043
    `.trim()

    const blob = new Blob([details], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `C3-Booking-${bookingData?.booking_id || 'unknown'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareBooking = async () => {
    const shareData = {
      title: "C3 Café Party Hall Booking Confirmed",
      text: `Booking confirmed! ID: ${bookingData?.booking_id || 'N/A'}\nEvent: ${bookingData?.event_type || 'N/A'}\nDate: ${bookingData?.event_date ? format(new Date(bookingData.event_date), "PPP") : "N/A"}\nTime: ${bookingData?.time_slot || 'N/A'}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(shareData.text)
        alert("Booking details copied to clipboard!")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  // Handle missing booking data
  if (!bookingData) {
    return (
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
          <Calendar className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-600">Booking Information Unavailable</h1>
        <p className="text-lg text-muted-foreground">
          Unable to load booking details. Please contact support.
        </p>
        <Button onClick={onNewBooking} className="bg-orange hover:bg-orange-dark">
          <Calendar className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-green-600">Booking Confirmed!</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your celebration is all set! We've received your advance payment and your booking is confirmed.
        </p>
      </div>

      {/* Booking Details Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Booking Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange" />
              Booking Information
            </CardTitle>
            <CardDescription>Your event details and booking reference</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Booking ID:</span>
                <Badge variant="secondary" className="bg-orange/10 text-orange font-mono">
                  {bookingData.booking_id || 'N/A'}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span>Plan Type:</span>
                <Badge className="capitalize bg-primary">{bookingData.plan_type || 'Standard'}</Badge>
              </div>

              <div className="flex justify-between">
                <span>Event Type:</span>
                <span className="font-semibold capitalize">{bookingData.event_type || 'N/A'}</span>
              </div>

              <div className="flex justify-between">
                <span>Event Date:</span>
                <span className="font-semibold">
                  {bookingData.event_date ? format(new Date(bookingData.event_date), "PPP") : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Time Slot:</span>
                <span className="font-semibold">{bookingData.time_slot || 'N/A'}</span>
              </div>

              <div className="flex justify-between">
                <span>Number of Guests:</span>
                <span className="font-semibold">{bookingData.guests || 'N/A'}</span>
              </div>

              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {bookingData.status?.toUpperCase() || "CONFIRMED"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Features */}
        {(hangingPhotos.length > 0 || bookingData.led_light_name || bookingData.age_light_number) && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-orange" />
                Enhanced Features
              </CardTitle>
              <CardDescription>Your selected enhanced features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hangingPhotos.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Hanging Photos ({hangingPhotos.length})
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {hangingPhotos.slice(0, 6).map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Hanging photo ${index + 1}`}
                        className="w-full h-16 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    ))}
                    {hangingPhotos.length > 6 && (
                      <div className="w-full h-16 bg-muted rounded border flex items-center justify-center text-xs">
                        +{hangingPhotos.length - 6} more
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cost: ₹{(hangingPhotos.length * 80).toLocaleString()}
                  </p>
                </div>
              )}

              {bookingData.led_light_name && (
                <div>
                  <h4 className="font-medium mb-2">LED Light Display</h4>
                  <p className="font-mono bg-muted px-3 py-2 rounded text-center">
                    {bookingData.led_light_name}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cost: {bookingData.plan_type === 'elite' ? 'Included' : '₹80'}
                  </p>
                </div>
              )}

              {bookingData.age_light_number && (
                <div>
                  <h4 className="font-medium mb-2">Age Light Display</h4>
                  <p className="font-mono bg-muted px-3 py-2 rounded text-center text-2xl">
                    {bookingData.age_light_number}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Cost: {bookingData.plan_type === 'elite' ? 'Included' : '₹80'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Contact & Payment */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange" />
              Payment & Contact
            </CardTitle>
            <CardDescription>Payment details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {bookingData.contact && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{bookingData.contact}</span>
                </div>
              )}

              {bookingData.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{bookingData.email}</span>
                </div>
              )}

              {bookingData.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span className="text-sm">{bookingData.address}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium">Payment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-semibold">₹{(bookingData.total_amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Advance Paid:</span>
                  <span className="font-semibold">₹{(bookingData.advance_paid || 500).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-orange font-bold">
                  <span>Balance Due:</span>
                  <span>₹{(bookingData.balance_amount || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Decoration & Add-ons */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Decoration & Add-ons</CardTitle>
            <CardDescription>Your selected decoration and extras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Decoration</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm">{bookingData.decoration_name || "Standard Decoration"}</span>
                  <span className="font-semibold">₹{(bookingData.decoration_price || 0).toLocaleString()}</span>
                </div>
                {bookingData.decoration_id && (
                  <DecorationImageModal
                    decorationId={bookingData.decoration_id}
                    decorationName={bookingData.decoration_name}
                    decorationPrice={bookingData.decoration_price}
                    showImage={true}
                  />
                )}
              </div>
            </div>

            {selectedAddons.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Add-ons</h4>
                <div className="space-y-2">
                  {selectedAddons.map((addon: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span>
                        {addon.name || "Unknown Add-on"} x{addon.quantity || 1}
                        {addon.customText && <span className="text-muted-foreground"> ({addon.customText})</span>}
                      </span>
                      <span className="font-medium">₹{((addon.price || 0) * (addon.quantity || 1)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {balloonColors.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Balloon Colors</h4>
                <div className="flex gap-2 flex-wrap">
                  {balloonColors.slice(0, 8).map((color: any, index: number) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      title={color.name || `Color ${index + 1}`}
                      style={{ backgroundColor: color.hex_code || color.color || '#000000' }}
                    />
                  ))}
                  {balloonColors.length > 8 && (
                    <span className="text-xs text-muted-foreground self-center">
                      +{balloonColors.length - 8} more
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground mt-2 block">
                  {balloonColors.length} color{balloonColors.length !== 1 ? 's' : ''} selected
                </span>
              </div>
            )}

            {/* Show Elite Plan Inclusions */}
            {bookingData.plan_type === 'elite' && (
              <div>
                <h4 className="font-medium mb-2">Elite Plan Inclusions</h4>
                <div className="text-sm text-green-600 space-y-1">
                  <div>• Complimentary 1 kg themed cake</div>
                  <div>• Name light & age light included</div>
                  <div>• 6 cupcakes</div>
                  <div>• Welcome drinks (Mojito & Rose Milk)</div>
                  <div>• All basic add-ons included</div>
                  <div>• Special menu (pre-order based)</div>
                </div>
              </div>
            )}

            {/* Show Premium Plan Inclusions */}
            {bookingData.plan_type === 'premium' && (
              <div>
                <h4 className="font-medium mb-2">Premium Plan Inclusions</h4>
                <div className="text-sm text-green-600 space-y-1">
                  <div>• Welcome drinks (Rose Milk & Mojito)</div>
                  <div>• Complimentary ½ kg cake</div>
                  <div>• Maximum of 30 guests allowed</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-orange" />
              QR Code
            </CardTitle>
            <CardDescription>Scan this code for quick access to your booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {bookingData.booking_id ? (
              <div className="text-center">
                {bookingData.qr_code_data && bookingData.qr_code_data.startsWith('data:image') ? (
                  <img
                    src={bookingData.qr_code_data}
                    alt="Booking QR Code"
                    className="w-48 h-48 mx-auto border rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingData.booking_id)}`;
                    }}
                  />
                ) : (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingData.booking_id)}`}
                    alt="Booking QR Code"
                    className="w-48 h-48 mx-auto border rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `
                          <div class="w-48 h-48 mx-auto border rounded-lg bg-gray-100 flex items-center justify-center">
                            <div class="text-center">
                              <div class="text-gray-400 mb-2">QR Code</div>
                              <div class="text-sm font-mono">${bookingData.booking_id}</div>
                            </div>
                          </div>
                        `;
                      }
                    }}
                  />
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Show this QR code at the venue for quick verification
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">QR code generation in progress...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
        <Button onClick={downloadBookingDetails} variant="outline" className="flex-1 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Download Details
        </Button>
        <Button onClick={shareBooking} variant="outline" className="flex-1 bg-transparent">
          <Share2 className="h-4 w-4 mr-2" />
          Share Booking
        </Button>
        <Button onClick={onNewBooking} className="flex-1 bg-orange hover:bg-orange-dark">
          <Calendar className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Important Information */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Payment Terms:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Advance payment of ₹{(bookingData.advance_paid || 500).toLocaleString()} has been received</li>
                <li>• Balance amount due on the event day</li>
                <li>• Payment can be made via cash or digital methods</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Venue Guidelines:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Please arrive 15 minutes before your slot</li>
                <li>• Bring this booking confirmation</li>
                <li>• Contact us for any special requirements</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Enhanced Features:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Hanging Photos: {hangingPhotos.length > 0 ? `${hangingPhotos.length} photos selected` : 'None selected'}</li>
                <li>• LED Light: {bookingData.led_light_name ? `"${bookingData.led_light_name}"` : 'Not selected'}</li>
                <li>• Age Light: {bookingData.age_light_number ? `"${bookingData.age_light_number}"` : 'Not selected'}</li>
                <li>• All features will be set up before your event</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Contact Information:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Email: c3cafe@gmail.com</li>
                <li>• WhatsApp: 8825474043</li>
                <li>• Available 9 AM - 8 PM daily</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}