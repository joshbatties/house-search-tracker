
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Home, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyTypeToggleProps {
  propertyType: string | null;
  handlePropertyTypeChange: (value: string) => void;
}

const PropertyTypeToggle = ({ propertyType, handlePropertyTypeChange }: PropertyTypeToggleProps) => {
  return (
    <ToggleGroup type="single" value={propertyType || ""} onValueChange={handlePropertyTypeChange} className="justify-start">
      <ToggleGroupItem value="rent" aria-label="Filter by Rentals" className={cn(
        "flex items-center gap-1.5",
        propertyType === "rent" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" : ""
      )}>
        <Key size={16} />
        <span>Rent</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="buy" aria-label="Filter by Properties For Sale" className={cn(
        "flex items-center gap-1.5",
        propertyType === "buy" ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800" : ""
      )}>
        <Home size={16} />
        <span>Buy</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export default PropertyTypeToggle;
