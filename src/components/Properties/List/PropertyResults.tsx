
import { Property } from '@/types/Property';
import PropertyCard from '../PropertyCard';
import PropertyListEmpty from './PropertyListEmpty';
import { supabase } from "@/integrations/supabase/client";

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
        <PropertyCard 
          key={property.id} 
          property={{
            ...property,
            imageUrl: getImageUrl(property)
          }} 
        />
      ))}
    </div>
  );
};

export default PropertyResults;
