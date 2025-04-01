
import { Property } from '@/types/Property';

export interface PropertyFilters {
  minPrice: number | null;
  maxPrice: number | null;
  minBedrooms: number | null;
  minBathrooms: number | null;
  status: string | null;
  favorite: boolean | null;
  propertyType: 'rent' | 'buy' | null;
  propertySubtype: 'apartment' | 'house' | 'sharehouse' | 'condo' | 'townhouse' | null;
}

export interface PropertyState {
  properties: Property[];
  filteredProperties: Property[];
  filters: PropertyFilters;
  isLoading: boolean;
  error: string | null;
  addProperty: (property: Omit<Property, 'id' | 'dateAdded'>) => Promise<Property>;
  updateProperty: (id: string, updates: Partial<Property>) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  getProperty: (id: string) => Property | undefined;
  fetchProperties: () => Promise<void>;
}
