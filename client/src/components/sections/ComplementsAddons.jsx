import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Gift, Check, Plus, Cake, Music, Sparkles, Crown, Heart, Camera } from "lucide-react"

const complimentaryItems = [
  {
    icon: Crown,
    title: "Exclusive Hall Access",
    description: "60 minutes of private venue access",
    included: true,
  },
  {
    icon: Sparkles,
    title: "Elegant Decorations",
    description: "Beautiful themed decorations based on your selected plan",
    included: true,
  },
  {
    icon: Cake,
    title: "Celebration Cake",
    description: "1/2 kg complimentary cake (free with all bookings)",
    included: true,
  },
  {
    icon: Music,
    title: "Audio System",
    description: "Professional audio setup with Bluetooth connectivity",
    included: true,
  },
]

const addOns = [
  {
    id: "extra-cake-1kg",
    icon: Cake,
    title: "Extra Cake - 1kg",
    price: "₹800",
    description: "Additional 1kg celebration cake (complimentary 1/2kg still included)",
    category: "Cakes",
  },
  {
    id: "extra-cake-2kg",
    icon: Cake,
    title: "Extra Cake - 2kg",
    price: "₹1,500",
    description: "Additional 2kg celebration cake",
    category: "Cakes",
  },
  {
    id: "private-upgrade",
    icon: Crown,
    title: "Private Hall Upgrade",
    price: "₹2,000",
    description: "Extended privacy with additional decorative elements",
    category: "Upgrades",
  },
  {
    id: "custom-decorations",
    icon: Sparkles,
    title: "Custom Decorations",
    price: "₹1,000 - ₹3,000",
    description: "Personalized decorations beyond your package theme",
    category: "Decorations",
  },
  {
    id: "photo-booth",
    icon: Camera,
    title: "Photo Booth Setup",
    price: "₹1,500",
    description: "Professional photo booth with props and backdrop",
    category: "Entertainment",
  },
  {
    id: "snacks-platter",
    icon: Heart,
    title: "Snacks Platter",
    price: "₹500 - ₹1,200",
    description: "Assorted snacks and appetizers for your guests",
    category: "Food",
  },
]

const categories = [...new Set(addOns.map((item) => item.category))]

export const ComplementsAddons = () => {
  return (
    <div className="space-y-12 p-8">
      <div className="text-center space-y-6">
        <h1
          className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent leading-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          What's Included & Available
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Everything you need for the perfect celebration, with options to enhance your experience
        </p>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-400/30 flex items-center justify-center">
            <Check className="h-8 w-8 text-orange-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
              Complimentary (All Inclusive)
            </h2>
            <p className="text-muted-foreground text-lg">Included with every booking at no extra cost</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {complimentaryItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Card
                key={index}
                className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-orange-500/20 hover:border-orange-500/40 group"
              >
                <CardHeader className="pb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-400/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-orange-500" />
                  </div>
                  <CardTitle className="text-xl" style={{ fontFamily: "Playfair Display, serif" }}>
                    {item.title}
                  </CardTitle>
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg">
                    FREE
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-orange-500 to-orange-400" />
              </Card>
            )
          })}
        </div>
      </div>

      <Separator className="my-12 bg-orange-500/20" />

      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-500/20 flex items-center justify-center">
            <Plus className="h-8 w-8 text-orange-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold" style={{ fontFamily: "Playfair Display, serif" }}>
              Chargeable Add-ons
            </h2>
            <p className="text-muted-foreground text-lg">Enhance your celebration with these premium options</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-400/10 to-orange-500/10 rounded-xl p-6 border border-orange-400/20">
          <div className="flex items-start gap-4">
            <Cake className="h-6 w-6 text-orange-400 mt-1 flex-shrink-0" />
            <div>
              <h4
                className="font-semibold text-orange-400 mb-2 text-lg"
                style={{ fontFamily: "Playfair Display, serif" }}
              >
                Special Cake Policy
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                If you order 1kg or more additional cake, the complimentary 1/2kg cake is automatically included at no
                extra cost.
              </p>
            </div>
          </div>
        </div>

        {categories.map((category) => (
          <div key={category} className="space-y-6">
            <h3 className="text-2xl font-semibold text-orange-500" style={{ fontFamily: "Playfair Display, serif" }}>
              {category}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {addOns
                .filter((item) => item.category === category)
                .map((item) => {
                  const Icon = item.icon
                  return (
                    <Card
                      key={item.id}
                      className="shadow-lg hover:shadow-2xl transition-all duration-300 border-border hover:border-orange-500/30 group"
                    >
                      <CardHeader className="pb-6">
                        <div className="flex items-start justify-between">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400/20 to-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-8 w-8 text-orange-500" />
                          </div>
                          <Badge
                            variant="outline"
                            className="text-orange-500 border-orange-500/30 bg-orange-500/5 font-semibold"
                          >
                            {item.price}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl" style={{ fontFamily: "Playfair Display, serif" }}>
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-all duration-300 bg-transparent"
                        >
                          Add to Booking
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-500/10 rounded-3xl p-10 border border-orange-500/20">
        <Gift className="h-16 w-16 text-orange-500 mx-auto mb-6" />
        <h3 className="text-3xl font-semibold mb-4 text-foreground" style={{ fontFamily: "Playfair Display, serif" }}>
          Need Something Special?
        </h3>
        <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-2xl mx-auto">
          Have a specific request or need a custom package? We're here to make your celebration perfect!
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 text-lg"
        >
          Contact Us for Custom Options
        </Button>
      </div>
    </div>
  )
}