"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Calendar, Users, Eye, CheckCircle, AlertCircle } from "lucide-react"

interface TodayBooking {
  id: string
  booking_id: string
  applicant_name: string
  contact: string
  event_type: string
  time_slot: string
  guests: number
  status: string
  is_verified: boolean
  decoration_name?: string
  total_amount: number
}

export function TodayBookings() {
  const [bookings, setBookings] = useState<TodayBooking[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTodayBookings()
  }, [])

  const fetchTodayBookings = async () => {
    try {
      const today = new Date().toISOString().split("T")[0]

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("event_date", today)
        .order("time_slot", { ascending: true })

      if (error) throw error
      setBookings(data || [])
    } catch (error) {
      console.error("Error fetching today's bookings:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      cancelled: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const getTimeSlotBadge = (timeSlot: string) => {
    const now = new Date()
    const currentHour = now.getHours()

    let slotHour = 0
    if (timeSlot.includes("Morning")) slotHour = 10
    else if (timeSlot.includes("Afternoon")) slotHour = 14
    else if (timeSlot.includes("Evening")) slotHour = 18

    const isPast = currentHour > slotHour + 4 // Assuming 4-hour slots
    const isCurrent = currentHour >= slotHour && currentHour <= slotHour + 4

    return <Badge variant={isPast ? "secondary" : isCurrent ? "default" : "outline"}>{timeSlot}</Badge>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            <div
              className={`w-8 h-10 rounded-full ${
                i % 3 === 0 ? "bg-orange-400" : i % 3 === 1 ? "bg-orange-300" : "bg-orange-200"
              } opacity-60 shadow-lg`}
            />
          </div>
        ))}

        <div className="flex items-center justify-center h-64 relative z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="text-xl font-serif text-orange-800">Loading today's bookings...</div>
          </div>
        </div>
      </div>
    )
  }

  const totalGuests = bookings.reduce((sum, booking) => sum + booking.guests, 0)
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length
  const pendingBookings = bookings.filter((b) => b.status === "pending").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-bounce"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        >
          <div
            className={`w-8 h-10 rounded-full ${
              i % 3 === 0 ? "bg-orange-400" : i % 3 === 1 ? "bg-orange-300" : "bg-orange-200"
            } opacity-60 shadow-lg`}
          />
        </div>
      ))}

      <div className="relative z-10 p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-orange-800 mb-2 tracking-wide">Today's Events</h1>
          <p className="text-orange-600 font-light text-lg">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Today's Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Total Events</p>
                  <p className="text-3xl font-serif font-bold text-orange-800">{bookings.length}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Total Guests</p>
                  <p className="text-3xl font-serif font-bold text-orange-800">{totalGuests}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Confirmed</p>
                  <p className="text-3xl font-serif font-bold text-green-600">{confirmedBookings}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Pending</p>
                  <p className="text-3xl font-serif font-bold text-orange-600">{pendingBookings}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <AlertCircle className="w-8 h-8 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Bookings Table */}
        <Card className="bg-white/90 backdrop-blur-sm border-orange-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl font-serif">
              <Calendar className="w-6 h-6" />
              Today's Event Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-orange-200">
                      <TableHead className="font-serif text-orange-800 font-semibold">Time Slot</TableHead>
                      <TableHead className="font-serif text-orange-800 font-semibold">Customer</TableHead>
                      <TableHead className="font-serif text-orange-800 font-semibold">Event Type</TableHead>
                      <TableHead className="font-serif text-orange-800 font-semibold">Guests</TableHead>
                      <TableHead className="font-serif text-orange-800 font-semibold">Decoration</TableHead>
                      <TableHead className="font-serif text-orange-800 font-semibold">Amount</TableHead>
                      <TableHead className="font-serif text-orange-800 font-semibold">Status</TableHead>
                      <TableHead className="font-serif text-orange-800 font-semibold">Verified</TableHead>
                      <TableHead className="font-serif text-orange-800 font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} className="border-orange-100 hover:bg-orange-50/50 transition-colors">
                        <TableCell>{getTimeSlotBadge(booking.time_slot)}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-orange-800">{booking.applicant_name}</div>
                            <div className="text-sm text-orange-600">{booking.contact}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-700">{booking.event_type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-gray-700">{booking.guests}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600 italic">{booking.decoration_name || "None"}</span>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-green-600 text-lg">
                            ₹{booking.total_amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>
                          <Badge variant={booking.is_verified ? "default" : "destructive"}>
                            {booking.is_verified ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/booking/${booking.id}`)}
                            className="border-orange-300 text-orange-700 hover:bg-orange-50 hover:border-orange-400 transition-all duration-200"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-orange-800 mb-3">No Events Today</h3>
                <p className="text-orange-600 text-lg font-light">
                  There are no bookings scheduled for today. Enjoy the peaceful day!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
