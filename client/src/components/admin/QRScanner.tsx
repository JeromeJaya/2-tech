"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QrCode, Search, Camera, Scan, CheckCircle, ImageIcon, Video, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { safeParseJSON, extractAddons, formatCurrency, validateBookingData } from "@/utils/bookingDataUtils"

// Helper function to safely handle date formatting
const safeFormatDate = (dateValue) => {
  if (!dateValue) return "Not specified"
  try {
    const date = new Date(dateValue)
    if (isNaN(date.getTime())) return "Invalid date"
    return date.toLocaleDateString()
  } catch (error) {
    console.warn("Date formatting error:", error)
    return "Invalid date"
  }
}

export const QRScanner = () => {
  const [qrCode, setQrCode] = useState("")
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [stream, setStream] = useState(null)
  const fileInputRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const scanIntervalRef = useRef(null)
  const { toast } = useToast()

  // Start camera for live QR scanning
  const startCamera = async () => {
    try {
      setIsScanning(true)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })

      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()

        // Start scanning for QR codes
        scanIntervalRef.current = setInterval(scanForQRCode, 500)
      }

      toast({
        title: "Camera Started",
        description: "Point your camera at a QR code to scan automatically",
      })
    } catch (error) {
      console.error("Camera access error:", error)
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      })
      setIsScanning(false)
    }
  }

  // Stop camera and scanning
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current)
      scanIntervalRef.current = null
    }
    setIsScanning(false)
  }

  // Scan for QR codes in video feed
  const scanForQRCode = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      try {
        // Use jsQR library to decode QR code
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
        const code = await import("jsqr").then((jsQR) =>
          jsQR.default(imageData.data, imageData.width, imageData.height),
        )

        if (code && code.data) {
          // QR code detected!
          stopCamera()

          // Extract booking ID from QR code data
          let bookingId = code.data

          // If QR code contains JSON or structured data, try to extract booking ID
          try {
            const qrData = JSON.parse(code.data)
            if (qrData.booking_id) {
              bookingId = qrData.booking_id
            } else if (qrData.id) {
              bookingId = qrData.id
            }
          } catch {
            // If not JSON, use the raw data as booking ID
            // Clean up common QR code prefixes
            bookingId = bookingId.replace(/^(booking[_-]?id[:\s]*|id[:\s]*)/i, "").trim()
          }

          setQrCode(bookingId.toUpperCase())

          toast({
            title: "QR Code Scanned!",
            description: `Found booking ID: ${bookingId}`,
          })

          // Automatically search for the booking
          setTimeout(() => searchBooking(bookingId), 500)
        }
      } catch (error) {
        // Silently continue scanning - errors are expected when no QR code is visible
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Open camera/gallery for QR code image
  const openCameraForQR = () => {
    fileInputRef.current?.click()
  }

  // Handle file selection (from camera or gallery)
  const handleFileSelect = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      // Create a preview of the selected image
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)

      // Try to automatically detect QR code from the uploaded image
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = async () => {
        const canvas = document.createElement("canvas")
        const context = canvas.getContext("2d")
        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0)

        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
          const jsQR = await import("jsqr")
          const code = jsQR.default(imageData.data, imageData.width, imageData.height)

          if (code && code.data) {
            let bookingId = code.data

            // Extract booking ID from QR code data
            try {
              const qrData = JSON.parse(code.data)
              if (qrData.booking_id) {
                bookingId = qrData.booking_id
              } else if (qrData.id) {
                bookingId = qrData.id
              }
            } catch {
              bookingId = bookingId.replace(/^(booking[_-]?id[:\s]*|id[:\s]*)/i, "").trim()
            }

            setQrCode(bookingId.toUpperCase())

            toast({
              title: "QR Code Detected!",
              description: `Automatically extracted booking ID: ${bookingId}`,
            })

            // Automatically search for the booking
            setTimeout(() => searchBooking(bookingId), 500)
          } else {
            toast({
              title: "QR Code Image Selected",
              description: "Could not automatically detect QR code. Please enter the booking ID manually.",
              duration: 4000,
            })
          }
        } catch (error) {
          console.error("QR detection error:", error)
          toast({
            title: "QR Code Image Selected",
            description: "Could not automatically detect QR code. Please enter the booking ID manually.",
            duration: 4000,
          })
        }
      }
      img.src = imageUrl
    } catch (error) {
      console.error("File processing error:", error)
      toast({
        title: "Error",
        description: "Could not process the image. Please try again.",
        variant: "destructive",
      })
    }

    // Reset file input
    event.target.value = ""
  }

  const clearImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage)
      setSelectedImage(null)
    }
  }

  const searchBooking = async (bookingId = qrCode) => {
    if (!bookingId || !bookingId.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter a QR code or booking ID",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setBooking(null)

    try {
      const searchId = bookingId.trim().toUpperCase()
      console.log("Searching for booking:", searchId)

      const { data, error } = await supabase.from("bookings").select("*").eq("booking_id", searchId).single()

      if (error) {
        console.error("Search error:", error)
        throw error
      }

      // Process booking data using enhanced utilities
      const selectedAddonsData = safeParseJSON(data.selected_addons, [])
      const processedAddons = extractAddons(selectedAddonsData)

      const processedBooking = {
        ...data,
        selected_addons: processedAddons,
      }

      // Validate the processed data
      const validation = validateBookingData(processedBooking)
      if (validation.warnings.length > 0) {
        console.warn("Booking data validation warnings:", validation.warnings)
      }

      setBooking(processedBooking)
      toast({
        title: "Booking Found!",
        description: `Found booking for ${data.applicant_name}`,
      })

      // Clear the image after successful search
      clearImage()
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Booking Not Found",
        description: "No booking found with this ID. Please verify the ID and try again.",
        variant: "destructive",
      })
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }

  const handleManualSearch = () => {
    searchBooking(qrCode)
  }

  const clearResults = () => {
    setBooking(null)
    setQrCode("")
    clearImage()
    stopCamera()
  }

  const handleInputChange = (e) => {
    setQrCode(e.target.value.toUpperCase())
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleManualSearch()
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Scanner
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="flex gap-3 justify-center flex-wrap">
            {!isScanning ? (
              <>
                <Button onClick={startCamera} className="flex items-center gap-2" size="lg">
                  <Video className="w-4 h-4" />
                  Start Live QR Scanner
                </Button>

                <Button
                  onClick={openCameraForQR}
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                  size="lg"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo of QR Code
                </Button>
              </>
            ) : (
              <Button onClick={stopCamera} variant="destructive" className="flex items-center gap-2" size="lg">
                <X className="w-4 h-4" />
                Stop Scanner
              </Button>
            )}

            {selectedImage && (
              <Button
                onClick={clearImage}
                variant="outline"
                className="flex items-center gap-2 bg-transparent"
                size="lg"
              >
                <ImageIcon className="w-4 h-4" />
                Clear Image
              </Button>
            )}

            {booking && (
              <Button onClick={clearResults} variant="secondary" className="flex items-center gap-2" size="lg">
                <Scan className="w-4 h-4" />
                New Scan
              </Button>
            )}
          </div>

          {isScanning && (
            <div className="mx-auto max-w-md">
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
                <h4 className="text-sm font-medium text-blue-700 mb-2 text-center">
                  Live QR Scanner - Point camera at QR code
                </h4>
                <div className="relative">
                  <video ref={videoRef} className="w-full max-h-64 object-cover rounded" playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 border-2 border-blue-400 rounded pointer-events-none">
                    <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-400"></div>
                    <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-400"></div>
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-400"></div>
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-400"></div>
                  </div>
                </div>
                <p className="text-xs text-blue-600 mt-2 text-center animate-pulse">
                  Scanning for QR codes automatically...
                </p>
              </div>
            </div>
          )}

          {selectedImage && (
            <div className="mx-auto max-w-md">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <h4 className="text-sm font-medium text-gray-700 mb-2 text-center">
                  QR Code Image - Automatically Detected
                </h4>
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt="QR Code"
                  className="w-full max-h-64 object-contain rounded"
                />
                <p className="text-xs text-gray-600 mt-2 text-center">
                  QR code data has been automatically extracted and filled below
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Booking ID (Auto-filled from QR scan):</label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., C3-1757650588719"
                  value={qrCode}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="flex-1 font-mono text-base"
                  disabled={loading}
                />
                <Button onClick={handleManualSearch} disabled={loading || !qrCode.trim()} className="min-w-[100px]">
                  <Search className="w-4 h-4 mr-2" />
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This field will be automatically filled when you scan a QR code
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm font-medium mb-3 text-gray-700">Test with sample booking IDs:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQrCode("C3-1757650588719")}
                  disabled={loading}
                  className="font-mono text-xs"
                >
                  C3-1757650588719
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQrCode("C3-1757650603989")}
                  disabled={loading}
                  className="font-mono text-xs"
                >
                  C3-1757650603989
                </Button>
              </div>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-8 bg-blue-50 rounded-lg border border-blue-200">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-blue-800 font-medium">Searching for booking...</span>
            </div>
          )}

          {booking && !loading && (
            <Card className="border-green-200 bg-green-50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Booking Found!
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-green-700 font-medium">Verified</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Customer Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800 border-b border-green-200 pb-2">Customer Details</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-gray-600">Booking ID:</span>{" "}
                        <span className="font-mono text-green-800">{booking.booking_id}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Name:</span>{" "}
                        <span className="text-green-800">{booking.applicant_name}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Contact:</span>{" "}
                        <span className="text-green-800">{booking.contact}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Email:</span>{" "}
                        <span className="text-green-800">{booking.email || "Not provided"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Event Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800 border-b border-green-200 pb-2">Event Details</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-gray-600">Event Type:</span>{" "}
                        <span className="text-green-800">{booking.event_type}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Date:</span>{" "}
                        <span className="text-green-800">{safeFormatDate(booking.event_date)}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Time Slot:</span>{" "}
                        <span className="text-green-800">{booking.time_slot || "Not specified"}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Guests:</span>{" "}
                        <span className="text-green-800">{booking.guests} people</span>
                      </p>
                    </div>
                  </div>

                  {/* Booking Information */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800 border-b border-green-200 pb-2">Booking Info</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-gray-600">Plan:</span>{" "}
                        <span className="text-green-800">{booking.plan_type}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Decoration:</span>{" "}
                        <span className="text-green-800">{booking.decoration_name || "Standard"}</span>
                      </p>
                      {booking.selected_drink && (
                        <p>
                          <span className="font-medium text-gray-600">Welcome Drink:</span>{" "}
                          <span className="text-green-800">
                            {booking.selected_drink === "rosemilk"
                              ? "Rose Milk"
                              : booking.selected_drink === "mojito"
                                ? "Virgin Mojito"
                                : booking.selected_drink}
                          </span>
                        </p>
                      )}
                      <p>
                        <span className="font-medium text-gray-600">Total Amount:</span>{" "}
                        <span className="text-green-800 font-semibold">{formatCurrency(booking.total_amount)}</span>
                      </p>
                    </div>
                  </div>

                  {/* Payment & Status */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800 border-b border-green-200 pb-2">Payment & Status</h4>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium text-gray-600">Advance Paid:</span>{" "}
                        <span className="text-green-800 font-semibold">{formatCurrency(booking.advance_paid)}</span>
                      </p>
                      <p>
                        <span className="font-medium text-gray-600">Balance:</span>{" "}
                        <span className="text-green-800 font-semibold">{formatCurrency(booking.balance_amount)}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Payment:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.payment_status === "completed"
                              ? "bg-green-200 text-green-800"
                              : booking.payment_status === "advance_paid"
                                ? "bg-blue-200 text-blue-800"
                                : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {booking.payment_status?.replace("_", " ").toUpperCase()}
                        </span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="font-medium text-gray-600">Status:</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            booking.status === "confirmed"
                              ? "bg-green-200 text-green-800"
                              : booking.status === "completed"
                                ? "bg-blue-200 text-blue-800"
                                : booking.status === "cancelled"
                                  ? "bg-red-200 text-red-800"
                                  : "bg-yellow-200 text-yellow-800"
                          }`}
                        >
                          {booking.status?.toUpperCase()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Add-ons if available */}
                {booking.selected_addons &&
                  Array.isArray(booking.selected_addons) &&
                  booking.selected_addons.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-green-200">
                      <h4 className="font-semibold text-green-800 mb-3">Selected Add-ons:</h4>
                      <div className="flex flex-wrap gap-2">
                        {booking.selected_addons.map((addon, index) => (
                          <span
                            key={index}
                            className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {addon.name} - {formatCurrency(addon.price * (addon.quantity || 1))}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Special Requirements if available */}
                {booking.special_requirements && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">Special Requirements:</h4>
                    <p className="text-sm text-green-700 bg-green-100 p-3 rounded">{booking.special_requirements}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              How to use the Enhanced QR Scanner:
            </h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-800 min-w-[20px]">1.</span>
                <span>
                  <strong>Live Scanning:</strong> Click "Start Live QR Scanner" to use your camera in real-time
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-800 min-w-[20px]">2.</span>
                <span>Point your camera at the QR code - it will automatically detect and extract the booking ID</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-800 min-w-[20px]">3.</span>
                <span>
                  <strong>Photo Upload:</strong> Or click "Take Photo of QR Code" to upload an image
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-800 min-w-[20px]">4.</span>
                <span>The booking ID will be automatically extracted and filled in the input field</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-800 min-w-[20px]">5.</span>
                <span>The system will automatically search and display booking details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-medium text-blue-800 min-w-[20px]">6.</span>
                <span>Use the sample booking IDs above to test the system</span>
              </li>
            </ul>

            <div className="mt-3 p-3 bg-blue-100 rounded border border-blue-200">
              <p className="text-blue-800 text-xs">
                <strong>New Features:</strong> The scanner now automatically detects QR codes from both live camera feed
                and uploaded images. No more manual typing required! The booking ID is extracted and searched
                automatically.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
