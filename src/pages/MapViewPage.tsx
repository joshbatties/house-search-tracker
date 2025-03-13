
import Layout from "@/components/Layout/Layout";
import MapView from "@/components/Map/MapView";
import { usePropertyStore } from "@/store/propertyStore";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const MapViewPage = () => {
  const { properties, isLoading, fetchProperties } = usePropertyStore();
  const { toast } = useToast();
  
  // Fetch properties when component mounts
  useEffect(() => {
    const loadProperties = async () => {
      try {
        await fetchProperties();
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast({
          title: "Error",
          description: "Failed to load properties. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    loadProperties();
  }, [fetchProperties, toast]);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Map View</h1>
          <p className="text-muted-foreground">
            Visualize your saved properties on a map
          </p>
        </div>
        
        <div className="h-[70vh] rounded-lg overflow-hidden border">
          {isLoading ? (
            <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800">
              <p className="text-gray-500 dark:text-gray-400 mb-2">No properties found</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Add properties to see them on the map
              </p>
            </div>
          ) : (
            <MapView properties={properties} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MapViewPage;
