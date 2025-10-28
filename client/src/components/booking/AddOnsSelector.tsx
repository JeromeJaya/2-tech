import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Lightbulb, Crown, Shirt, PartyPopper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AddOn {
  id: string;
  name: string;
  price: number;
  max_quantity: number;
  requires_name: boolean;
  plan_restriction: string[] | null;
  description: string;
  image_url?: string;
}

interface SelectedAddOn {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customName?: string;
}

interface AddOnsSelectorProps {
  planType: string;
  selectedAddOns: SelectedAddOn[];
  onAddOnsChange: (addOns: SelectedAddOn[]) => void;
}

export const AddOnsSelector = ({ planType, selectedAddOns, onAddOnsChange }: AddOnsSelectorProps) => {
  const [availableAddOns, setAvailableAddOns] = useState<AddOn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddOns();
  }, [planType]);

  const fetchAddOns = async () => {
    try {
      const { data, error } = await supabase
        .from('addons')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      
      // Filter add-ons based on plan type
      const filteredAddOns = (data || []).filter(addon => 
        !addon.plan_restriction || 
        addon.plan_restriction.includes(planType)
      );
      
      setAvailableAddOns(filteredAddOns);
    } catch (error) {
      console.error('Error fetching add-ons:', error);
      // Fallback add-ons if database fetch fails
      const fallbackAddOns: AddOn[] = [
        { id: '1', name: 'Hanging Photos', price: 80, max_quantity: 9, requires_name: false, plan_restriction: null, description: 'Beautiful Hanging Photoss' },
        { id: '2', name: 'LED Light', price: 150, max_quantity: 5, requires_name: true, plan_restriction: null, description: 'Customizable LED lights' },
        { id: '3', name: 'Age Light', price: 150, max_quantity: 1, requires_name: false, plan_restriction: null, description: 'Special age number lighting' },
        { id: '4', name: 'Big Poppers', price: 100, max_quantity: 10, requires_name: false, plan_restriction: null, description: 'Celebration poppers' },
        { id: '5', name: 'Crown', price: 120, max_quantity: 1, requires_name: false, plan_restriction: ['basic'], description: 'Birthday crown' },
        { id: '6', name: 'Birthday Sash', price: 80, max_quantity: 1, requires_name: false, plan_restriction: null, description: 'Personalized sash' }
      ];
      
      const filteredFallback = fallbackAddOns.filter(addon => 
        !addon.plan_restriction || 
        addon.plan_restriction.includes(planType)
      );
      
      setAvailableAddOns(filteredFallback);
    } finally {
      setLoading(false);
    }
  };

  const getAddOnIcon = (name: string) => {
    if (name.toLowerCase().includes('light')) return Lightbulb;
    if (name.toLowerCase().includes('crown')) return Crown;
    if (name.toLowerCase().includes('sash')) return Shirt;
    if (name.toLowerCase().includes('popper')) return PartyPopper;
    return Lightbulb;
  };

  const getSelectedQuantity = (addOnId: string) => {
    const selected = selectedAddOns.find(item => item.id === addOnId);
    return selected ? selected.quantity : 0;
  };

  const getCustomName = (addOnId: string) => {
    const selected = selectedAddOns.find(item => item.id === addOnId);
    return selected ? selected.customName || '' : '';
  };

  const updateAddOn = (addOn: AddOn, quantity: number, customName?: string) => {
    const updatedAddOns = selectedAddOns.filter(item => item.id !== addOn.id);
    
    if (quantity > 0) {
      updatedAddOns.push({
        id: addOn.id,
        name: addOn.name,
        price: addOn.price,
        quantity,
        customName: addOn.requires_name ? customName : undefined
      });
    }
    
    onAddOnsChange(updatedAddOns);
  };

  const incrementQuantity = (addOn: AddOn) => {
    const currentQuantity = getSelectedQuantity(addOn.id);
    const customName = getCustomName(addOn.id);
    
    if (currentQuantity < addOn.max_quantity) {
      updateAddOn(addOn, currentQuantity + 1, customName);
    }
  };

  const decrementQuantity = (addOn: AddOn) => {
    const currentQuantity = getSelectedQuantity(addOn.id);
    const customName = getCustomName(addOn.id);
    
    if (currentQuantity > 0) {
      updateAddOn(addOn, currentQuantity - 1, customName);
    }
  };

  const updateCustomName = (addOn: AddOn, customName: string) => {
    const currentQuantity = getSelectedQuantity(addOn.id);
    updateAddOn(addOn, Math.max(currentQuantity, 1), customName);
  };

  const getTotalPrice = () => {
    return selectedAddOns.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getIncludedAddOns = () => {
    const included = [];
    if (planType === 'premium' || planType === 'elite') {
      included.push('Crown (returnable)', 'Popper (returnable)', 'Sash (returnable)');
    }
    return included;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add-ons & Extras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-32"></div>
                  <div className="h-3 bg-muted rounded w-24"></div>
                </div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const includedItems = getIncludedAddOns();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PartyPopper className="h-5 w-5 text-orange" />
          Add-ons & Extras
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enhance your celebration with these optional add-ons
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Included Items */}
        {includedItems.length > 0 && (
          <div className="p-4 bg-orange/10 rounded-lg border border-orange/20">
            <h4 className="font-medium text-orange-dark mb-2">Included in Your Plan:</h4>
            <div className="flex flex-wrap gap-2">
              {includedItems.map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-orange/20 text-orange-dark">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Available Add-ons */}
        <div className="space-y-4">
          {availableAddOns.map((addOn) => {
            const IconComponent = getAddOnIcon(addOn.name);
            const selectedQuantity = getSelectedQuantity(addOn.id);
            const customName = getCustomName(addOn.id);
            const isMaxReached = selectedQuantity >= addOn.max_quantity;

            return (
              <div key={addOn.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-orange" />
                    </div>
                    <div>
                      <h4 className="font-medium">{addOn.name}</h4>
                      <p className="text-sm text-muted-foreground">{addOn.description}</p>
                      <p className="text-sm font-medium text-orange">
                        ₹{addOn.price.toLocaleString()} each
                        {addOn.max_quantity > 1 && (
                          <span className="text-muted-foreground"> (max {addOn.max_quantity})</span>
                        )}
                      </p>
                      {addOn.requires_name && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          Requires Name
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => decrementQuantity(addOn)}
                      disabled={selectedQuantity === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{selectedQuantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => incrementQuantity(addOn)}
                      disabled={isMaxReached}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {addOn.requires_name && selectedQuantity > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor={`name-${addOn.id}`} className="text-sm">
                      {addOn.name.toLowerCase().includes('age') ? 'Age Number:' : `Custom Text for ${addOn.name}:`}
                    </Label>
                    <Input
                      id={`name-${addOn.id}`}
                      type={addOn.name.toLowerCase().includes('age') ? 'number' : 'text'}
                      value={customName}
                      onChange={(e) => updateCustomName(addOn, e.target.value)}
                      placeholder={addOn.name.toLowerCase().includes('age') ? 'Enter age' : 'Enter custom text'}
                      className="max-w-xs"
                    />
                  </div>
                )}

                {selectedQuantity > 0 && (
                  <div className="text-sm text-right text-orange font-medium">
                    Subtotal: ₹{(addOn.price * selectedQuantity).toLocaleString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add-ons Summary */}
        {selectedAddOns.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Add-ons Total:</span>
              <span className="text-orange">₹{getTotalPrice().toLocaleString()}</span>
            </div>
          </div>
        )}

        {planType === 'basic' && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Spray is not allowed in any plan for safety reasons.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};