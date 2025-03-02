
import { useMemo } from 'react';
import { usePropertyStore } from '@/store/propertyStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Property } from '@/types/Property';

interface PriceChartProps {
  type?: 'bar' | 'neighborhood';
}

const PriceChart = ({ type = 'bar' }: PriceChartProps) => {
  const { properties } = usePropertyStore();
  
  const chartData = useMemo(() => {
    if (type === 'bar') {
      // Sort properties by price
      return [...properties]
        .sort((a, b) => a.price - b.price)
        .map(property => ({
          name: property.title.length > 15 ? property.title.substring(0, 15) + '...' : property.title,
          price: property.price,
          id: property.id,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          fullAddress: `${property.address}, ${property.city}`,
        }));
    } else {
      // Group by neighborhood (city)
      const neighborhoods: Record<string, { properties: Property[], averagePrice: number }> = {};
      
      properties.forEach(property => {
        const neighborhood = property.city;
        if (!neighborhoods[neighborhood]) {
          neighborhoods[neighborhood] = {
            properties: [],
            averagePrice: 0,
          };
        }
        neighborhoods[neighborhood].properties.push(property);
      });
      
      // Calculate average price for each neighborhood
      Object.keys(neighborhoods).forEach(neighborhood => {
        const { properties } = neighborhoods[neighborhood];
        const totalPrice = properties.reduce((sum, property) => sum + property.price, 0);
        neighborhoods[neighborhood].averagePrice = totalPrice / properties.length;
      });
      
      // Convert to array format for the chart
      return Object.entries(neighborhoods)
        .map(([neighborhood, data]) => ({
          name: neighborhood,
          price: Math.round(data.averagePrice),
          count: data.properties.length,
        }))
        .sort((a, b) => a.price - b.price);
    }
  }, [properties, type]);
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      if (type === 'bar') {
        const property = payload[0].payload;
        return (
          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <p className="font-semibold">{property.name}</p>
            <p className="text-blue-600 dark:text-blue-400 font-medium">${property.price.toLocaleString()}/month</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{property.bedrooms} bd | {property.bathrooms} ba</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{property.fullAddress}</p>
          </div>
        );
      } else {
        const neighborhood = payload[0].payload;
        return (
          <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
            <p className="font-semibold">{neighborhood.name}</p>
            <p className="text-blue-600 dark:text-blue-400 font-medium">Avg: ${neighborhood.price.toLocaleString()}/month</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{neighborhood.count} {neighborhood.count === 1 ? 'property' : 'properties'}</p>
          </div>
        );
      }
    }
    return null;
  };
  
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 70 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={80} 
            tick={{ fontSize: 12 }}
            tickMargin={10}
          />
          <YAxis
            tickFormatter={(value) => `$${value.toLocaleString()}`}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="price" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => {
              // Generate a blue color with varying lightness based on price
              const maxPrice = Math.max(...chartData.map(d => d.price));
              const minPrice = Math.min(...chartData.map(d => d.price));
              const ratio = (entry.price - minPrice) / (maxPrice - minPrice || 1);
              const hue = 210; // Blue hue
              const lightness = 60 - ratio * 20; // Varies from 60% to 40%
              
              return (
                <Cell key={`cell-${index}`} fill={`hsl(${hue}, 100%, ${lightness}%)`} />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
