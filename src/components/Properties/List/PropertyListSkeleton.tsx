
import { Skeleton } from '@/components/ui/skeleton';

const PropertyListSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-20" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyListSkeleton;
