import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminBookingDetail from "./pages/AdminBookingDetail";
import { AdminLayout } from "./pages/AdminLayout";
import AdminDashboardNew from "./pages/admin/AdminDashboardNew";
import AdminTodayBookings from "./pages/admin/AdminTodayBookings";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminQRScanner from "./pages/admin/AdminQRScanner";
import AdminSlots from "./pages/admin/AdminSlots";
import AdminNewBooking from "./pages/admin/AdminNewBooking";
import AdminAllBookings from "./pages/admin/AdminAllBookings";
import AdminSettings from "./pages/admin/AdminSettings";

const App = () => (
  <React.StrictMode>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        
        {/* Admin login route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin routes - nested under /admin with proper layout */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Redirect /admin to /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardNew />} />
          <Route path="today-bookings" element={<AdminTodayBookings />} />
          <Route path="analytics" element={<AdminAnalyticsPage />} />
          <Route path="qr-scanner" element={<AdminQRScanner />} />
          <Route path="slots" element={<AdminSlots />} />
          <Route path="new-booking" element={<AdminNewBooking />} />
          <Route path="all-bookings" element={<AdminAllBookings />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="booking/:id" element={<AdminBookingDetail />} />
        </Route>
        
        {/* Catch-all route for 404 - MUST be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

export default App;