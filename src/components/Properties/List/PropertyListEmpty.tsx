
import { Search } from 'lucide-react';

const PropertyListEmpty = () => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
        <Search size={32} className="text-blue-500" />
      </div>
      <h3 className="text-lg font-medium mb-2">No Properties Found</h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
        We couldn't find any properties matching your search criteria. Try adjusting your filters or adding new properties.
      </p>
    </div>
  );
};

export default PropertyListEmpty;
