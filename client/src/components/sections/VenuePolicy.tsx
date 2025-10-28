import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Users, ShieldCheck, XCircle, CheckCircle, Info } from "lucide-react"

export const VenuePolicy = () => {
  return (
    <div className="space-y-12 p-8">
      <div className="text-center space-y-6">
        <h1
          className="text-5xl md:text-6xl font-luxury font-bold bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 bg-clip-text text-transparent leading-tight"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Venue Policy & Terms
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Please review our policies to ensure a smooth and enjoyable experience for all guests
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Food & Beverage Policy */}
        <Card className="shadow-luxury hover:shadow-xl transition-luxury border-destructive/20 hover:border-destructive/40 group">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-destructive/20 to-destructive/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <CardTitle className="text-destructive text-2xl font-luxury">Food & Beverage Policy</CardTitle>
                <CardDescription className="text-base">Strictly enforced for quality assurance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-destructive/5 to-destructive/10 rounded-xl p-6 border border-destructive/20">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-luxury font-semibold text-destructive mb-3 text-lg">Prohibited Items</h4>
                  <ul className="text-sm space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                      Outside food or beverages of any kind
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                      External cakes or desserts
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                      Alcoholic beverages
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive"></div>
                      Home-cooked items
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
              <strong className="text-foreground">Reason:</strong> To maintain food safety standards and quality
              control, all food and beverages must be sourced through C3 Café.
            </div>
          </CardContent>
        </Card>

        {/* Timing & Duration */}
        <Card className="shadow-luxury hover:shadow-xl transition-luxury border-orange/20 hover:border-orange/40 group">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange/20 to-orange/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-8 w-8 text-orange" />
              </div>
              <div>
                <CardTitle className="text-2xl font-luxury">Timing & Duration</CardTitle>
                <CardDescription className="text-base">Schedule and time management</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-6 bg-gradient-to-br from-orange/10 to-gold/10 rounded-xl border border-orange/20">
                <div className="text-4xl font-luxury font-bold text-orange mb-2">60</div>
                <div className="text-sm text-muted-foreground">Minutes per slot</div>
              </div>
              <div className="text-center p-6 bg-gradient-to-br from-gold/10 to-orange/10 rounded-xl border border-gold/20">
                <div className="text-4xl font-luxury font-bold text-gold mb-2">15</div>
                <div className="text-sm text-muted-foreground">Minutes setup time</div>
              </div>
            </div>
            <div className="space-y-4 text-base">
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Available Hours:</span>
                <Badge variant="outline" className="border-orange text-orange">
                  11 AM - 11 PM
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <span className="font-medium">Advance Booking:</span>
                <Badge variant="outline" className="border-gold text-gold">
                  Minimum 24 hours
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guest Guidelines */}
        <Card className="shadow-luxury hover:shadow-xl transition-luxury border-gold/20 hover:border-gold/40 group">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/20 to-gold/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-gold" />
              </div>
              <div>
                <CardTitle className="text-2xl font-luxury">Guest Guidelines</CardTitle>
                <CardDescription className="text-base">Ensuring everyone has a great time</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Respectful behavior towards staff and property</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Keep noise levels considerate of other diners</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Follow decoration guidelines</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-destructive/5 rounded-lg">
                <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <span className="text-sm">No smoking inside the venue</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Safety & Security */}
        <Card className="shadow-luxury hover:shadow-xl transition-luxury border-primary/20 hover:border-primary/40 group">
          <CardHeader className="pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl font-luxury">Safety & Security</CardTitle>
                <CardDescription className="text-base">Your safety is our priority</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">CCTV monitoring for security</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Fire safety equipment available</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">First aid kit on premises</span>
              </div>
              <div className="flex items-center gap-4 p-3 bg-primary/5 rounded-lg">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm">Trained staff supervision</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-luxury border-primary/20">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center">
              <Info className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-luxury">Cancellation & Refund Policy</CardTitle>
              <CardDescription className="text-base">Important terms for booking modifications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
              <div className="text-4xl font-luxury font-bold text-primary mb-3">24+ Hours</div>
              <div className="text-sm text-muted-foreground">Full refund available</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange/10 to-orange/5 rounded-xl border border-orange/20">
              <div className="text-4xl font-luxury font-bold text-orange mb-3">12-24 Hours</div>
              <div className="text-sm text-muted-foreground">50% refund</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-destructive/10 to-destructive/5 rounded-xl border border-destructive/20">
              <div className="text-4xl font-luxury font-bold text-destructive mb-3">&lt; 12 Hours</div>
              <div className="text-sm text-muted-foreground">No refund</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center bg-gradient-to-br from-orange-500/10 via-orange-400/5 to-orange-500/10 rounded-3xl p-10 border border-orange-500/20">
        <h3 className="text-3xl font-semibold mb-4 text-foreground" style={{ fontFamily: "Playfair Display, serif" }}>
          Questions about our policies?
        </h3>
        <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
          Our team is here to help clarify any concerns you may have
        </p>
        <div className="text-2xl font-semibold text-orange-500" style={{ fontFamily: "Playfair Display, serif" }}>
          📞 8870005858 | 🌐 c3.cafe
        </div>
      </div>
    </div>
  )
}
