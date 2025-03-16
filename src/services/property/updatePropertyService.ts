
import { supabase } from "@/integrations/supabase/client";
import { PropertyInput } from "./types";

export async function updateProperty(id: string, updates: Partial<PropertyInput>): Promise<void> {
  // Map our Property type to the database structure
  const dbUpdates: Record<string, any> = {};
  
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.address !== undefined) dbUpdates.address = updates.address;
  if (updates.city !== undefined) dbUpdates.city = updates.city;
  if (updates.state !== undefined) dbUpdates.state = updates.state;
  if (updates.zipCode !== undefined) dbUpdates.zipcode = updates.zipCode;
  if (updates.price !== undefined) dbUpdates.price = updates.price;
  if (updates.bedrooms !== undefined) dbUpdates.bedrooms = updates.bedrooms;
  if (updates.bathrooms !== undefined) dbUpdates.bathrooms = updates.bathrooms;
  if (updates.squareFeet !== undefined) dbUpdates.squarefeet = updates.squareFeet;
  if (updates.imageUrl !== undefined) dbUpdates.imageurl = updates.imageUrl;
  if (updates.listingUrl !== undefined) dbUpdates.listingurl = updates.listingUrl;
  if (updates.latitude !== undefined) dbUpdates.latitude = updates.latitude;
  if (updates.longitude !== undefined) dbUpdates.longitude = updates.longitude;
  if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
  if (updates.favorite !== undefined) dbUpdates.favorite = updates.favorite;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.propertyType !== undefined) dbUpdates.propertytype = updates.propertyType;
  if (updates.contactName !== undefined) dbUpdates.contactname = updates.contactName;
  if (updates.contactPhone !== undefined) dbUpdates.contactphone = updates.contactPhone;
  if (updates.contactEmail !== undefined) dbUpdates.contactemail = updates.contactEmail;
  if (updates.amenities !== undefined) dbUpdates.amenities = updates.amenities;
  if (updates.positiveFeatures !== undefined) dbUpdates.positivefeatures = updates.positiveFeatures;
  if (updates.negativeFeatures !== undefined) dbUpdates.negativefeatures = updates.negativeFeatures;
  
  // Add updated_at timestamp
  dbUpdates.updated_at = new Date().toISOString();
  
  const { error } = await supabase
    .from('properties')
    .update(dbUpdates)
    .eq('id', id);
  
  if (error) {
    console.error("Error updating property:", error);
    throw error;
  }
}

export async function toggleFavorite(id: string, currentValue: boolean): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .update({ favorite: !currentValue, updated_at: new Date().toISOString() })
    .eq('id', id);
  
  if (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
}
