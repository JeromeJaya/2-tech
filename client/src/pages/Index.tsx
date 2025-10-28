import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PricingPlans } from "@/components/sections/PricingPlans";
import { VenuePolicy } from "@/components/sections/VenuePolicy";
import { ComplementsAddons } from "@/components/sections/ComplementsAddons";
import { ComprehensiveBookingForm } from "@/components/booking/ComprehensiveBookingForm";
import { EnhancedBookingSuccess } from "@/components/booking/EnhancedBookingSuccess";
import { Button } from "@/components/ui/button";
import { Menu, X, Crown } from "lucide-react"; // Import Menu, X, and Crown icons

const Index = () => {
  const [activeSection, setActiveSection] = useState("booking");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [bookingData, setBookingData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setActiveSection("booking");
  };

  const handleDirectBooking = () => {
    setActiveSection("booking");
  };

  const handleBookingComplete = (data: any) => {
    setBookingData(data);
    setActiveSection("success");
  };

  const handleNewBooking = () => {
    setBookingData(null);
    setSelectedPlan("");
    setActiveSection("pricing");
  };

  // This function now also closes the mobile sidebar on navigation
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "pricing":
        return <PricingPlans onSelectPlan={handleSelectPlan} />;
      case "booking":
        return <ComprehensiveBookingForm onBookingComplete={handleBookingComplete} />;
      case "policy":
        return <VenuePolicy />;
      case "complements":
        return <ComplementsAddons />;
      case "success":
        return <EnhancedBookingSuccess bookingData={bookingData} onNewBooking={handleNewBooking} />;
      default:
        return <ComprehensiveBookingForm onBookingComplete={handleBookingComplete} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* ===== MOBILE HEADER ===== */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-sidebar border-b border-sidebar-border shadow-md">
        <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-sidebar-primary" />
            <h1 className="text-lg font-bold text-sidebar-foreground">C3 Café Booking</h1>
        </div>
        <Button variant="" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </header>

      {/* ===== SIDEBAR (Desktop and Mobile Drawer) ===== */}
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div
        className={`
          fixed top-0 bottom-0 left-0 z-40 w-80 flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 overflow-auto w-full">
        {/* Add margin-top for mobile header */}
        <main className="p-4 md:p-8 mt-16 md:mt-0">
          {renderContent()}
        </main>
        
        {/* Admin Access Link */}
        <div className="fixed bottom-4 right-4 z-50">
          <a 
            href="/admin/login" 
            className="text-xs text-muted-foreground hover:text-primary transition-colors bg-background/80 backdrop-blur-sm px-2 py-1 rounded border"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
