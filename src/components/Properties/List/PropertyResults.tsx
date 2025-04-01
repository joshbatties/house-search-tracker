
import { Property } from '@/types/Property';
import PropertyCard from '../PropertyCard';
import PropertyListEmpty from './PropertyListEmpty';
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Home, Key } from "lucide-react";

interface PropertyResultsProps {
  properties: Property[];
}

const PropertyResults = ({ properties }: PropertyResultsProps) => {
  if (properties.length === 0) {
    return <PropertyListEmpty />;
  }

  const getImageUrl = (property: Property) => {
    if (property.imageUrl && property.imageUrl.startsWith('property-images/')) {
      const { data } = supabase.storage.from('property-images').getPublicUrl(property.imageUrl);
      return data.publicUrl;
    }
    return property.imageUrl;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div key={property.id} className="relative">
          <Badge 
            className={cn(
              "absolute top-2 left-2 z-10 px-2 py-1 text-xs",
              property.propertyType === 'rent'
                ? "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/60 dark:text-blue-200"
                : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/60 dark:text-green-200"
            )}
          >
            {property.propertyType === 'rent' ? (
              <span className="flex items-center gap-1">
                <Key size={12} />
                Rental
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Home size={12} />
                For Sale
              </span>
            )}
          </Badge>
          
          <PropertyCard 
            property={{
              ...property,
              imageUrl: getImageUrl(property)
            }} 
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyResults;
