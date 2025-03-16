
import { Property } from '@/types/Property';
import PropertyCard from '../PropertyCard';
import PropertyListEmpty from './PropertyListEmpty';

interface PropertyResultsProps {
  properties: Property[];
}

const PropertyResults = ({ properties }: PropertyResultsProps) => {
  if (properties.length === 0) {
    return <PropertyListEmpty />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
};

export default PropertyResults;
