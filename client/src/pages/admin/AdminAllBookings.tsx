import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Search, 
  Eye, 
  CalendarIcon, 
  Filter,
  Download,
  RefreshCw,
  Phone,
  Mail,
  Calendar as CalendarStatic,
  IndianRupee,
  CreditCard
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  booking_id: string;
  applicant_name: string;
  contact: string;
  email: string | null;
  event_type: string;
  event_date: string;
  guests: number;
  plan_type: string;
  total_amount: number;
  advance_paid: number;
  balance_amount: number;
  payment_status: string;
  status: string;
  is_verified: boolean;
  created_at: string;
  decoration_name: string | null;
  selected_drink?: string | null;
}

// Mobile Card Component for individual bookings
const BookingCard = ({ booking, onViewDetails }: { booking: Booking; onViewDetails: (id: string) => void }) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      partial: "secondary",
      completed: "default",
      failed: "destructive",
    };
    return <Badge variant={variants[paymentStatus] || "outline"}>{paymentStatus}</Badge>;
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header with Booking ID and Status */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-sm font-medium text-primary">{booking.booking_id}</p>
              <p className="text-lg font-semibold">{booking.applicant_name}</p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              {getStatusBadge(booking.status)}
              {getPaymentBadge(booking.payment_status)}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>{booking.contact}</span>
            </div>
            {booking.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{booking.email}</span>
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">{booking.event_type}</p>
              {booking.decoration_name && (
                <p className="text-muted-foreground text-xs">{booking.decoration_name}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <CalendarStatic className="w-4 h-4 text-muted-foreground" />
              <span>{new Date(booking.event_date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Plan and Guests */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="outline">{booking.plan_type}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{booking.guests} guests</span>
              </div>
            </div>
          </div>

          {/* Amount Details */}
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                <div>
                  <p className="font-semibold">₹{booking.total_amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="w-4 h-4" />
                <div>
                  <p className="font-semibold">₹{booking.advance_paid.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Advance Paid</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => onViewDetails(booking.id)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminAllBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, paymentFilter, dateFrom, dateTo]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.applicant_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.contact.includes(searchTerm) ||
          booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.event_type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    if (paymentFilter !== "all") {
      filtered = filtered.filter((booking) => booking.payment_status === paymentFilter);
    }

    if (dateFrom) {
      filtered = filtered.filter(
        (booking) => new Date(booking.event_date) >= dateFrom
      );
    }
    if (dateTo) {
      filtered = filtered.filter(
        (booking) => new Date(booking.event_date) <= dateTo
      );
    }

    setFilteredBookings(filtered);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      confirmed: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      partial: "secondary",
      completed: "default",
      failed: "destructive",
    };
    return <Badge variant={variants[paymentStatus] || "outline"}>{paymentStatus}</Badge>;
  };

  const exportBookings = () => {
    const csvContent = [
      "Booking ID,Customer,Contact,Email,Event Type,Event Date,Guests,Plan,Total Amount,Advance,Balance,Payment Status,Status,Created At",
      ...filteredBookings.map(booking => [
        booking.booking_id,
        booking.applicant_name,
        booking.contact,
        booking.email || "",
        booking.event_type,
        booking.event_date,
        booking.guests,
        booking.plan_type,
        booking.total_amount,
        booking.advance_paid,
        booking.balance_amount,
        booking.payment_status,
        booking.status,
        new Date(booking.created_at).toLocaleDateString()
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Bookings data has been exported to CSV.",
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.total_amount, 0);
  const totalAdvance = filteredBookings.reduce((sum, booking) => sum + booking.advance_paid, 0);
  const totalGuests = filteredBookings.reduce((sum, booking) => sum + booking.guests, 0);

  return (
    <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6">
      {/* Summary Stats - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Bookings</p>
                <p className="text-xl sm:text-2xl font-bold">{filteredBookings.length}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-lg sm:text-2xl font-bold">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-100 flex items-center justify-center">
                <IndianRupee className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Advance Collected</p>
                <p className="text-lg sm:text-2xl font-bold">₹{totalAdvance.toLocaleString()}</p>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Guests</p>
                <p className="text-xl sm:text-2xl font-bold">{totalGuests}</p>
              </div>
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Users className="w-5 h-5" />
              All Bookings Management
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" size="sm" onClick={fetchBookings} className="w-full sm:w-auto">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportBookings} className="w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filter Controls - Responsive Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="sm:col-span-2 xl:col-span-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                <Input
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">
                    {dateFrom ? format(dateFrom, "MMM dd") : "From Date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="truncate">
                    {dateTo ? format(dateTo, "MMM dd") : "To Date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
            {(searchTerm || statusFilter !== "all" || paymentFilter !== "all" || dateFrom || dateTo) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Mobile Card View (hidden on lg+) */}
          <div className="block lg:hidden">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading bookings...</p>
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="space-y-3">
                {filteredBookings.map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onViewDetails={(id) => navigate(`/admin/booking/${id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No bookings found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Desktop Table View (hidden on mobile) */}
          <div className="hidden lg:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Loading bookings...
                    </TableCell>
                  </TableRow>
                ) : filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-sm">{booking.booking_id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.applicant_name}</div>
                          <div className="text-sm text-muted-foreground">{booking.contact}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.event_type}</div>
                          <div className="text-sm text-muted-foreground">{booking.decoration_name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(booking.event_date).toLocaleDateString()}</TableCell>
                      <TableCell>{booking.guests}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{booking.plan_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">₹{booking.total_amount.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">
                            Adv: ₹{booking.advance_paid.toLocaleString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPaymentBadge(booking.payment_status)}</TableCell>
                      <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/booking/${booking.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      No bookings found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}