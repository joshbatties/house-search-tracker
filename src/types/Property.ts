
export interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  imageUrl: string;
  listingUrl: string;
  latitude: number;
  longitude: number;
  dateAdded: string;
  notes: string;
  favorite: boolean;
  status: 'interested' | 'viewed' | 'applied' | 'rejected' | 'accepted';
  propertyType: 'rent' | 'buy';
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  amenities: string[];
  positiveFeatures: string[];
  negativeFeatures: string[];
}

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Modern Downtown Apartment",
    description: "Beautiful apartment in the heart of downtown with amazing views and modern finishes.",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    price: 2800,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1050,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=860&q=80",
    listingUrl: "https://example.com/listing1",
    latitude: 37.7749,
    longitude: -122.4194,
    dateAdded: "2023-09-15T08:00:00.000Z",
    notes: "Great location near public transportation and restaurants",
    favorite: true,
    status: "viewed",
    propertyType: "rent",
    contactName: "John Smith",
    contactPhone: "415-555-1234",
    contactEmail: "john@example.com",
    amenities: ["In-unit Laundry", "Dishwasher", "Parking", "Gym", "Roof Deck"],
    positiveFeatures: ["Close to public transit", "Modern appliances", "Large windows"],
    negativeFeatures: ["Street noise", "Small closets"]
  },
  {
    id: "p2",
    title: "Cozy Garden Studio",
    description: "Charming studio with private garden entrance, recently renovated.",
    address: "456 Oak Avenue",
    city: "Berkeley",
    state: "CA",
    zipCode: "94703",
    price: 1850,
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 550,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=860&q=80",
    listingUrl: "https://example.com/listing2",
    latitude: 37.8715,
    longitude: -122.2730,
    dateAdded: "2023-09-10T15:30:00.000Z",
    notes: "Quiet neighborhood, close to campus",
    favorite: false,
    status: "interested",
    propertyType: "rent",
    contactName: "Sarah Johnson",
    contactPhone: "510-555-6789",
    contactEmail: "sarah@example.com",
    amenities: ["Garden Access", "Utilities Included", "Pet Friendly"],
    positiveFeatures: ["Private entrance", "Quiet area", "Garden access"],
    negativeFeatures: ["Limited kitchen space", "No parking"]
  },
  {
    id: "p3",
    title: "Luxury High-Rise Condo",
    description: "Spectacular high-rise condo with panoramic bay views and high-end finishes.",
    address: "789 Market Street, Unit 2501",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    price: 4500,
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 1800,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=860&q=80",
    listingUrl: "https://example.com/listing3",
    latitude: 37.7837,
    longitude: -122.4090,
    dateAdded: "2023-09-05T12:15:00.000Z",
    notes: "24/7 doorman, amazing amenities, 1-year lease minimum",
    favorite: true,
    status: "applied",
    propertyType: "buy",
    contactName: "Michael Chen",
    contactPhone: "415-555-9876",
    contactEmail: "michael@example.com",
    amenities: ["Concierge", "Pool", "Hot Tub", "Fitness Center", "Theater Room", "Pet Spa"],
    positiveFeatures: ["Amazing views", "High-end finishes", "Great amenities"],
    negativeFeatures: ["High HOA fees", "Minimum lease term"]
  }
];
