
import { supabase } from "@/integrations/supabase/client";
import { Property } from "@/types/Property";
import { mapDbPropertyToProperty } from "./types";

export async function getProperties(): Promise<Property[]> {
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
  return data.map(mapDbPropertyToProperty);
}

export async function getProperty(id: string): Promise<Property | null> {
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
  
  return mapDbPropertyToProperty(data);
}
