"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { BarChart3, TrendingUp, Calendar, Users, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface AnalyticsData {
  totalBookings: number
  monthlyBookings: number
  weeklyBookings: number
  totalRevenue: number
  monthlyRevenue: number
  avgBookingValue: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  popularEventTypes: { event_type: string; count: number }[]
  popularPlans: { plan_type: string; count: number }[]
  upcomingEvents: any[]
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())

      const monthlyBookings = bookings.filter((b) => new Date(b.created_at) >= startOfMonth)
      const weeklyBookings = bookings.filter((b) => new Date(b.created_at) >= startOfWeek)

      // Revenue calculations
      const totalRevenue = bookings.reduce((sum, b) => sum + b.total_amount, 0)
      const monthlyRevenue = monthlyBookings.reduce((sum, b) => sum + b.total_amount, 0)
      const avgBookingValue = bookings.length > 0 ? totalRevenue / bookings.length : 0

      // Status counts
      const pendingBookings = bookings.filter((b) => b.status === "pending").length
      const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length
      const completedBookings = bookings.filter((b) => b.status === "completed").length

      // Popular event types
      const eventTypeCounts = bookings.reduce(
        (acc, b) => {
          acc[b.event_type] = (acc[b.event_type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const popularEventTypes = Object.entries(eventTypeCounts)
        .map(([event_type, count]) => ({ event_type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      // Popular plans
      const planTypeCounts = bookings.reduce(
        (acc, b) => {
          acc[b.plan_type] = (acc[b.plan_type] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const popularPlans = Object.entries(planTypeCounts)
        .map(([plan_type, count]) => ({ plan_type, count }))
        .sort((a, b) => b.count - a.count)

      // Upcoming events (next 7 days)
      const nextWeek = new Date()
      nextWeek.setDate(now.getDate() + 7)
      const upcomingEvents = bookings
        .filter((b) => {
          const eventDate = new Date(b.event_date)
          return eventDate >= now && eventDate <= nextWeek && b.status !== "cancelled"
        })
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
        .slice(0, 5)

      setAnalytics({
        totalBookings: bookings.length,
        monthlyBookings: monthlyBookings.length,
        weeklyBookings: weeklyBookings.length,
        totalRevenue,
        monthlyRevenue,
        avgBookingValue,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        popularEventTypes,
        popularPlans,
        upcomingEvents,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full opacity-40"
              style={{
                width: `${15 + Math.random() * 20}px`,
                height: `${20 + Math.random() * 25}px`,
                background: `linear-gradient(135deg, #ff6b35, #ff8c42)`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 180],
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-center h-64 relative z-10">
          <div className="text-center">
            <motion.div
              className="rounded-full h-12 w-12 border-3 border-orange-500 border-t-transparent mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
            <p className="text-orange-700 font-['Playfair_Display'] text-lg">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${12 + Math.random() * 25}px`,
              height: `${15 + Math.random() * 30}px`,
              background: `linear-gradient(135deg, #ff6b35, #ff8c42)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 30 - 15, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-['Playfair_Display'] text-orange-800 mb-2">Analytics Dashboard</h1>
          <p className="text-orange-600 text-base">Comprehensive insights into your party hall business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Bookings",
              value: analytics.totalBookings,
              subtitle: `${analytics.monthlyBookings} this month`,
              icon: Calendar,
              color: "orange",
            },
            {
              title: "Total Revenue",
              value: `₹${analytics.totalRevenue.toLocaleString()}`,
              subtitle: `₹${analytics.monthlyRevenue.toLocaleString()} this month`,
              icon: DollarSign,
              color: "green",
            },
            {
              title: "Avg Booking Value",
              value: `₹${Math.round(analytics.avgBookingValue).toLocaleString()}`,
              subtitle: "Per booking",
              icon: TrendingUp,
              color: "blue",
            },
            {
              title: "This Week",
              value: analytics.weeklyBookings,
              subtitle: "New bookings",
              icon: Clock,
              color: "purple",
            },
          ].map((stat) => (
            <motion.div key={stat.title} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="bg-white/95 border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold font-['Playfair_Display'] text-orange-800">{stat.value}</p>
                      <p className="text-xs text-orange-500 mt-1">{stat.subtitle}</p>
                    </div>
                    <div className={`bg-${stat.color}-100 p-2 rounded-lg`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Pending", value: analytics.pendingBookings, icon: AlertCircle, color: "orange" },
            { title: "Confirmed", value: analytics.confirmedBookings, icon: CheckCircle, color: "green" },
            { title: "Completed", value: analytics.completedBookings, icon: Users, color: "blue" },
          ].map((status) => (
            <motion.div key={status.title} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
              <Card className="bg-white/95 border-orange-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium mb-1">{status.title}</p>
                      <p className={`text-2xl font-bold font-['Playfair_Display'] text-${status.color}-700`}>
                        {status.value}
                      </p>
                    </div>
                    <div className={`bg-${status.color}-100 p-2 rounded-lg`}>
                      <status.icon className={`w-6 h-6 text-${status.color}-600`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Event Types */}
          <Card className="bg-white/95 border-orange-200 shadow-md">
            <CardHeader className="bg-orange-50 border-b border-orange-200">
              <CardTitle className="flex items-center gap-2 text-orange-800 font-['Playfair_Display']">
                <BarChart3 className="w-5 h-5" />
                Popular Event Types
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-3">
                {analytics.popularEventTypes.map((item, index) => (
                  <div
                    key={item.event_type}
                    className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-orange-700 bg-orange-200 w-6 h-6 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-medium text-orange-800">{item.event_type}</span>
                    </div>
                    <Badge className="bg-orange-200 text-orange-800">{item.count} bookings</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Plans */}
          <Card className="bg-white/95 border-orange-200 shadow-md">
            <CardHeader className="bg-orange-50 border-b border-orange-200">
              <CardTitle className="flex items-center gap-2 text-orange-800 font-['Playfair_Display']">
                <TrendingUp className="w-5 h-5" />
                Plan Popularity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <div className="space-y-3">
                {analytics.popularPlans.map((item, index) => (
                  <div
                    key={item.plan_type}
                    className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-orange-700 bg-orange-200 w-6 h-6 rounded-full flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-medium text-orange-800">{item.plan_type}</span>
                    </div>
                    <Badge
                      className={
                        item.plan_type === "Elite"
                          ? "bg-orange-600 text-white"
                          : item.plan_type === "Premium"
                            ? "bg-orange-400 text-white"
                            : "bg-orange-200 text-orange-800"
                      }
                    >
                      {item.count} bookings
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/95 border-orange-200 shadow-md">
          <CardHeader className="bg-orange-50 border-b border-orange-200">
            <CardTitle className="flex items-center gap-2 text-orange-800 font-['Playfair_Display']">
              <Calendar className="w-5 h-5" />
              Upcoming Events (Next 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            {analytics.upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {analytics.upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50/30"
                  >
                    <div>
                      <p className="font-semibold text-orange-800 font-['Playfair_Display']">{event.applicant_name}</p>
                      <p className="text-sm text-orange-600 mt-1">
                        {event.event_type} • {new Date(event.event_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          event.status === "confirmed" ? "bg-green-200 text-green-800" : "bg-orange-200 text-orange-800"
                        }
                      >
                        {event.status}
                      </Badge>
                      <p className="text-sm text-orange-600 mt-1">{event.guests} guests</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-orange-300 mx-auto mb-3" />
                <p className="text-orange-600 font-medium font-['Playfair_Display']">
                  No upcoming events in the next 7 days
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
