
import { Property } from '@/types/Property';
import DetailTabs from './Detail/DetailTabs';
import DetailSidebar from './Detail/DetailSidebar';

interface PropertyDetailProps {
  property: Property;
}

const PropertyDetail = ({ property }: PropertyDetailProps) => {
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
          <DetailTabs property={property} />
        </div>
        
        {/* Sidebar - right 1/3 */}
        <DetailSidebar property={property} />
      </div>
    </div>
  );
};

// Need to import Home icon for the property image placeholder
import { Home } from 'lucide-react';

export default PropertyDetail;
