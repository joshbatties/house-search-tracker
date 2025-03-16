
export interface NeighborhoodAmenity {
  id: string;
  name: string;
  type: 'grocery' | 'restaurant' | 'school' | 'park' | 'transit' | 'gym' | 'pharmacy' | 'hospital' | 'shopping';
  distance: number; // in miles
  address?: string;
  rating?: number;
}

export interface NeighborhoodData {
  propertyId: string;
  walkScore?: number;
  transitScore?: number;
  amenities: NeighborhoodAmenity[];
}
