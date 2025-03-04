
import { useEffect } from "react";
import Layout from "@/components/Layout/Layout";
import PropertyList from "@/components/Properties/PropertyList";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { usePropertyStore } from "@/store/propertyStore";
import { useToast } from "@/components/ui/use-toast";

const PropertiesPage = () => {
  const { fetchProperties, isLoading, error } = usePropertyStore();
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties().catch(() => {
      toast({
        title: "Error",
        description: "Failed to load properties. Please refresh the page.",
        variant: "destructive",
      });
    });
  }, [fetchProperties, toast]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
            <p className="text-muted-foreground">
              View and manage your saved rental properties
            </p>
          </div>
          <Button asChild>
            <Link to="/add-property" className="flex items-center gap-2">
              <Plus size={16} />
              Add Property
            </Link>
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-md">
            {error}
          </div>
        )}
        
        <PropertyList isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default PropertiesPage;
