import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Lightbulb, Crown, Shirt, PartyPopper, Camera } from "lucide-react";

export const BookingPreview = ({ selectedAddOns, balloonColors, decoration, ageNumber }) => {
  const getPreviewIcon = (name) => {
    if (name.toLowerCase().includes('age light')) return Lightbulb;
    if (name.toLowerCase().includes('hanging') || name.toLowerCase().includes('photo')) return Camera;
    if (name.toLowerCase().includes('crown')) return Crown;
    if (name.toLowerCase().includes('sash')) return Shirt;
    if (name.toLowerCase().includes('popper')) return PartyPopper;
    return Eye;
  };

  const getPreviewImage = (name, customText) => {
    // Generate preview based on addon type
    if (name.toLowerCase().includes('age light') && (customText || ageNumber)) {
      return (
        <div className="w-full h-32 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
          <span className="text-4xl font-bold text-white">{customText || ageNumber}</span>
        </div>
      );
    }
    
    if (name.toLowerCase().includes('crown')) {
      return (
        <div className="w-full h-32 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
          <Crown className="w-16 h-16 text-white" />
        </div>
      );
    }
    
    if (name.toLowerCase().includes('sash')) {
      return (
        <div className="w-full h-32 bg-gradient-to-r from-pink-400 to-pink-600 rounded-lg flex items-center justify-center">
          <div className="text-white text-center">
            <Shirt className="w-12 h-12 mx-auto mb-2" />
            <span className="text-sm">Birthday Sash</span>
          </div>
        </div>
      );
    }
    
    if (name.toLowerCase().includes('popper')) {
      return (
        <div className="w-full h-32 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
          <PartyPopper className="w-16 h-16 text-white" />
        </div>
      );
    }
    
    if (name.toLowerCase().includes('hanging') || name.toLowerCase().includes('photo')) {
      return (
        <div className="w-full h-32 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
          <div className="text-white text-center">
            <Camera className="w-12 h-12 mx-auto mb-2" />
            <span className="text-sm">Photo Display</span>
          </div>
        </div>
      );
    }
    
    return (
      <div className="w-full h-32 bg-gradient-to-r from-gray-400 to-gray-600 rounded-lg flex items-center justify-center">
        <Eye className="w-16 h-16 text-white" />
      </div>
    );
  };

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-orange" />
          Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Decoration Preview */}
        {decoration && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Decoration</h4>
            <div className="relative">
              <img 
                src={decoration.src} 
                alt={decoration.name}
                className="w-full h-32 object-cover rounded-lg border-2 border-orange/20"
              />
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs p-1 rounded">
                {decoration.name}
              </div>
            </div>
          </div>
        )}

        {/* Balloon Colors Preview */}
        {balloonColors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Balloon Colors</h4>
            <div className="flex flex-wrap gap-2">
              {balloonColors.map((color, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons Preview */}
        {selectedAddOns.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Add-ons Preview</h4>
            <div className="space-y-3">
              {selectedAddOns.map((addon, index) => {
                const IconComponent = getPreviewIcon(addon.name);
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-orange" />
                        <span className="text-xs font-medium">{addon.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {addon.quantity}x
                      </Badge>
                    </div>
                    {getPreviewImage(addon.name, addon.customName)}
                    {addon.customName && (
                      <p className="text-xs text-center text-muted-foreground">
                        "{addon.customName}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Age Number Preview */}
        {ageNumber && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Age Display</h4>
            <div className="w-full h-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{ageNumber}</span>
            </div>
          </div>
        )}

        {selectedAddOns.length === 0 && !decoration && balloonColors.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select items to see preview</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
