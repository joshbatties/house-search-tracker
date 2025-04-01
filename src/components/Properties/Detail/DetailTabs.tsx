
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { BedDouble, Bath, Maximize, DollarSign, Check } from 'lucide-react';
import { Property } from '@/types/Property';
import PropertyNotes from '@/components/Properties/Notes/PropertyNotes';
import PropertyReminders from '@/components/Properties/Reminders/PropertyReminders';
import PropertyNeighborhood from '@/components/Properties/Neighborhood/PropertyNeighborhood';
import MapView from '@/components/Map/MapView';

interface DetailTabsProps {
  property: Property;
}

const DetailTabs = ({ property }: DetailTabsProps) => {
  return (
    <Tabs defaultValue="details" className="w-full">
      <TabsList className="grid grid-cols-5 mb-4">
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="amenities">Amenities</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="neighborhood">Neighborhood</TabsTrigger>
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
      
      <TabsContent value="notes" className="space-y-4">
        <PropertyNotes />
        <PropertyReminders />
      </TabsContent>

      <TabsContent value="neighborhood">
        <PropertyNeighborhood />
      </TabsContent>
      
      <TabsContent value="map">
        <Card>
          <CardContent className="p-0 overflow-hidden">
            <div className="h-[400px]">
              <MapView 
                properties={[property]} 
                highlightedPropertyId={property.id} 
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default DetailTabs;
