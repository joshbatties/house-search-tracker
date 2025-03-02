import { Property } from '@/types/Property';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Heart, MapPin, Calendar, DollarSign, Home, Maximize, Bath, BedDouble, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import MapView from '@/components/Map/MapView';

interface PropertyDetailProps {
  property: Property;
}

const PropertyDetail = ({ property }: PropertyDetailProps) => {
  const statusColors = {
    interested: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    viewed: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    applied: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property image */}
          <div className="rounded-xl overflow-hidden aspect-video bg-gray-100 dark:bg-gray-800">
            {property.imageUrl ? (
              <img 
                src={property.imageUrl} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Home size={48} />
              </div>
            )}
          </div>
          
          {/* Property details tabs */}
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="amenities">Amenities</TabsTrigger>
              <TabsTrigger value="map">Map</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">Description</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {property.description || "No description provided."}
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium">Property Details</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                        <div className="flex flex-col">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Bedrooms</span>
                          <div className="flex items-center mt-1">
                            <BedDouble size={18} className="mr-2 text-gray-500" />
                            <span className="font-medium">{property.bedrooms}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Bathrooms</span>
                          <div className="flex items-center mt-1">
                            <Bath size={18} className="mr-2 text-gray-500" />
                            <span className="font-medium">{property.bathrooms}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Square Feet</span>
                          <div className="flex items-center mt-1">
                            <Maximize size={18} className="mr-2 text-gray-500" />
                            <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">Price</span>
                          <div className="flex items-center mt-1">
                            <DollarSign size={18} className="mr-2 text-gray-500" />
                            <span className="font-medium">${property.price.toLocaleString()}/mo</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium">Notes</h3>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        {property.notes || "No notes added."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="amenities">
              <Card>
                <CardContent className="pt-6">
                  {property.amenities && property.amenities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center">
                          <Check size={16} className="mr-2 text-green-500" />
                          <span>{amenity}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No amenities listed.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="map">
              <Card>
                <CardContent className="p-0 overflow-hidden">
                  <div className="h-[400px]">
                    <MapView highlightedPropertyId={property.id} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - right 1/3 */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">${property.price.toLocaleString()}<span className="text-gray-500 dark:text-gray-400 text-lg font-normal">/month</span></h2>
                    <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                      <Calendar size={16} className="mr-1" />
                      <span className="text-sm">Added {formatDate(property.dateAdded)}</span>
                    </div>
                  </div>
                  
                  <Badge className={statusColors[property.status]}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium">Location</h3>
                  <div className="flex items-start mt-2">
                    <MapPin size={18} className="flex-shrink-0 mt-0.5 mr-2 text-gray-500" />
                    <div>
                      <p>{property.address}</p>
                      <p>{property.city}, {property.state} {property.zipCode}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                {property.contactName && (
                  <div>
                    <h3 className="text-lg font-medium">Contact</h3>
                    <div className="space-y-2 mt-2">
                      <p className="font-medium">{property.contactName}</p>
                      {property.contactPhone && <p>{property.contactPhone}</p>}
                      {property.contactEmail && <p>{property.contactEmail}</p>}
                    </div>
                  </div>
                )}
                
                {property.listingUrl && (
                  <div className="pt-2">
                    <Button className="w-full" asChild>
                      <a href={property.listingUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={16} className="mr-2" />
                        View Original Listing
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Favorite</h3>
                <Heart 
                  size={20} 
                  className={property.favorite ? "fill-red-500 text-red-500" : "text-gray-400"} 
                />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                {property.favorite 
                  ? "This property is in your favorites." 
                  : "Add this property to your favorites."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
