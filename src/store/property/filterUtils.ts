
import { Property } from '@/types/Property';
import { PropertyFilters } from './types';

// Helper function to apply filters
export const applyFilters = (properties: Property[], filters: PropertyFilters) => {
  return properties.filter(property => {
    // Price filters
    if (filters.minPrice !== null && property.price < filters.minPrice) return false;
    if (filters.maxPrice !== null && property.price > filters.maxPrice) return false;
    
    // Bedroom filters
    if (filters.minBedrooms !== null && property.bedrooms < filters.minBedrooms) return false;
    
    // Bathroom filters
    if (filters.minBathrooms !== null && property.bathrooms < filters.minBathrooms) return false;
    
    // Status filter
    if (filters.status !== null && property.status !== filters.status) return false;
    
    // Favorite filter
    if (filters.favorite !== null && property.favorite !== filters.favorite) return false;
    
    // Property type filter
    if (filters.propertyType !== null && property.propertyType !== filters.propertyType) return false;
    
    // Property subtype filter
    if (filters.propertySubtype !== null && property.propertySubtype !== filters.propertySubtype) return false;
    
    return true;
  });
};
