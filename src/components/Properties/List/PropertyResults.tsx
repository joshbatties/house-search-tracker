
import { Property } from '@/types/Property';
import PropertyCard from '../PropertyCard';
import PropertyListEmpty from './PropertyListEmpty';
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Home, Key, Users, Building, HomeIcon } from "lucide-react";

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

  const getPropertyTypeIcon = (property: Property) => {
    if (property.propertyType === 'buy') {
      return <Home size={12} />;
    }
    
    // For rental properties, check subtype
    if (property.propertySubtype === 'sharehouse') {
      return <Users size={12} />;
    }
    
    return <Key size={12} />;
  };
  
  const getPropertyTypeLabel = (property: Property) => {
    if (property.propertyType === 'buy') {
      return 'For Sale';
    }
    
    if (property.propertySubtype === 'sharehouse') {
      return 'Sharehouse';
    }
    
    return 'Rental';
  };
  
  const getSubtypeBadge = (property: Property) => {
    if (!property.propertySubtype) return null;
    
    let icon;
    let label = property.propertySubtype.charAt(0).toUpperCase() + property.propertySubtype.slice(1);
    
    switch (property.propertySubtype) {
      case 'apartment':
        icon = <Building size={12} />;
        break;
      case 'house':
        icon = <Home size={12} />;
        break;
      case 'sharehouse':
        icon = <Users size={12} />;
        break;
      case 'condo':
        icon = <Building size={12} />;
        break;
      case 'townhouse':
        icon = <HomeIcon size={12} />;
        break;
      default:
        icon = <Building size={12} />;
    }
    
    return (
      <Badge 
        className={cn(
          "absolute top-10 left-2 z-10 px-2 py-1 text-xs",
          "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/60 dark:text-gray-200"
        )}
      >
        <span className="flex items-center gap-1">
          {icon}
          {label}
        </span>
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <div key={property.id} className="relative">
          <Badge 
            className={cn(
              "absolute top-2 left-2 z-10 px-2 py-1 text-xs",
              property.propertyType === 'rent'
                ? property.propertySubtype === 'sharehouse'
                  ? "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/60 dark:text-purple-200"
                  : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/60 dark:text-blue-200"
                : "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/60 dark:text-green-200"
            )}
          >
            <span className="flex items-center gap-1">
              {getPropertyTypeIcon(property)}
              {getPropertyTypeLabel(property)}
            </span>
          </Badge>
          
          {getSubtypeBadge(property)}
          
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
