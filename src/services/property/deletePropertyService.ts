
import { supabase } from "@/integrations/supabase/client";

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
}
