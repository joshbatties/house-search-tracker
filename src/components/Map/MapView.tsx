import { useEffect, useRef, useState } from 'react';
import { usePropertyStore } from '@/store/propertyStore';
import { useLocation, Link } from 'react-router-dom';
import { Property } from '@/types/Property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, Search, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MapViewProps {
  properties?: Property[];
  highlightedPropertyId?: string;
}

const MapView = ({ properties, highlightedPropertyId }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  
  const { filteredProperties: storeFilteredProperties } = usePropertyStore();
  
  // Use properties from props if provided, otherwise use filteredProperties from store
  const filteredProperties = properties || storeFilteredProperties;
  
  // Load the Google Maps API script
  useEffect(() => {
    // Simulate loading a map
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    // Note: In a real implementation, you would load the Google Maps API here
    // const script = document.createElement('script');
    // script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
    // script.async = true;
    // document.body.appendChild(script);
    
    return () => {
      clearTimeout(timer);
      // document.body.removeChild(script);
    };
  }, []);
  
  // Initialize the map when the API is loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current) {
      // In a real implementation, you would initialize the map here
      console.log('Map initialized');
      
      // If there's a highlighted property, select it
      if (highlightedPropertyId) {
        const property = filteredProperties.find(p => p.id === highlightedPropertyId);
        if (property) {
          setSelectedProperty(property);
        }
      }
    }
  }, [mapLoaded, highlightedPropertyId, filteredProperties]);
  
  // Filter properties based on search query
  const filteredBySearch = searchQuery.trim() === '' 
    ? filteredProperties 
    : filteredProperties.filter(property => 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Handle property selection
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    // In a real implementation, you would pan to the property marker
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
                  onClick={() => handlePropertySelect(property)}
                >
                  <div className="flex items-start">
                    <MapPin size={16} className="flex-shrink-0 mt-0.5 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm leading-tight">{property.title}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                        {property.address}, {property.city}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Map placeholder */}
      <div ref={mapRef} className="w-full h-full rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/20 dark:to-gray-900 flex items-center justify-center relative">
        {!mapLoaded ? (
          <div className="text-gray-500 dark:text-gray-400">Loading map...</div>
        ) : (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            {/* This is a placeholder for the actual map */}
            {/* In a real implementation, Google Maps would be displayed here */}
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 relative">
              <div className="absolute inset-0 p-8 flex flex-col items-center justify-center">
                <h3 className="text-xl font-semibold mb-2">Map Placeholder</h3>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-4">
                  This is a placeholder for the actual map integration. In a real implementation,
                  you would see a Google Maps or Mapbox map here with property markers.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {filteredProperties.map(property => (
                    <Button
                      key={property.id}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "bg-white dark:bg-gray-800",
                        selectedProperty?.id === property.id && "border-blue-500 dark:border-blue-500"
                      )}
                      onClick={() => handlePropertySelect(property)}
                    >
                      <MapPin size={14} className="mr-1" />
                      {property.title}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
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
                <p className="font-medium">${selectedProperty.price.toLocaleString()}/month</p>
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
