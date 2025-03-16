
import { useState } from 'react';
import { usePropertyStore } from '@/store/propertyStore';
import { Link } from 'react-router-dom';
import { Property } from '@/types/Property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ChevronLeft, Search, MapPin, Home, Key } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import LeafletMap from './LeafletMap';

interface MapViewProps {
  properties?: Property[];
  highlightedPropertyId?: string;
}

const MapView = ({ properties, highlightedPropertyId }: MapViewProps) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [propertyType, setPropertyType] = useState<string | null>(null);
  
  const { filteredProperties: storeFilteredProperties, setFilters } = usePropertyStore();
  
  // Use properties from props if provided, otherwise use filteredProperties from store
  const filteredProperties = properties || storeFilteredProperties;
  
  // Filter properties based on search query and property type
  const filteredBySearch = filteredProperties.filter(property => {
    // Apply search filter
    const matchesSearch = searchQuery.trim() === '' || 
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply property type filter if selected
    const matchesType = propertyType === null || property.propertyType === propertyType;
    
    return matchesSearch && matchesType;
  });
  
  // Handle property marker click
  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };
  
  // Handle property type selection
  const handlePropertyTypeChange = (value: string) => {
    const newValue = value === propertyType ? null : value;
    setPropertyType(newValue);
    setFilters({ propertyType: newValue as 'rent' | 'buy' | null });
  };
  
  // Calculate map center based on properties
  const calculateMapCenter = (): [number, number] => {
    if (highlightedPropertyId) {
      const highlighted = filteredProperties.find(p => p.id === highlightedPropertyId);
      if (highlighted) {
        return [highlighted.latitude, highlighted.longitude];
      }
    }
    
    if (filteredProperties.length === 0) {
      return [37.7749, -122.4194]; // Default to San Francisco
    }
    
    // Calculate the average of all property coordinates
    const sumLat = filteredProperties.reduce((sum, p) => sum + p.latitude, 0);
    const sumLng = filteredProperties.reduce((sum, p) => sum + p.longitude, 0);
    
    return [sumLat / filteredProperties.length, sumLng / filteredProperties.length];
  };
  
  return (
    <div className="h-full relative">
      <div className="absolute top-4 left-4 z-10 space-y-4 w-full max-w-xs">
        <Button
          variant="outline"
          size="sm"
          className="bg-white dark:bg-gray-800"
          asChild
        >
          <Link to="/properties">
            <ChevronLeft size={16} className="mr-1" />
            Back to Properties
          </Link>
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Search locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 bg-white dark:bg-gray-800"
          />
        </div>
        
        <ToggleGroup type="single" value={propertyType || ""} onValueChange={handlePropertyTypeChange} className="justify-start bg-white dark:bg-gray-800 p-1 rounded-lg border">
          <ToggleGroupItem value="rent" aria-label="Filter by Rentals" className={cn(
            "flex items-center gap-1.5",
            propertyType === "rent" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" : ""
          )}>
            <Key size={16} />
            <span>Rent</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="buy" aria-label="Filter by Properties For Sale" className={cn(
            "flex items-center gap-1.5",
            propertyType === "buy" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" : ""
          )}>
            <Home size={16} />
            <span>Buy</span>
          </ToggleGroupItem>
        </ToggleGroup>
        
        <AnimatePresence>
          {searchQuery && filteredBySearch.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-elevated overflow-hidden max-h-64 overflow-y-auto"
            >
              {filteredBySearch.map(property => (
                <button
                  key={property.id}
                  className={cn(
                    "w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0",
                    selectedProperty?.id === property.id && "bg-blue-50 dark:bg-blue-900/30"
                  )}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="flex items-start">
                    <MapPin size={16} className={cn(
                      "flex-shrink-0 mt-0.5 mr-2", 
                      property.propertyType === 'buy' ? "text-green-500" : "text-blue-500"
                    )} />
                    <div>
                      <p className="font-medium text-sm leading-tight">{property.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500 dark:text-gray-400 text-xs">
                          {property.address}, {property.city}
                        </p>
                        <Badge variant="outline" className={cn(
                          "text-xs py-0 h-5",
                          property.propertyType === 'rent' 
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" 
                            : "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        )}>
                          {property.propertyType === 'rent' ? 'Rent' : 'Buy'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Leaflet Map */}
      <div className="w-full h-full rounded-xl overflow-hidden">
        <LeafletMap 
          properties={filteredBySearch}
          center={calculateMapCenter()}
          zoom={12}
          onMarkerClick={handleMarkerClick}
          highlightedPropertyId={highlightedPropertyId}
        />
      </div>
      
      <Dialog open={!!selectedProperty} onOpenChange={open => !open && setSelectedProperty(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedProperty?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedProperty && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden aspect-video">
                <img 
                  src={selectedProperty.imageUrl} 
                  alt={selectedProperty.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {selectedProperty.propertyType === 'rent' 
                      ? `$${selectedProperty.price.toLocaleString()}/month` 
                      : `$${selectedProperty.price.toLocaleString()}`}
                  </p>
                  <Badge variant="outline" className={cn(
                    selectedProperty.propertyType === 'rent' 
                      ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300" 
                      : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300"
                  )}>
                    {selectedProperty.propertyType === 'rent' 
                      ? <Key size={12} className="mr-1" /> 
                      : <Home size={12} className="mr-1" />}
                    {selectedProperty.propertyType === 'rent' ? 'Rent' : 'Buy'}
                  </Badge>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {selectedProperty.bedrooms} bd | {selectedProperty.bathrooms} ba | {selectedProperty.squareFeet.toLocaleString()} sqft
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {selectedProperty.address}, {selectedProperty.city}, {selectedProperty.state}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedProperty(null)}>
                  Close
                </Button>
                <Button asChild>
                  <Link to={`/properties/${selectedProperty.id}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapView;
