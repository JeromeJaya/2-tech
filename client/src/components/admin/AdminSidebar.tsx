"use client"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Calendar,
  QrCode,
  Users,
  Settings,
  BarChart3,
  Clock,
  UserPlus,
  LogOut,
  Crown,
  Sparkles,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, type ReactNode } from "react"

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Today's Bookings",
    url: "/admin/today-bookings",
    icon: Calendar,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "QR Scanner",
    url: "/admin/qr-scanner",
    icon: QrCode,
  },
  {
    title: "Slot Management",
    url: "/admin/slots",
    icon: Clock,
  },
  {
    title: "New Booking",
    url: "/admin/new-booking",
    icon: UserPlus,
  },
  {
    title: "All Bookings",
    url: "/admin/all-bookings",
    icon: Users,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

const FloatingBalloons = () => {
  const balloons = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    duration: Math.random() * 20 + 15,
    left: Math.random() * 100,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="absolute opacity-20"
          style={{
            left: `${balloon.left}%`,
            animationDelay: `${balloon.delay}s`,
            animationDuration: `${balloon.duration}s`,
          }}
        >
          <div
            className="rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg animate-float"
            style={{
              width: `${balloon.size}px`,
              height: `${balloon.size}px`,
            }}
          />
        </div>
      ))}
    </div>
  )
}

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminSidebar({ children }: AdminLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const currentPath = location.pathname

  const isActive = (path: string) => currentPath === path

  const handleLogout = () => {
    localStorage.removeItem("adminUser")
    navigate("/admin/login")
  }

  const SidebarContent = () => (
    <>
      <FloatingBalloons />

      <div className="flex-shrink-0 p-4 relative z-10">
        <div className="flex items-center gap-3 mb-6">
        <div className="relative">
            <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-lg animate-pulse"></div>
            <div className="relative z-10 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
              <img
                src="/favicon.ico"
                alt="C3 Café Logo"
                className="w-8 h-8 object-contain"
              />
            </div>
            <Sparkles className="h-3 w-3 text-orange-400 absolute -top-1 -right-1 animate-bounce z-20" />
          </div>
          <div>
            <h1
              className="text-xl font-bold text-white tracking-wide"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              C3 Admin
            </h1>
            <p className="text-xs text-orange-300/80 font-medium">Luxury Party Hall Management</p>
          </div>
        </div>

        <Separator className="mb-4 bg-orange-500/20" />
      </div>

      <div className="flex-1 px-4 overflow-y-auto scrollbar-hide relative z-10">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.url)
            return (
              <Link
                key={item.title}
                to={item.url}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "w-full justify-start gap-3 relative overflow-hidden group transition-all duration-300 font-medium text-left h-10 rounded-lg flex items-center px-3",
                  active
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 border border-orange-400/30"
                    : "text-white/80 hover:bg-orange-500/10 hover:text-white border border-transparent hover:border-orange-500/20",
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full blur-sm transition-all duration-300",
                      active ? "bg-white/20" : "bg-orange-500/0 group-hover:bg-orange-500/20",
                    )}
                  ></div>
                  <Icon className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="font-medium tracking-wide text-sm">{item.title}</span>
                {active && <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 rounded-full",
                    active ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 p-4 pt-0 relative z-10">
        <Separator className="mb-4 bg-orange-500/20" />
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 relative overflow-hidden group transition-all duration-300 font-medium text-left h-10 rounded-lg text-white/80 hover:bg-orange-500/10 hover:text-white border border-transparent hover:border-orange-500/20"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-sm transition-all duration-300 bg-orange-500/0 group-hover:bg-orange-500/20"></div>
            <LogOut className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span className="font-medium tracking-wide text-sm">Logout</span>
          <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 rounded-full w-0 group-hover:w-full" />
        </Button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-64 lg:overflow-y-auto lg:bg-black lg:border-r lg:border-orange-500/30 lg:shadow-2xl">
        <div className="flex h-full flex-col">
          <SidebarContent />
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 overflow-y-auto bg-black border-r border-orange-500/30 shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-lg animate-pulse"></div>
                <div className="relative z-10 w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Crown className="h-4 w-4 text-white" />
                </div>
              </div>
              <h1
                className="text-lg font-bold text-white tracking-wide"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                C3 Admin
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-orange-500/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <SidebarContent />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="text-gray-700 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 text-sm font-semibold leading-6 text-gray-900">C3 Café Admin Panel</div>
        </div>

        {/* Page content */}
        <main className="min-h-screen">
          <div className="h-full">{children}</div>
        </main>
      </div>
    </div>
  )
}
