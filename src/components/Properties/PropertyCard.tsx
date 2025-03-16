
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Property } from '@/types/Property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { usePropertyStore } from '@/store/propertyStore';
import { 
  Building, 
  Bookmark, 
  BookmarkCheck, 
  Eye, 
  FileText, 
  CheckSquare, 
  XSquare,
  DollarSign,
  Home,
  Key
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const { toggleFavorite } = usePropertyStore();
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  const statusColors = {
    interested: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    viewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    applied: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };
  
  const statusIcons = {
    interested: <FileText size={14} />,
    viewed: <Eye size={14} />,
    applied: <Building size={14} />,
    accepted: <CheckSquare size={14} />,
    rejected: <XSquare size={14} />,
  };
  
  // Get the appropriate price label based on property type
  const getPriceLabel = () => {
    return property.propertyType === 'buy' 
      ? `$${property.price.toLocaleString()}` 
      : `$${property.price.toLocaleString()}/mo`;
  };
  
  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isTogglingFavorite) return;
    
    setIsTogglingFavorite(true);
    
    try {
      await toggleFavorite(property.id);
      
      toast(property.favorite ? "Removed from favorites" : "Added to favorites", {
        icon: property.favorite ? "💔" : "❤️",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsTogglingFavorite(false);
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <Link to={`/properties/${property.id}`} className="block">
          <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
            {property.imageUrl ? (
              <img 
                src={property.imageUrl} 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Building size={48} />
              </div>
            )}
          </div>
          
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors"
            disabled={isTogglingFavorite}
          >
            {property.favorite ? (
              <BookmarkCheck className="h-5 w-5 text-red-500" />
            ) : (
              <Bookmark className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <Badge
              className={cn(
                "flex items-center gap-1",
                statusColors[property.status]
              )}
              variant="outline"
            >
              {statusIcons[property.status]}
              {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
            </Badge>
            
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1",
                property.propertyType === 'rent' 
                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" 
                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              )}
            >
              {property.propertyType === 'rent' ? (
                <Key size={14} />
              ) : (
                <Home size={14} />
              )}
              {property.propertyType === 'rent' ? 'Rent' : 'Buy'}
            </Badge>
          </div>
        </Link>
      </div>
      
      <CardContent className="p-4">
        <Link to={`/properties/${property.id}`} className="block">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold line-clamp-1">{property.title}</h3>
                <div className="font-medium text-right flex items-center">
                  {property.propertyType === 'buy' ? <DollarSign className="h-4 w-4 text-green-600" /> : null}
                  {getPriceLabel()}
                </div>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                {property.address}, {property.city}
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div>{property.bedrooms === 0 ? 'Studio' : `${property.bedrooms} bd`}</div>
              <div>{property.bathrooms} ba</div>
              <div>{property.squareFeet.toLocaleString()} sqft</div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
