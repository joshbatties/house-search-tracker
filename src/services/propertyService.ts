
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/Property";

export interface PropertyInput extends Omit<Property, "id" | "createdAt" | "updatedAt" | "dateAdded"> {}

export const propertyService = {
  async getProperties(): Promise<Property[]> {
    // Get the current user or anonymous ID
    const { data: { user } } = await supabase.auth.getUser();
    const anonymousId = localStorage.getItem("anonymousId");
    
    let query = supabase.from('properties').select('*');
    
    if (user) {
      // If logged in, get user's properties
      query = query.eq('user_id', user.id);
    } else if (anonymousId) {
      // If anonymous, get properties created with anonymous ID
      query = query.eq('user_id', anonymousId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
    
    // Map the database structure to our Property type
    return data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description || "",
      address: item.address,
      city: item.city,
      state: item.state,
      zipCode: item.zipcode,
      price: Number(item.price),
      bedrooms: item.bedrooms,
      bathrooms: Number(item.bathrooms),
      squareFeet: item.squarefeet,
      imageUrl: item.imageurl || "",
      listingUrl: item.listingurl || "",
      latitude: Number(item.latitude || 0),
      longitude: Number(item.longitude || 0),
      dateAdded: item.dateadded,
      notes: item.notes || "",
      favorite: item.favorite || false,
      status: item.status as Property["status"],
      contactName: item.contactname,
      contactPhone: item.contactphone,
      contactEmail: item.contactemail,
      amenities: item.amenities || [],
    }));
  },
  
  async getProperty(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error("Error fetching property:", error);
      throw error;
    }
    
    if (!data) return null;
    
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
      contactName: data.contactname,
      contactPhone: data.contactphone,
      contactEmail: data.contactemail,
      amenities: data.amenities || [],
    };
  },
  
  async createProperty(property: PropertyInput): Promise<Property> {
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
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating property:", error);
      throw error;
    }
    
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
      contactName: data.contactname,
      contactPhone: data.contactphone,
      contactEmail: data.contactemail,
      amenities: data.amenities || [],
    };
  },
  
  async updateProperty(id: string, updates: Partial<PropertyInput>): Promise<void> {
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
    if (updates.contactName !== undefined) dbUpdates.contactname = updates.contactName;
    if (updates.contactPhone !== undefined) dbUpdates.contactphone = updates.contactPhone;
    if (updates.contactEmail !== undefined) dbUpdates.contactemail = updates.contactEmail;
    if (updates.amenities !== undefined) dbUpdates.amenities = updates.amenities;
    
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
  },
  
  async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },
  
  async toggleFavorite(id: string, currentValue: boolean): Promise<void> {
    const { error } = await supabase
      .from('properties')
      .update({ favorite: !currentValue, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error("Error toggling favorite:", error);
      throw error;
    }
  }
};
