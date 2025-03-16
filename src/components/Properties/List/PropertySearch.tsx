
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface PropertySearchProps {
  searchTerm: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertySearch = ({ searchTerm, handleSearch }: PropertySearchProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        type="text"
        placeholder="Search properties..."
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10"
      />
    </div>
  );
};

export default PropertySearch;
