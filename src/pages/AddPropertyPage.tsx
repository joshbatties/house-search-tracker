
import Layout from "@/components/Layout/Layout";
import PropertyForm from "@/components/Properties/PropertyForm";
import { usePropertyStore } from "@/store/propertyStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/Property";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const AddPropertyPage = () => {
  const { addProperty } = usePropertyStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleSubmit = async (data: Omit<Property, "id" | "createdAt" | "updatedAt" | "dateAdded">) => {
    try {
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to add a property.",
          variant: "destructive",
        });
        return;
      }

      const newProperty = await addProperty(data);
      
      toast({
        title: "Property Added",
        description: "Your property has been successfully added.",
      });
      
      navigate(`/properties/${newProperty.id}`);
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <div className="space-y-4">
            <Skeleton className="h-[600px] w-full rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
            <p className="text-muted-foreground">
              Please log in to add a new property
            </p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
            You need to be logged in to add properties. Please sign in or create an account.
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-muted-foreground">
            Enter the details of a rental property you're interested in
          </p>
        </div>
        
        <PropertyForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default AddPropertyPage;
