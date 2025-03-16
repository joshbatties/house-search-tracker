
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/Property";
import { PropertyInput, mapDbPropertyToProperty } from "./types";

export async function createProperty(property: PropertyInput): Promise<Property> {
  // Get the current user or use anonymous ID
  const { data: { user } } = await supabase.auth.getUser();
  const anonymousId = localStorage.getItem("anonymousId");
  
  const userId = user ? user.id : anonymousId;
  
  if (!userId) {
    throw new Error("No user ID or anonymous ID available");
  }
  
  // Map our Property type to the database structure
  const { data, error } = await supabase
    .from('properties')
    .insert({
      user_id: userId,
      title: property.title,
      description: property.description,
      address: property.address,
      city: property.city,
      state: property.state,
      zipcode: property.zipCode,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      squarefeet: property.squareFeet,
      imageurl: property.imageUrl,
      listingurl: property.listingUrl,
      latitude: property.latitude,
      longitude: property.longitude,
      notes: property.notes,
      favorite: property.favorite,
      status: property.status,
      contactname: property.contactName,
      contactphone: property.contactPhone,
      contactemail: property.contactEmail,
      amenities: property.amenities,
      positivefeatures: property.positiveFeatures,
      negativefeatures: property.negativeFeatures,
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating property:", error);
    throw error;
  }
  
  return mapDbPropertyToProperty(data);
}
