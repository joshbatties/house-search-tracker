
import { useState } from 'react';
import { usePropertyStore } from '@/store/property/propertyStore';
import PropertyFilterControls from './List/PropertyFilterControls';
import PropertyResults from './List/PropertyResults';
import PropertyListSkeleton from './List/PropertyListSkeleton';

interface PropertyListProps {
  isLoading?: boolean;
}

const PropertyList = ({ isLoading }: PropertyListProps) => {
  const { filteredProperties } = usePropertyStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Return loading state if needed
  if (isLoading) {
    return <PropertyListSkeleton />;
  }
  
  // Apply search filter
  const searchResults = filteredProperties.filter((property) => {
    const searchRegex = new RegExp(searchTerm, 'i');
    return (
      searchRegex.test(property.title) ||
      searchRegex.test(property.description) ||
      searchRegex.test(property.address) ||
      searchRegex.test(property.city) ||
      searchRegex.test(property.notes)
    );
  });
  
  return (
    <div className="space-y-6">
      <PropertyFilterControls 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <PropertyResults properties={searchResults} />
    </div>
  );
};

export default PropertyList;
