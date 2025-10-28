// Enhanced data processing utilities for booking system
// Provides robust JSON parsing and data validation

export interface BookingAddon {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  customText?: string;
}

export interface BalloonColor {
  id: string;
  name: string;
  hex_code: string;
}

// Safe JSON parsing with type checking
export const safeParseJSON = <T = any>(data: any, fallback: T = [] as T): T => {
  if (!data) return fallback;
  
  // Already correct type
  if (Array.isArray(data) && Array.isArray(fallback)) return data as T;
  if (typeof data === 'object' && !Array.isArray(data) && typeof fallback === 'object' && !Array.isArray(fallback)) {
    return data as T;
  }
  
  // String parsing
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return parsed ?? fallback;
    } catch (error) {
      console.warn('Failed to parse JSON string:', data, error);
      return fallback;
    }
  }
  
  return fallback;
};

// Extract add-ons from various data formats
export const extractAddons = (selectedAddonsData: any): BookingAddon[] => {
  if (!selectedAddonsData) return [];
  
  // Direct array format
  if (Array.isArray(selectedAddonsData)) {
    return selectedAddonsData.filter(addon => 
      addon && typeof addon === 'object' && addon.name
    );
  }
  
  // Object with addons property
  if (typeof selectedAddonsData === 'object' && selectedAddonsData.addons) {
    const addons = selectedAddonsData.addons;
    if (Array.isArray(addons)) {
      return addons.filter(addon => 
        addon && typeof addon === 'object' && addon.name
      );
    }
  }
  
  // String format - try to parse
  if (typeof selectedAddonsData === 'string') {
    try {
      const parsed = JSON.parse(selectedAddonsData);
      if (Array.isArray(parsed)) {
        return parsed.filter(addon => 
          addon && typeof addon === 'object' && addon.name
        );
      }
      if (parsed && parsed.addons && Array.isArray(parsed.addons)) {
        return parsed.addons.filter(addon => 
          addon && typeof addon === 'object' && addon.name
        );
      }
    } catch (error) {
      console.warn('Failed to parse addons string:', selectedAddonsData, error);
    }
  }
  
  return [];
};

// Extract photo URLs from various sources
export const extractPhotoUrls = (...sources: any[]): string[] => {
  const allUrls: string[] = [];
  
  sources.forEach(source => {
    const urls = safeParseJSON<string[]>(source, []);
    if (Array.isArray(urls)) {
      urls.forEach(url => {
        if (typeof url === 'string' && url.trim()) {
          allUrls.push(url.trim());
        }
      });
    }
  });
  
  // Remove duplicates and return
  return [...new Set(allUrls)];
};

// Validate booking data structure
export const validateBookingData = (booking: any): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Required fields
  if (!booking.id) errors.push('Missing booking ID');
  if (!booking.applicant_name) errors.push('Missing applicant name');
  if (!booking.event_date) errors.push('Missing event date');
  
  // Data type validation
  if (booking.selected_addons && !Array.isArray(booking.selected_addons)) {
    warnings.push('selected_addons is not an array');
  }
  
  if (booking.balloon_colors && !Array.isArray(booking.balloon_colors)) {
    warnings.push('balloon_colors is not an array');
  }
  
  if (booking.uploaded_image_urls && !Array.isArray(booking.uploaded_image_urls)) {
    warnings.push('uploaded_image_urls is not an array');
  }
  
  if (booking.hanging_photos_urls && !Array.isArray(booking.hanging_photos_urls)) {
    warnings.push('hanging_photos_urls is not an array');
  }
  
  // Numeric validation
  if (booking.total_amount && typeof booking.total_amount !== 'number') {
    warnings.push('total_amount is not a number');
  }
  
  if (booking.advance_paid && typeof booking.advance_paid !== 'number') {
    warnings.push('advance_paid is not a number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Format currency for display
export const formatCurrency = (amount: number | string | null | undefined): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (!numAmount || isNaN(numAmount)) return '₹0';
  return `₹${numAmount.toLocaleString()}`;
};

// Calculate add-ons total
export const calculateAddonsTotal = (addons: BookingAddon[]): number => {
  return addons.reduce((total, addon) => {
    const price = typeof addon.price === 'number' ? addon.price : 0;
    const quantity = typeof addon.quantity === 'number' ? addon.quantity : 1;
    return total + (price * quantity);
  }, 0);
};

// Safely get nested object property
export const safeGet = (obj: any, path: string, fallback: any = null): any => {
  try {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : fallback;
    }, obj);
  } catch {
    return fallback;
  }
};