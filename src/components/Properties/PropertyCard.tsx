
import { Property } from '@/types/Property';
import { Heart, ExternalLink, MapPin, Bed, Bath, Home, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePropertyStore } from '@/store/propertyStore';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
}

const statusColors = {
  interested: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  viewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  applied: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
};

export const PropertyCard = ({ property }: PropertyCardProps) => {
  const { toggleFavorite } = usePropertyStore();
  
  const timeAgo = formatDistanceToNow(new Date(property.dateAdded), { addSuffix: true });
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative glass-card overflow-hidden group hover-lift"
    >
      <div className="relative aspect-video overflow-hidden rounded-t-xl">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        <div className="absolute top-3 left-3 flex space-x-2">
          <Badge className={cn("font-medium capitalize", statusColors[property.status])}>
            {property.status}
          </Badge>
        </div>
        
        <button 
          onClick={() => toggleFavorite(property.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition-colors"
          aria-label={property.favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={18} 
            className={cn(
              "transition-colors", 
              property.favorite ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"
            )} 
          />
        </button>
        
        <div className="absolute bottom-3 right-3">
          <a 
            href={property.listingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 transition-colors text-gray-700 dark:text-gray-300"
            aria-label="View original listing"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-semibold text-lg leading-tight truncate">
            {property.title}
          </h3>
          <span className="text-lg font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
            ${property.price.toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">
            {property.city}, {property.state} {property.zipCode}
          </span>
        </div>
        
        <div className="flex justify-between mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Bed size={16} className="mr-1" />
            <span className="mr-3">{property.bedrooms}</span>
            
            <Bath size={16} className="mr-1" />
            <span className="mr-3">{property.bathrooms}</span>
            
            <Home size={16} className="mr-1" />
            <span>{property.squareFeet.toLocaleString()} sf</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Added {timeAgo}
          </span>
          
          <div className="flex space-x-2">
            <Link 
              to={`/properties/${property.id}`}
              className="flex items-center justify-center py-1.5 px-3 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-800/30 text-sm font-medium transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
