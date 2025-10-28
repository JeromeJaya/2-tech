"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Sparkles, Star, Check } from "lucide-react"

interface PricingPlansProps {
  onSelectPlan: (planId: string) => void
}

export const EnhancedPricingPlans = ({ onSelectPlan }: PricingPlansProps) => {
  const [selectedPlan, setSelectedPlan] = useState("")

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      priceRange: "₹1,600 - ₹3,500",
      icon: Crown,
      gradient: "from-orange-500/80 to-orange-500",
      features: [
        "Premium decoration setup",
        "Professional photo session",
        "Basic lighting arrangement",
        "1 hour hall usage",
        "Add-ons available separately",
      ],
      addOns: [
        { name: "Hanging Photos", price: 80, max: 9 },
        { name: "LED Light", price: 150, requiresName: true },
        { name: "Age Light", price: 150 },
        { name: "Big Poppers", price: 100 },
        { name: "Crown", price: 120 },
        { name: "Birthday Sash", price: 80 },
      ],
      restrictions: ["Spray not allowed"],
      includes: ["Balloon color customization", "Long press image zoom"],
    },
    {
      id: "premium",
      name: "Premium Plan",
      priceRange: "₹3,500 - ₹4,900",
      icon: Sparkles,
      gradient: "from-orange-500 to-orange-400",
      popular: true,
      features: [
        "Everything in Basic Plan",
        "2 hours hall usage",
        "½ kg complimentary cake",
        "Welcome drink (4 varieties)",
        "Crown, Popper, Sash (returnable)",
      ],
      addOns: [
        { name: "Hanging Photos", price: 80, max: 9 },
        { name: "LED Light", price: 150, requiresName: true },
        { name: "Age Light", price: 150 },
        { name: "Big Poppers", price: 100 },
        { name: "Birthday Sash", price: 80 },
      ],
      included: ["Crown", "Popper", "Sash"],
      drinks: ["Rosemilk", "Lemon", "Badam", "Mojito"],
    },
    {
      id: "elite",
      name: "Elite Plan",
      priceRange: "₹4,900 - ₹10,000",
      icon: Star,
      gradient: "from-orange-400 to-orange-500",
      features: [
        "Everything in Premium Plan",
        "Extended 3 hours hall usage",
        "1 kg premium cake",
        "Premium welcome drinks",
        "Exclusive decoration themes",
        "Personal event coordinator",
      ],
      addOns: [
        { name: "Hanging Photos", price: 80, max: 9 },
        { name: "LED Light", price: 150, requiresName: true },
        { name: "Age Light", price: 150 },
        { name: "Big Poppers", price: 100 },
        { name: "Birthday Sash", price: 80 },
      ],
      included: ["Crown", "Popper", "Sash", "Premium Setup"],
      exclusive: true,
    },
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    onSelectPlan(planId)
  }

  return (
    <div className="space-y-12 p-8">
      <div className="text-center space-y-6">
        <h1
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent leading-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          From intimate gatherings to grand celebrations, we have the perfect package for your special day
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => {
          const IconComponent = plan.icon
          const isSelected = selectedPlan === plan.id

          return (
            <Card
              key={plan.id}
              className={`relative transition-all duration-300 hover:shadow-2xl group cursor-pointer ${
                isSelected
                  ? "ring-2 ring-orange-500 shadow-2xl scale-105 bg-gradient-to-br from-orange-500/5 to-orange-400/5"
                  : "hover:scale-105"
              } ${plan.popular ? "border-orange-500 shadow-xl" : "border-border hover:border-orange-500/30"}`}
              onClick={() => handleSelectPlan(plan.id)}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 !bg-orange-500 !text-white px-6 py-2 text-sm font-medium shadow-lg border border-orange-500/20 !border-transparent">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center space-y-6 pb-6">
                <div
                  className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${plan.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                >
                  <IconComponent className="h-10 w-10 text-white" />
                </div>
                <div>
                  <CardTitle
                    className="text-3xl font-bold text-foreground"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-xl font-semibold text-orange-500 mt-3">
                    {plan.priceRange}
                  </CardDescription>
                </div>
              </CardHeader>

              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h4
                    className="font-semibold text-foreground text-lg"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Included Features:
                  </h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.drinks && (
                  <div className="space-y-4">
                    <h4
                      className="font-semibold text-foreground text-lg"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      Welcome Drinks:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.drinks.map((drink) => (
                        <Badge
                          key={drink}
                          variant="secondary"
                          className="text-xs bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20 transition-colors"
                        >
                          {drink}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {plan.included && (
                  <div className="space-y-4">
                    <h4
                      className="font-semibold text-foreground text-lg"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      Complimentary Items:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {plan.included.map((item) => (
                        <Badge
                          key={item}
                          variant="outline"
                          className="text-xs border-orange-400 text-orange-400 hover:bg-orange-400/10 transition-colors"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4
                    className="font-semibold text-foreground text-lg"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Available Add-ons:
                  </h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {plan.addOns.slice(0, 4).map((addon) => (
                      <div
                        key={addon.name}
                        className="flex justify-between items-center p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <span className="text-muted-foreground">
                          {addon.name}
                          {addon.requiresName && <span className="text-orange-500 ml-1">*</span>}
                          {addon.max && <span className="text-xs"> (max {addon.max})</span>}
                        </span>
                        <span className="font-semibold text-orange-500">₹{addon.price}</span>
                      </div>
                    ))}
                    {plan.addOns.length > 4 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{plan.addOns.length - 4} more available...
                      </div>
                    )}
                  </div>
                </div>

                {plan.restrictions && (
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                    <div className="text-sm text-destructive">
                      <strong>Note:</strong> {plan.restrictions.join(", ")}
                    </div>
                  </div>
                )}

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  className={`w-full transition-all duration-300 h-12 text-base font-medium ${
                    plan.popular
                      ? "bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-lg hover:shadow-xl"
                      : isSelected
                        ? "bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-lg"
                        : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  }`}
                  variant={plan.popular || isSelected ? "default" : "outline"}
                  size="lg"
                >
                  {isSelected ? "✓ Selected" : "Choose Plan"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="max-w-5xl mx-auto bg-gradient-to-br from-orange-500/5 to-orange-400/5 rounded-2xl p-8 border border-orange-500/20">
        <h3
          className="text-2xl font-semibold mb-6 text-center text-foreground"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Special Features Across All Plans
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-orange-500" />
            <span>Balloon color customization (Amazon-style selector)</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-orange-500" />
            <span>Long press image zoom functionality</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-orange-500" />
            <span>QR code generation for booking confirmation</span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="h-5 w-5 text-orange-500" />
            <span>Advance payment with balance tracking</span>
          </div>
        </div>
      </div>
    </div>
  )
}
