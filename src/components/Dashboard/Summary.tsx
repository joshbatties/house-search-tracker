
import { usePropertyStore } from '@/store/propertyStore';
import { Home, Heart, DollarSign, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const Summary = () => {
  const { properties } = usePropertyStore();
  
  // Calculate stats
  const totalProperties = properties.length;
  const favoriteProperties = properties.filter(p => p.favorite).length;
  
  // Calculate average rent
  const totalRent = properties.reduce((sum, property) => sum + property.price, 0);
  const averageRent = totalProperties > 0 ? totalRent / totalProperties : 0;
  
  // Count unique neighborhoods
  const uniqueNeighborhoods = new Set(properties.map(p => p.city)).size;
  
  const stats = [
    {
      title: 'Total Properties',
      value: totalProperties,
      icon: Home,
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Favorite Properties',
      value: favoriteProperties,
      icon: Heart,
      color: 'text-red-500 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
    },
    {
      title: 'Average Rent',
      value: `$${Math.round(averageRent).toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Neighborhoods',
      value: uniqueNeighborhoods,
      icon: Building,
      color: 'text-purple-500 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
              <div className={cn("p-3 rounded-lg", stat.bgColor)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Summary;
