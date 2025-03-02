
import { useState } from 'react';
import { usePropertyStore } from '@/store/propertyStore';
import PropertyCard from './PropertyCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PropertyList = () => {
  const { properties, filteredProperties, setFilters, resetFilters, filters } = usePropertyStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Get minimum and maximum prices for the slider
  const minPropertyPrice = Math.min(...properties.map(p => p.price));
  const maxPropertyPrice = Math.max(...properties.map(p => p.price));
  
  // Local state for price range
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.minPrice ?? minPropertyPrice,
    filters.maxPrice ?? maxPropertyPrice
  ]);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
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
  
  // Apply filters
  const applyFilters = () => {
    setFilters({
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    });
  };
  
  // Reset all filters and search
  const clearAllFilters = () => {
    resetFilters();
    setSearchTerm('');
    setPriceRange([minPropertyPrice, maxPropertyPrice]);
    setShowFilters(false);
  };
  
  // Toggle filter panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleFilters}
            className={showFilters ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" : ""}
          >
            <Filter size={18} />
          </Button>
          
          {(searchTerm || filters.minPrice !== null || filters.maxPrice !== null || 
            filters.minBedrooms !== null || filters.minBathrooms !== null || 
            filters.status !== null || filters.favorite !== null) && (
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
      
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Price Range</h3>
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
              
              <div className="flex justify-end mt-6">
                <Button onClick={applyFilters}>Apply Filters</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {searchResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
            <Search size={32} className="text-blue-500" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Properties Found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            We couldn't find any properties matching your search criteria. Try adjusting your filters or adding new properties.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
