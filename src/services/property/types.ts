
import { Property } from "@/types/Property";

export interface PropertyInput extends Omit<Property, "id" | "createdAt" | "updatedAt" | "dateAdded"> {}

// Utility function to map database property to our Property type
export function mapDbPropertyToProperty(data: any): Property {
  return {
    id: data.id,
    title: data.title,
    description: data.description || "",
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zipcode,
    price: Number(data.price),
    bedrooms: data.bedrooms,
    bathrooms: Number(data.bathrooms),
    squareFeet: data.squarefeet,
    imageUrl: data.imageurl || "",
    listingUrl: data.listingurl || "",
    latitude: Number(data.latitude || 0),
    longitude: Number(data.longitude || 0),
    dateAdded: data.dateadded,
    notes: data.notes || "",
    favorite: data.favorite || false,
    status: data.status as Property["status"],
    propertyType: data.propertytype || "rent",
    contactName: data.contactname,
    contactPhone: data.contactphone,
    contactEmail: data.contactemail,
    amenities: data.amenities || [],
    positiveFeatures: data.positivefeatures || [],
    negativeFeatures: data.negativefeatures || [],
  };
}
