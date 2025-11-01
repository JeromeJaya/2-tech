import React, { useState, useEffect } from "react";
import api from "@/services/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Users, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "Morning (10:00 AM - 2:00 PM)",
  "Afternoon (2:00 PM - 6:00 PM)",
  "Evening (6:00 PM - 10:00 PM)",
  "Full Day (10:00 AM - 10:00 PM)"
];

export function SlotManagement() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalCapacity] = useState(200);

  useEffect(() => {
    if (selectedDate) fetchSlotAvailability(selectedDate);
  }, [selectedDate]);

  const fetchSlotAvailability = async (date) => {
    setLoading(true);
    try {
      const dateString = date.toISOString().split("T")[0];
      const res = await api.get(`/bookings/date/${dateString}`);
      const bookings = res.data.data || [];

      const slotInfo = TIME_SLOTS.map(slot => {
        const booking = bookings.find(b => b.time_slot === slot);
        return {
          slot,
          isBooked: !!booking,
          booking: booking ? {
            id: booking._id,
            booking_id: booking.booking_id,
            applicant_name: booking.applicant_name,
            guests: booking.guests,
            status: booking.status,
            contact: booking.contact
          } : undefined
        };
      });

      setSlots(slotInfo);
    } catch (error) {
      console.error("Error fetching slot availability:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSlotStatus = (slot) => {
    if (!slot.isBooked) return { status: "available", color: "default", icon: CheckCircle };
    if (slot.booking?.status === "confirmed") return { status: "confirmed", color: "default", icon: CheckCircle };
    if (slot.booking?.status === "pending") return { status: "pending", color: "secondary", icon: AlertCircle };
    return { status: "booked", color: "destructive", icon: XCircle };
  };

  const getTotalGuestsForDay = () =>
    slots.reduce((t, s) => (s.isBooked && s.booking ? t + s.booking.guests : t), 0);

  const bookedSlots = slots.filter(s => s.isBooked).length;
  const availableSlots = TIME_SLOTS.length - bookedSlots;

  const getAvailableCapacity = () => totalCapacity - getTotalGuestsForDay();

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Slot Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-[240px] justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{availableSlots}</p>
                <p className="text-sm text-muted-foreground">Available Slots</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{bookedSlots}</p>
                <p className="text-sm text-muted-foreground">Booked Slots</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{getAvailableCapacity()}</p>
                <p className="text-sm text-muted-foreground">Available Capacity</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Capacity Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Daily Capacity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Guests: {getTotalGuestsForDay()}</span>
              <span>Max Capacity: {totalCapacity}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-4">
              <div
                className={cn(
                  "h-4 rounded-full transition-all",
                  getTotalGuestsForDay() / totalCapacity > 0.8
                    ? "bg-red-500"
                    : getTotalGuestsForDay() / totalCapacity > 0.6
                    ? "bg-orange-500"
                    : "bg-green-500"
                )}
                style={{
                  width: `${Math.min((getTotalGuestsForDay() / totalCapacity) * 100, 100)}%`
                }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {((getTotalGuestsForDay() / totalCapacity) * 100).toFixed(1)}% capacity used
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Slot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {slots.map((slot) => {
          const { status, color, icon: Icon } = getSlotStatus(slot);
          return (
            <Card key={slot.slot} className="transition-all hover:shadow-md border-l-4">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium">{slot.slot}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon className="w-4 h-4" />
                      <Badge variant={color}>
                        {status === "available"
                          ? "Available"
                          : status === "confirmed"
                          ? "Confirmed"
                          : status === "pending"
                          ? "Pending"
                          : "Booked"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {slot.isBooked && slot.booking && (
                  <div className="space-y-2 pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Customer:</span>
                      <span className="text-sm">{slot.booking.applicant_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Contact:</span>
                      <span className="text-sm">{slot.booking.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Guests:</span>
                      <span className="text-sm font-medium">{slot.booking.guests}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
