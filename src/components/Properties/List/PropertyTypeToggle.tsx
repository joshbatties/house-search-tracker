
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Home, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyTypeToggleProps {
  propertyType: string | null;
  handlePropertyTypeChange: (value: string) => void;
}

const PropertyTypeToggle = ({ propertyType, handlePropertyTypeChange }: PropertyTypeToggleProps) => {
  return (
    <div className="flex gap-4">
      <Card 
        className={cn(
          "cursor-pointer p-3 hover:shadow-md transition-all duration-200 w-32 relative overflow-hidden",
          propertyType === "rent" 
            ? "border-blue-500 shadow-sm ring-1 ring-blue-500 bg-blue-50 dark:bg-blue-900/20" 
            : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700"
        )}
        onClick={() => handlePropertyTypeChange("rent")}
      >
        {propertyType === "rent" && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rotate-12" />
        )}
        <div className="flex flex-col items-center gap-2 text-center">
          <Key 
            size={24} 
            className={cn(
              "text-blue-600 dark:text-blue-400",
              propertyType === "rent" ? "animate-pulse" : ""
            )} 
          />
          <span className={cn(
            "font-medium",
            propertyType === "rent" ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"
          )}>
            Rentals
          </span>
        </div>
      </Card>

      <Card 
        className={cn(
          "cursor-pointer p-3 hover:shadow-md transition-all duration-200 w-32 relative overflow-hidden",
          propertyType === "buy" 
            ? "border-green-500 shadow-sm ring-1 ring-green-500 bg-green-50 dark:bg-green-900/20" 
            : "border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700"
        )}
        onClick={() => handlePropertyTypeChange("buy")}
      >
        {propertyType === "buy" && (
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 rotate-12" />
        )}
        <div className="flex flex-col items-center gap-2 text-center">
          <Home 
            size={24} 
            className={cn(
              "text-green-600 dark:text-green-400",
              propertyType === "buy" ? "animate-pulse" : ""
            )} 
          />
          <span className={cn(
            "font-medium",
            propertyType === "buy" ? "text-green-700 dark:text-green-300" : "text-gray-700 dark:text-gray-300"
          )}>
            For Sale
          </span>
        </div>
      </Card>
    </div>
  );
};

export default PropertyTypeToggle;
