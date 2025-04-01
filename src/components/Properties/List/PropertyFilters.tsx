
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Users, Building, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePropertyStore } from '@/store/property/propertyStore';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface PropertyFiltersProps {
  showFilters: boolean;
  toggleFilters: () => void;
  minPropertyPrice: number;
  maxPropertyPrice: number;
  priceRange: [number, number];
  setPriceRange: (value: [number, number]) => void;
  propertyType: string | null;
}

const PropertyFilters = ({
  showFilters,
  toggleFilters,
  minPropertyPrice,
  maxPropertyPrice,
  priceRange,
  setPriceRange,
  propertyType
}: PropertyFiltersProps) => {
  const { setFilters, filters } = usePropertyStore();
  const [selectedSubtype, setSelectedSubtype] = useState<string | null>(filters.propertySubtype || null);

  // Function to get the price label based on property type
  const getPriceLabel = (type: string | null) => {
    if (type === 'buy') return 'Purchase Price';
    if (type === 'rent') return 'Monthly Rent';
    return 'Price Range';
  };

  // Reset propertySubtype when propertyType changes
  useEffect(() => {
    if (propertyType === 'buy' && selectedSubtype === 'sharehouse') {
      setSelectedSubtype(null);
    }
  }, [propertyType, selectedSubtype]);

  // Apply filters
  const applyFilters = () => {
    setFilters({
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      propertyType: propertyType as 'rent' | 'buy' | null,
      propertySubtype: selectedSubtype as 'apartment' | 'house' | 'sharehouse' | 'condo' | 'townhouse' | null
    });
  };

  // Handle subtype selection
  const handleSubtypeChange = (value: string) => {
    setSelectedSubtype(value === selectedSubtype ? null : value);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFilters}
      className={showFilters ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" : ""}
    >
      <Filter size={18} />
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden absolute top-full left-0 right-0 mt-2 z-20 w-[calc(100vw-2rem)] md:w-[600px] lg:w-[800px]"
        >
          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium text-sm">{getPriceLabel(propertyType)}</h3>
                <Slider
                  value={priceRange}
                  min={minPropertyPrice}
                  max={maxPropertyPrice}
                  step={50}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="py-4"
                />
                <div className="flex justify-between text-sm">
                  <span>${priceRange[0].toLocaleString()}</span>
                  <span>${priceRange[1].toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Bedrooms</h3>
                <Select 
                  value={filters.minBedrooms?.toString() || ""} 
                  onValueChange={(value) => setFilters({ minBedrooms: value ? parseInt(value) : null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="0">Studio+</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Bathrooms</h3>
                <Select 
                  value={filters.minBathrooms?.toString() || ""} 
                  onValueChange={(value) => setFilters({ minBathrooms: value ? parseFloat(value) : null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="1.5">1.5+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="2.5">2.5+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Status</h3>
                <Select 
                  value={filters.status || ""} 
                  onValueChange={(value) => setFilters({ status: value || null })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Status</SelectItem>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="viewed">Viewed</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {propertyType === 'rent' && (
              <div className="mt-6">
                <h3 className="font-medium text-sm mb-3">Property Subtype</h3>
                <ToggleGroup type="single" value={selectedSubtype || ""} onValueChange={handleSubtypeChange}>
                  <ToggleGroupItem value="apartment" aria-label="Apartment" className="flex gap-1.5 items-center">
                    <Building size={14} />
                    <span>Apartment</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="house" aria-label="House" className="flex gap-1.5 items-center">
                    <Home size={14} />
                    <span>House</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="sharehouse" aria-label="Sharehouse" className="flex gap-1.5 items-center">
                    <Users size={14} />
                    <span>Sharehouse</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="townhouse" aria-label="Townhouse" className="flex gap-1.5 items-center">
                    <Home size={14} />
                    <span>Townhouse</span>
                  </ToggleGroupItem>
                </ToggleGroup>
                {selectedSubtype === 'sharehouse' && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Sharehouses show price per person
                  </p>
                )}
              </div>
            )}

            {propertyType === 'buy' && (
              <div className="mt-6">
                <h3 className="font-medium text-sm mb-3">Property Subtype</h3>
                <ToggleGroup type="single" value={selectedSubtype || ""} onValueChange={handleSubtypeChange}>
                  <ToggleGroupItem value="house" aria-label="House" className="flex gap-1.5 items-center">
                    <Home size={14} />
                    <span>House</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="condo" aria-label="Condo" className="flex gap-1.5 items-center">
                    <Building size={14} />
                    <span>Condo</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="townhouse" aria-label="Townhouse" className="flex gap-1.5 items-center">
                    <Home size={14} />
                    <span>Townhouse</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            )}
            
            <div className="flex justify-end mt-6">
              <Button onClick={applyFilters}>Apply Filters</Button>
            </div>
          </div>
        </motion.div>
      )}
    </Button>
  );
};

export default PropertyFilters;
