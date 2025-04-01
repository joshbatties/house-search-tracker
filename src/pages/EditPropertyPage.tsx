import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Layout from "@/components/Layout/Layout";
import PropertyForm from "@/components/Properties/PropertyForm";
import { usePropertyStore } from "@/store/propertyStore";
import { Property } from "@/types/Property";
import { propertyService } from "@/services/property";
import { supabase } from "@/integrations/supabase/client";

const EditPropertyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updateProperty } = usePropertyStore();
  
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const loadProperty = async () => {
      setIsLoading(true);
      try {
        const data = await propertyService.getProperty(id);
        if (data) {
          if (data.imageUrl && data.imageUrl.startsWith('property-images/')) {
            const { data: urlData } = supabase.storage
              .from('property-images')
              .getPublicUrl(data.imageUrl);
              
            console.log("Image URL from storage:", urlData.publicUrl);
          }
          
          setProperty(data);
        } else {
          setError("Property not found");
          toast.error("Property not found");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details. Please try again later.");
        toast.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    loadProperty();
  }, [id]);

  const handleFormSubmit = async (updatedPropertyData: Omit<Property, "id" | "createdAt" | "updatedAt" | "dateAdded">) => {
    if (!id || !property) return;
    
    setIsSubmitting(true);
    
    try {
      await updateProperty(id, updatedPropertyData);
      
      toast.success("Property updated successfully");
      navigate(`/properties/${id}`);
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded-md w-1/3"></div>
            <div className="h-[600px] bg-muted rounded-lg"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !property) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">Property Not Found</h1>
          <p className="text-muted-foreground">
            {error || "The property you're trying to edit doesn't exist or has been removed."}
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
        <PropertyForm 
          editProperty={property}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </Layout>
  );
};

export default EditPropertyPage;
