
import { create } from 'zustand';
import { Property, INITIAL_PROPERTIES } from '../types/Property';

interface PropertyState {
  properties: Property[];
  filteredProperties: Property[];
  filters: {
    minPrice: number | null;
    maxPrice: number | null;
    minBedrooms: number | null;
    minBathrooms: number | null;
    status: string | null;
    favorite: boolean | null;
  };
  addProperty: (property: Omit<Property, 'id' | 'dateAdded'>) => void;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
  toggleFavorite: (id: string) => void;
  setFilters: (filters: Partial<PropertyState['filters']>) => void;
  resetFilters: () => void;
  getProperty: (id: string) => Property | undefined;
}

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: INITIAL_PROPERTIES,
  filteredProperties: INITIAL_PROPERTIES,
  filters: {
    minPrice: null,
    maxPrice: null,
    minBedrooms: null,
    minBathrooms: null,
    status: null,
    favorite: null,
  },
  
  addProperty: (property) => {
    const newProperty: Property = {
      ...property,
      id: Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString(),
    };
    
    set((state) => {
      const properties = [...state.properties, newProperty];
      return { 
        properties,
        filteredProperties: applyFilters(properties, state.filters)
      };
    });
  },
  
  updateProperty: (id, updates) => {
    set((state) => {
      const properties = state.properties.map(property => 
        property.id === id ? { ...property, ...updates } : property
      );
      return { 
        properties,
        filteredProperties: applyFilters(properties, state.filters)
      };
    });
  },
  
  deleteProperty: (id) => {
    set((state) => {
      const properties = state.properties.filter(property => property.id !== id);
      return { 
        properties,
        filteredProperties: applyFilters(properties, state.filters)
      };
    });
  },
  
  toggleFavorite: (id) => {
    set((state) => {
      const properties = state.properties.map(property => 
        property.id === id 
          ? { ...property, favorite: !property.favorite } 
          : property
      );
      return { 
        properties,
        filteredProperties: applyFilters(properties, state.filters)
      };
    });
  },
  
  setFilters: (newFilters) => {
    set((state) => {
      const filters = { ...state.filters, ...newFilters };
      return { 
        filters,
        filteredProperties: applyFilters(state.properties, filters)
      };
    });
  },
  
  resetFilters: () => {
    set((state) => ({
      filters: {
        minPrice: null,
        maxPrice: null,
        minBedrooms: null,
        minBathrooms: null,
        status: null,
        favorite: null,
      },
      filteredProperties: state.properties
    }));
  },
  
  getProperty: (id) => {
    return get().properties.find(property => property.id === id);
  }
}));

// Helper function to apply filters
const applyFilters = (properties: Property[], filters: PropertyState['filters']) => {
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
    
    return true;
  });
};
