
import { create } from 'zustand';
import { Property } from '@/types/Property';
import { propertyService } from '@/services/property';
import { PropertyState, PropertyFilters } from './types';
import { applyFilters } from './filterUtils';

// Default filters state
const defaultFilters: PropertyFilters = {
  minPrice: null,
  maxPrice: null,
  minBedrooms: null,
  minBathrooms: null,
  status: null,
  favorite: null,
  propertyType: null,
  propertySubtype: null,
};

export const usePropertyStore = create<PropertyState>((set, get) => ({
  properties: [],
  filteredProperties: [],
  isLoading: false,
  error: null,
  filters: defaultFilters,
  
  fetchProperties: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const properties = await propertyService.getProperties();
      set({ 
        properties,
        filteredProperties: applyFilters(properties, get().filters),
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching properties:", error);
      set({ 
        error: "Failed to load properties. Please try again later.", 
        isLoading: false 
      });
    }
  },
  
  addProperty: async (property) => {
    set({ isLoading: true, error: null });
    
    try {
      const newProperty = await propertyService.createProperty(property);
      
      set((state) => {
        const properties = [...state.properties, newProperty];
        return { 
          properties,
          filteredProperties: applyFilters(properties, state.filters),
          isLoading: false
        };
      });
      
      return newProperty;
    } catch (error) {
      console.error("Error adding property:", error);
      set({ 
        error: "Failed to add property. Please try again later.", 
        isLoading: false 
      });
      throw error;
    }
  },
  
  updateProperty: async (id, updates) => {
    set({ isLoading: true, error: null });
    
    try {
      await propertyService.updateProperty(id, updates);
      
      set((state) => {
        const properties = state.properties.map(property => 
          property.id === id ? { ...property, ...updates } : property
        );
        
        return { 
          properties,
          filteredProperties: applyFilters(properties, state.filters),
          isLoading: false
        };
      });
    } catch (error) {
      console.error("Error updating property:", error);
      set({ 
        error: "Failed to update property. Please try again later.", 
        isLoading: false 
      });
      throw error;
    }
  },
  
  deleteProperty: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await propertyService.deleteProperty(id);
      
      set((state) => {
        const properties = state.properties.filter(property => property.id !== id);
        return { 
          properties,
          filteredProperties: applyFilters(properties, state.filters),
          isLoading: false
        };
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      set({ 
        error: "Failed to delete property. Please try again later.", 
        isLoading: false 
      });
      throw error;
    }
  },
  
  toggleFavorite: async (id) => {
    try {
      const property = get().properties.find(p => p.id === id);
      if (!property) return;
      
      // Optimistically update the UI
      set((state) => {
        const properties = state.properties.map(property => 
          property.id === id 
            ? { ...property, favorite: !property.favorite } 
            : property
        );
        
        return { 
          properties,
          filteredProperties: applyFilters(properties, state.filters),
        };
      });
      
      // Then update in the database
      await propertyService.toggleFavorite(id, property.favorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
      
      // Revert the optimistic update
      set((state) => {
        const properties = state.properties.map(property => 
          property.id === id 
            ? { ...property, favorite: !property.favorite } 
            : property
        );
        
        return { 
          properties,
          filteredProperties: applyFilters(properties, state.filters),
          error: "Failed to update favorite status. Please try again.",
        };
      });
    }
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
      filters: defaultFilters,
      filteredProperties: state.properties
    }));
  },
  
  getProperty: (id) => {
    return get().properties.find(property => property.id === id);
  }
}));
