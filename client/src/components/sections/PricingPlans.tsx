"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Crown, Sparkles } from "lucide-react"

const plans = [
  {
    id: "basic",
    name: "Basic Plan",
    price: "₹1,600",
    description: "Perfect for intimate celebrations",
    features: [
      "Exclusive Hall Access (1 Hour)",
      "Basic Decorations",
      "1/2 kg Celebration Cake",
      "Audio Equipment Setup",
    ],
    icon: Star,
    gradient: "from-orange-500/50 to-orange-400/50",
    popular: false,
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "₹3,000 - ₹5,000",
    description: "Enhanced experience with style",
    features: [
      "Extended Decoration Themes",
      "Lighting & Table Setup",
      "Customized Cake (additional weight)",
      "Premium Audio Setup",
    ],
    icon: Sparkles,
    gradient: "from-orange-500 to-orange-400",
    popular: true,
  },
  {
    id: "elite",
    name: "Elite Plan",
    price: "₹5,000 - ₹10,000",
    description: "Ultimate luxury celebration",
    features: [
      "Full Theme Decoration",
      "LED Displays & Selfie Booth",
      "Professional Audio Setup",
      "Personalized Cake Table",
    ],
    icon: Crown,
    gradient: "from-orange-400 to-orange-500",
    popular: false,
  },
]

interface PricingPlansProps {
  onSelectPlan: (planId: string) => void
}

export const PricingPlans = ({ onSelectPlan }: PricingPlansProps) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1
          className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Choose Your Perfect Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select from our carefully crafted packages designed to make your celebration unforgettable
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => {
          const Icon = plan.icon

          return (
            <Card
              key={plan.id}
              className={`
                relative overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl
                ${plan.popular ? "ring-2 ring-orange-500 ring-opacity-50" : ""}
              `}
            >
              {plan.popular && (
                <Badge className="absolute top-4 right-4 !bg-orange-500 !text-white font-semibold shadow-lg !border-transparent">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-4">
                <div
                  className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center mb-4`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <div className="text-3xl font-bold text-orange-500 mt-2">
                  {plan.price}
                  <span className="text-sm font-normal text-muted-foreground"> /event</span>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white"
                  size="lg"
                  onClick={() => onSelectPlan(plan.id)}
                >
                  Select {plan.name}
                </Button>
              </CardFooter>

              {/* Decorative gradient overlay */}
              <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${plan.gradient}`} />
            </Card>
          )
        })}
      </div>

      {/* Additional Info */}
      <div className="text-center space-y-4 bg-orange-500/5 rounded-2xl p-8 max-w-4xl mx-auto border border-orange-500/20">
        <h3 className="text-xl font-semibold" style={{ fontFamily: "Playfair Display, serif" }}>
          All Plans Include
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-orange-500" />
            <span>60 minutes exclusive hall access</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-orange-500" />
            <span>Audio system with Bluetooth</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-orange-500" />
            <span>Complimentary 1/2 kg cake</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-orange-500" />
            <span>Professional setup assistance</span>
          </div>
        </div>
      </div>
    </div>
  )
}
