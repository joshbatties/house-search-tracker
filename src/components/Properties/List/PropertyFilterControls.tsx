
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { X } from 'lucide-react';
import { usePropertyStore } from '@/store/propertyStore';
import PropertyFilters from './PropertyFilters';
import PropertySearch from './PropertySearch';
import PropertyTypeToggle from './PropertyTypeToggle';
import { AnimatePresence } from 'framer-motion';

interface PropertyFilterControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

const PropertyFilterControls = ({ searchTerm, setSearchTerm }: PropertyFilterControlsProps) => {
  const { properties, filters, setFilters, resetFilters } = usePropertyStore();
  const [showFilters, setShowFilters] = useState(false);
  const [propertyType, setPropertyType] = useState<string | null>(null);
  
  // Get minimum and maximum prices for the slider
  const minPropertyPrice = Math.min(...properties.map(p => p.price), 0);
  const maxPropertyPrice = Math.max(...properties.map(p => p.price), 5000);
  
  // Local state for price range
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice ?? minPropertyPrice,
    filters.maxPrice ?? maxPropertyPrice
  ]);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle property type selection
  const handlePropertyTypeChange = (value: string) => {
    const newValue = value === propertyType ? null : value;
    setPropertyType(newValue);
    setFilters({ propertyType: newValue as 'rent' | 'buy' | null });
  };
  
  // Reset all filters and search
  const clearAllFilters = () => {
    resetFilters();
    setSearchTerm('');
    setPriceRange([minPropertyPrice, maxPropertyPrice]);
    setPropertyType(null);
    setShowFilters(false);
  };
  
  // Toggle filter panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const hasActiveFilters = searchTerm || 
    filters.minPrice !== null || 
    filters.maxPrice !== null || 
    filters.minBedrooms !== null || 
    filters.minBathrooms !== null || 
    filters.status !== null || 
    filters.favorite !== null || 
    filters.propertyType !== null;

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <PropertySearch 
        searchTerm={searchTerm}
        handleSearch={handleSearch}
      />
      
      <PropertyTypeToggle 
        propertyType={propertyType}
        handlePropertyTypeChange={handlePropertyTypeChange}
      />
      
      <div className="flex space-x-2 relative">
        <AnimatePresence>
          <PropertyFilters
            showFilters={showFilters}
            toggleFilters={toggleFilters}
            minPropertyPrice={minPropertyPrice}
            maxPropertyPrice={maxPropertyPrice}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            propertyType={propertyType}
          />
        </AnimatePresence>
        
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-sm flex items-center gap-1"
          >
            <X size={14} />
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
};

export default PropertyFilterControls;
