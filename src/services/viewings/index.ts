
import { PropertyViewing } from "@/types/PropertyViewing";
import { v4 as uuid } from "uuid";

// Simulated local storage for viewings
const VIEWINGS_STORAGE_KEY = 'property_viewings';

// Helper functions
const getStoredViewings = (): PropertyViewing[] => {
  const viewings = localStorage.getItem(VIEWINGS_STORAGE_KEY);
  return viewings ? JSON.parse(viewings) : [];
};

const storeViewings = (viewings: PropertyViewing[]) => {
  localStorage.setItem(VIEWINGS_STORAGE_KEY, JSON.stringify(viewings));
};

// Service methods
export const viewingsService = {
  getViewings: async (propertyId: string): Promise<PropertyViewing[]> => {
    const viewings = getStoredViewings();
    return viewings.filter(viewing => viewing.propertyId === propertyId);
  },
  
  getAllViewings: async (): Promise<PropertyViewing[]> => {
    return getStoredViewings();
  },
  
  addViewing: async (viewing: Omit<PropertyViewing, 'id'>): Promise<PropertyViewing> => {
    const viewings = getStoredViewings();
    const newViewing: PropertyViewing = {
      ...viewing,
      id: uuid()
    };
    
    storeViewings([...viewings, newViewing]);
    return newViewing;
  },
  
  updateViewing: async (viewingId: string, updates: Partial<PropertyViewing>): Promise<PropertyViewing> => {
    const viewings = getStoredViewings();
    const viewingIndex = viewings.findIndex(viewing => viewing.id === viewingId);
    
    if (viewingIndex === -1) {
      throw new Error('Viewing not found');
    }
    
    const updatedViewing = {
      ...viewings[viewingIndex],
      ...updates
    };
    
    viewings[viewingIndex] = updatedViewing;
    storeViewings(viewings);
    
    return updatedViewing;
  },
  
  deleteViewing: async (viewingId: string): Promise<void> => {
    const viewings = getStoredViewings();
    const filteredViewings = viewings.filter(viewing => viewing.id !== viewingId);
    storeViewings(filteredViewings);
  }
};
