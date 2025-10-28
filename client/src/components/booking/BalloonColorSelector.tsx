import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BalloonColor {
  id: string;
  name: string;
  hex_code: string;
  is_suggested: boolean;
  sort_order: number;
  color_type?: 'standard' | 'chrome'; // Make optional for backward compatibility
  available_plans?: string[]; // Make optional for backward compatibility
}

interface BalloonColorSelectorProps {
  selectedColors: string[];
  onColorsChange: (colors: string[]) => void;
  balloonImage?: string;
  selectedPlan?: string; // Add selected plan prop
}

export const BalloonColorSelector = ({ 
  selectedColors, 
  onColorsChange, 
  balloonImage = "/image (12).jpg",
  selectedPlan = "basic" // Default to basic plan
}: BalloonColorSelectorProps) => {
  const [colors, setColors] = useState<BalloonColor[]>([]);
  const [currentBalloonImage, setCurrentBalloonImage] = useState(balloonImage);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBalloonColors();
  }, []);

  useEffect(() => {
    // Update balloon image based on selected colors
    if (selectedColors.length > 0) {
      // In a real implementation, you would have different balloon images for different colors
      // For now, we'll just show the default image
      setCurrentBalloonImage(balloonImage);
    }
  }, [selectedColors, balloonImage]);

  const fetchBalloonColors = async () => {
    try {
      const { data, error } = await supabase
        .from('balloon_colors')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      // Add default values for new fields if they don't exist
      const processedData = (data || []).map((color: any) => ({
        ...color,
        color_type: (color.color_type as 'standard' | 'chrome') || 'standard',
        available_plans: color.available_plans || ['basic', 'elite', 'premium']
      }));
      setColors(processedData);
    } catch (error) {
      console.error('Error fetching balloon colors:', error);
      // Fallback colors if database fetch fails
      const standardColors = [
        { id: '1', name: 'Red', hex_code: '#FF0000', is_suggested: true, sort_order: 1, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '2', name: 'Blue', hex_code: '#0000FF', is_suggested: true, sort_order: 2, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '3', name: 'Dark Blue', hex_code: '#000080', is_suggested: true, sort_order: 3, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '4', name: 'Peach', hex_code: '#FFCBA4', is_suggested: true, sort_order: 4, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '5', name: 'Yellow', hex_code: '#FFFF00', is_suggested: true, sort_order: 5, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '6', name: 'Light Yellow', hex_code: '#FFFFE0', is_suggested: true, sort_order: 6, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '7', name: 'Black', hex_code: '#000000', is_suggested: true, sort_order: 7, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '8', name: 'Light Green', hex_code: '#90EE90', is_suggested: true, sort_order: 8, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '9', name: 'Dark Green', hex_code: '#006400', is_suggested: true, sort_order: 9, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '10', name: 'Sandal', hex_code: '#F4A460', is_suggested: true, sort_order: 10, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '11', name: 'White', hex_code: '#FFFFFF', is_suggested: true, sort_order: 11, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '12', name: 'Metallic White', hex_code: '#F8F8FF', is_suggested: true, sort_order: 12, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '13', name: 'Lavender', hex_code: '#E6E6FA', is_suggested: true, sort_order: 13, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '14', name: 'Purple', hex_code: '#800080', is_suggested: true, sort_order: 14, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '15', name: 'Dark Purple', hex_code: '#4B0082', is_suggested: true, sort_order: 15, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '16', name: 'Metallic Gold', hex_code: '#D4AF37', is_suggested: true, sort_order: 16, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '17', name: 'Ash', hex_code: '#B2BEB5', is_suggested: true, sort_order: 17, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '18', name: 'Light Pink', hex_code: '#FFB6C1', is_suggested: true, sort_order: 18, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '19', name: 'Dark Pink', hex_code: '#C71585', is_suggested: true, sort_order: 19, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '20', name: 'Brown', hex_code: '#A52A2A', is_suggested: true, sort_order: 20, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '21', name: 'Light Brown', hex_code: '#D2B48C', is_suggested: true, sort_order: 21, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '22', name: 'Orange', hex_code: '#FFA500', is_suggested: true, sort_order: 22, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] },
        { id: '23', name: 'Gray', hex_code: '#808080', is_suggested: true, sort_order: 23, color_type: 'standard' as const, available_plans: ['basic', 'elite', 'premium'] }
      ];
      
      const chromeColors = [
        { id: 'c1', name: 'Chrome Blue', hex_code: '#4169E1', is_suggested: true, sort_order: 24, color_type: 'chrome' as const, available_plans: ['elite', 'premium'] },
        { id: 'c2', name: 'Chrome Green', hex_code: '#32CD32', is_suggested: true, sort_order: 25, color_type: 'chrome' as const, available_plans: ['elite', 'premium'] },
        { id: 'c3', name: 'Chrome Silver', hex_code: '#C0C0C0', is_suggested: true, sort_order: 26, color_type: 'chrome' as const, available_plans: ['elite', 'premium'] },
        { id: 'c4', name: 'Chrome Rose Gold', hex_code: '#E8B4A0', is_suggested: true, sort_order: 27, color_type: 'chrome' as const, available_plans: ['elite', 'premium'] },
        { id: 'c5', name: 'Chrome Purple', hex_code: '#9370DB', is_suggested: true, sort_order: 28, color_type: 'chrome' as const, available_plans: ['elite', 'premium'] }
      ];
      
      setColors([...standardColors, ...chromeColors]);
    } finally {
      setLoading(false);
    }
  };

  const handleColorSelect = (colorId: string) => {
    const isSelected = selectedColors.includes(colorId);
    
    if (isSelected) {
      // Remove color
      onColorsChange(selectedColors.filter(id => id !== colorId));
    } else {
      // Add color (limit to 3 selections)
      if (selectedColors.length < 3) {
        onColorsChange([...selectedColors, colorId]);
      }
    }
  };

  // Filter colors based on selected plan and color type
  const availableColors = colors.filter(color => 
    color.available_plans?.includes(selectedPlan.toLowerCase()) || 
    (!color.available_plans && color.color_type === 'standard') // Fallback for colors without available_plans
  );
  
  const standardColors = availableColors.filter(color => 
    color.color_type === 'standard' || !color.color_type // Fallback for colors without color_type
  );
  
  const chromeColors = availableColors.filter(color => color.color_type === 'chrome');
  
  const suggestedStandardColors = standardColors.filter(color => color.is_suggested);
  const otherStandardColors = standardColors.filter(color => !color.is_suggested);
  const suggestedChromeColors = chromeColors.filter(color => color.is_suggested);
  const otherChromeColors = chromeColors.filter(color => !color.is_suggested);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Balloon Colors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-48 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-10 h-10 bg-muted rounded-full"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5 text-orange" />
          Balloon Color Customization
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Select up to 3 colors for your balloon arrangement
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balloon Preview */}
        <div className="relative">
          <img 
            src={currentBalloonImage} 
            alt="Balloon arrangement preview"
            className="w-full h-48 object-cover rounded-lg border"
            onError={(e) => {
              e.currentTarget.src = "/image (12).jpg";
            }}
          />
          {selectedColors.length > 0 && (
            <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
              <div className="flex gap-1">
                {selectedColors.map((colorId) => {
                  const color = colors.find(c => c.id === colorId);
                  return color ? (
                    <div
                      key={colorId}
                      className="w-5 h-5 rounded-full border-2 border-white shadow-md ring-1 ring-black/10"
                      style={{ backgroundColor: color.hex_code }}
                      title={color.name}
                    />
                  ) : (
                    <div
                      key={colorId}
                      className="w-5 h-5 rounded-full border-2 border-gray-300 bg-gray-200"
                      title="Unknown color"
                    />
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-center">
                {selectedColors.length}/3
              </p>
            </div>
          )}
        </div>

        {/* Selected Colors Display */}
        {selectedColors.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Selected Colors:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedColors.map((colorId) => {
                const color = colors.find(c => c.id === colorId);
                return color ? (
                  <Badge 
                    key={colorId} 
                    variant="secondary" 
                    className="flex items-center gap-2 px-3 py-1"
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color.hex_code }}
                    />
                    {color.name}
                    {color.color_type === 'chrome' && (
                      <span className="text-xs bg-orange/20 text-orange px-1 rounded">Chrome</span>
                    )}
                  </Badge>
                ) : (
                  <Badge key={colorId} variant="outline" className="opacity-50">
                    Color {colorId}
                  </Badge>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedColors.length}/{3} colors selected
            </p>
          </div>
        )}

        {/* Plan Information */}
        <div className="p-3 bg-muted/30 rounded-lg border">
          <p className="text-sm font-medium">Current Plan: <span className="capitalize">{selectedPlan}</span></p>
          <p className="text-xs text-muted-foreground mt-1">
            {selectedPlan.toLowerCase() === 'basic' 
              ? 'Standard colors available'
              : 'Standard colors + Chrome colors available'
            }
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Total loaded: {colors.length} colors | Standard: {standardColors.length} | Chrome: {chromeColors.length}
          </p>
        </div>

        {/* Standard Colors */}
        {suggestedStandardColors.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              Standard Colors ({suggestedStandardColors.length} colors)
            </h4>
            <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {suggestedStandardColors.map((color) => {
                const isSelected = selectedColors.includes(color.id);
                const isDisabled = !isSelected && selectedColors.length >= 3;
                
                return (
                  <Button
                    key={color.id}
                    variant="ghost"
                    size="sm"
                    className={`w-10 h-10 p-0 rounded-full border-2 transition-all ${
                      isSelected 
                        ? 'border-orange ring-2 ring-orange/50 scale-110' 
                        : 'border-muted hover:border-orange/50'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: color.hex_code }}
                    onClick={() => !isDisabled && handleColorSelect(color.id)}
                    disabled={isDisabled}
                    title={`${color.name} ${isSelected ? '(Selected)' : ''}`}
                  >
                    {isSelected && (
                      <Check className="h-4 w-4 text-white drop-shadow-lg" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Chrome Colors - Only for Elite and Premium */}
        {(selectedPlan.toLowerCase() === 'elite' || selectedPlan.toLowerCase() === 'premium') && suggestedChromeColors.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                Chrome Colors
                <Badge variant="outline" className="text-xs">Elite & Premium Only</Badge>
              </h4>
            </div>
            <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
              {suggestedChromeColors.map((color) => {
                const isSelected = selectedColors.includes(color.id);
                const isDisabled = !isSelected && selectedColors.length >= 3;
                
                return (
                  <Button
                    key={color.id}
                    variant="ghost"
                    size="sm"
                    className={`w-12 h-12 p-0 rounded-full border-2 transition-all relative ${
                      isSelected 
                        ? 'border-orange ring-2 ring-orange/50 scale-110' 
                        : 'border-muted hover:border-orange/50'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: color.hex_code }}
                    onClick={() => !isDisabled && handleColorSelect(color.id)}
                    disabled={isDisabled}
                    title={`${color.name} ${isSelected ? '(Selected)' : ''}`}
                  >
                    {/* Chrome effect overlay */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 to-transparent pointer-events-none"></div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-white drop-shadow-lg relative z-10" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Standard Colors */}
        {otherStandardColors.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">More Standard Colors ({otherStandardColors.length} colors):</h4>
            <div className="grid grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
              {otherStandardColors.map((color) => {
                const isSelected = selectedColors.includes(color.id);
                const isDisabled = !isSelected && selectedColors.length >= 3;
                
                return (
                  <Button
                    key={color.id}
                    variant="ghost"
                    size="sm"
                    className={`w-10 h-10 p-0 rounded-full border-2 transition-all ${
                      isSelected 
                        ? 'border-orange ring-2 ring-orange/50 scale-110' 
                        : 'border-muted hover:border-orange/50'
                    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: color.hex_code }}
                    onClick={() => !isDisabled && handleColorSelect(color.id)}
                    disabled={isDisabled}
                    title={`${color.name} ${isSelected ? '(Selected)' : ''}`}
                  >
                    {isSelected && (
                      <Check className="h-4 w-4 text-white drop-shadow-lg" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}

        {selectedColors.length >= 3 && (
          <div className="p-3 bg-orange/10 rounded-lg border border-orange/20">
            <p className="text-sm text-orange-dark">
              Maximum 3 colors selected. Remove a color to select a different one.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
