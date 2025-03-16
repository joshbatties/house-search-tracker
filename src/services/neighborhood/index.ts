
import { NeighborhoodAmenity, NeighborhoodData } from "@/types/NeighborhoodAmenity";

// Mock data for neighborhood amenities
const MOCK_AMENITIES: Record<string, NeighborhoodAmenity[]> = {
  // Default amenities that will be shown for any property
  default: [
    { id: 'a1', name: 'Local Grocery', type: 'grocery', distance: 0.4, rating: 4.2 },
    { id: 'a2', name: 'City Park', type: 'park', distance: 0.7, rating: 4.8 },
    { id: 'a3', name: 'Main St Station', type: 'transit', distance: 0.5, rating: 3.9 },
    { id: 'a4', name: 'Downtown Fitness', type: 'gym', distance: 0.8, rating: 4.5 },
    { id: 'a5', name: 'Community College', type: 'school', distance: 1.2, rating: 4.0 },
    { id: 'a6', name: 'Walgreens', type: 'pharmacy', distance: 0.3, rating: 3.7 },
    { id: 'a7', name: 'Pizza Place', type: 'restaurant', distance: 0.2, rating: 4.3 },
    { id: 'a8', name: 'Shopping Center', type: 'shopping', distance: 1.0, rating: 4.1 }
  ]
};

// Mock walk scores for demo purposes
const MOCK_WALK_SCORES: Record<string, { walkScore: number, transitScore: number }> = {
  default: { walkScore: 75, transitScore: 65 }
};

// Service methods
export const neighborhoodService = {
  getNeighborhoodData: async (propertyId: string, latitude?: number, longitude?: number): Promise<NeighborhoodData> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real implementation, we would use latitude and longitude to fetch real data
    // For now, return mock data
    return {
      propertyId,
      walkScore: MOCK_WALK_SCORES.default.walkScore,
      transitScore: MOCK_WALK_SCORES.default.transitScore,
      amenities: MOCK_AMENITIES.default.map(amenity => ({
        ...amenity,
        // Add slight randomization to make it feel more realistic
        distance: +(amenity.distance + (Math.random() * 0.4 - 0.2)).toFixed(1),
        rating: Math.min(5, +(amenity.rating + (Math.random() * 0.6 - 0.3)).toFixed(1))
      }))
    };
  }
};
