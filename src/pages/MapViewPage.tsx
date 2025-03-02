
import Layout from "@/components/Layout/Layout";
import { MapView } from "@/components/Map/MapView";
import { usePropertyStore } from "@/store/propertyStore";

const MapViewPage = () => {
  const { properties } = usePropertyStore();
  
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
          <MapView properties={properties} />
        </div>
      </div>
    </Layout>
  );
};

export default MapViewPage;
