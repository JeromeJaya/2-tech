"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, DollarSign, FileText, Gift, Phone, Sparkles, Instagram, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    id: "pricing",
    label: "Pricing Plans",
    icon: DollarSign,
  },
  {
    id: "booking",
    label: "Apply for Booking",
    icon: Calendar,
  },
  {
    id: "policy",
    label: "Venue Policy & Terms",
    icon: FileText,
  },
  {
    id: "complements",
    label: "Complements & Add-ons",
    icon: Gift,
  },
]

export const Sidebar = ({ activeSection, onSectionChange }) => {
  return (
    <div className="fixed top-0 left-0 h-full w-full sm:w-64 bg-black border-r border-orange-500/30 shadow-2xl flex flex-col z-50 overflow-hidden">
      <div className="flex-shrink-0 p-3 sm:p-4">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-lg animate-pulse"></div>
            <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center shadow-lg overflow-hidden">
              <img src="/favicon.ico" alt="C3 Café Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
            </div>
            <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 text-orange-400 absolute -top-1 -right-1 animate-bounce z-20" />
          </div>
          <div>
            <h1
              className="text-lg sm:text-xl font-bold text-white tracking-wide"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              C3 Café
            </h1>
            <p className="text-xs text-orange-300/80 font-medium">Luxury Party Hall</p>
          </div>
        </div>

        <Separator className="mb-3 sm:mb-4 bg-orange-500/20" />
      </div>

      <div className="flex-1 px-3 sm:px-4 overflow-y-auto scrollbar-hide">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full justify-start gap-2 sm:gap-3 relative overflow-hidden group transition-all duration-300 font-medium text-left h-10 sm:h-10 rounded-lg text-sm sm:text-sm",
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 border border-orange-400/30"
                    : "text-white/80 hover:bg-orange-500/10 hover:text-white border border-transparent hover:border-orange-500/20",
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full blur-sm transition-all duration-300",
                      isActive ? "bg-white/20" : "bg-orange-500/0 group-hover:bg-orange-500/20",
                    )}
                  ></div>
                  <Icon className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="font-medium tracking-wide text-xs sm:text-sm truncate">{item.label}</span>
                {isActive && <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />}
                <div
                  className={cn(
                    "absolute bottom-0 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300 rounded-full",
                    isActive ? "w-full" : "w-0 group-hover:w-full",
                  )}
                />
              </Button>
            )
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 p-3 sm:p-4 pt-0">
        <Separator className="mb-3 sm:mb-4 bg-orange-500/20" />
        <h3
          className="text-xs font-bold text-white/90 mb-3 sm:mb-4 tracking-wide"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          For Reservations & Enquiries
        </h3>
        <ul className="space-y-2 sm:space-y-3 text-xs">
          <li className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center relative z-10 group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                <Phone className="h-2 w-2 sm:h-3 sm:w-3 text-orange-400 group-hover:text-orange-300 transition-colors" />
              </div>
            </div>
            <span className="text-white/80 group-hover:text-white transition-colors font-medium">8870005858</span>
          </li>
          <li className="flex items-center gap-2 sm:gap-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center relative z-10 group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                <Instagram className="h-2 w-2 sm:h-3 sm:w-3 text-orange-400 group-hover:text-orange-300 transition-colors" />
              </div>
            </div>
            <span className="text-white/80 group-hover:text-white transition-colors font-medium">c3.cafe</span>
          </li>
          <li className="flex items-start gap-2 sm:gap-3 group cursor-pointer">
            <div className="relative mt-1">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-sm group-hover:blur-md transition-all duration-300"></div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center relative z-10 group-hover:from-orange-500/30 group-hover:to-orange-600/30 transition-all duration-300">
                <MapPin className="h-2 w-2 sm:h-3 sm:w-3 text-orange-400 group-hover:text-orange-300 transition-colors flex-shrink-0" />
              </div>
            </div>
            <span className="text-white/80 group-hover:text-white transition-colors font-medium leading-relaxed text-xs">
              238, 1st floor, karups nagar extension, trichy road, thanjavur, Thanjavur 613005.
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}