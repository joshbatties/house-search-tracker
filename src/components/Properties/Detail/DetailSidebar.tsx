
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, ExternalLink, Heart } from 'lucide-react';
import { Property } from '@/types/Property';
import { formatDistanceToNow } from 'date-fns';
import PropertyViewingSchedule from '@/components/Properties/Viewings/PropertyViewingSchedule';
import { getStatusColor } from '@/components/Properties/Detail/statusUtils';

interface DetailSidebarProps {
  property: Property;
}

const DetailSidebar = ({ property }: DetailSidebarProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
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
              
              <Badge className={getStatusColor(property.status)}>
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
      
      <PropertyViewingSchedule />
      
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
  );
};

export default DetailSidebar;
