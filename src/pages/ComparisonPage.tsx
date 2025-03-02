import { useEffect, useState } from "react";
import Layout from "@/components/Layout/Layout";
import { usePropertyStore } from "@/store/propertyStore";
import { Property } from "@/types/Property";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Check, Home, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ComparisonPage = () => {
  const { properties } = usePropertyStore();
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [comparisonData, setComparisonData] = useState<Property[]>([]);

  useEffect(() => {
    // Filter properties based on selected IDs
    const filteredProperties = properties.filter(p => 
      selectedProperties.includes(p.id)
    );
    setComparisonData(filteredProperties);
  }, [selectedProperties, properties]);

  const handleSelectProperty = (position: number, propertyId: string) => {
    const newSelectedProperties = [...selectedProperties];
    
    // If there's already a property at this position, replace it
    if (position < newSelectedProperties.length) {
      newSelectedProperties[position] = propertyId;
    } else {
      // Otherwise add it
      newSelectedProperties.push(propertyId);
    }
    
    setSelectedProperties(newSelectedProperties);
  };

  const handleRemoveProperty = (propertyId: string) => {
    setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
  };

  // Create empty slots for comparison
  const totalSlots = 3;
  const emptySlots = Math.max(0, totalSlots - comparisonData.length);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compare Properties</h1>
          <p className="text-muted-foreground">
            Select up to 3 properties to compare side by side
          </p>
        </div>
        
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Properties Found</h2>
            <p className="text-muted-foreground mb-6">
              Add some properties first to be able to compare them.
            </p>
            <Button asChild>
              <Link to="/add-property">Add Property</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.from({ length: totalSlots }).map((_, index) => {
                const property = comparisonData[index];
                
                return (
                  <Card key={index} className={!property ? "border-dashed" : ""}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {property ? `Property ${index + 1}` : 'Select Property'}
                        </CardTitle>
                        {property && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveProperty(property.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <Select 
                        value={property?.id} 
                        onValueChange={(value) => handleSelectProperty(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a property" />
                        </SelectTrigger>
                        <SelectContent>
                          {properties
                            .filter(p => !selectedProperties.includes(p.id) || p.id === property?.id)
                            .map(p => (
                              <SelectItem key={p.id} value={p.id}>
                                {p.title}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </CardHeader>
                    
                    {property && (
                      <CardContent className="text-sm">
                        <p className="font-medium text-lg">${property.price}/mo</p>
                        <p className="text-muted-foreground mb-2">{`${property.address}, ${property.city}`}</p>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <p className="text-muted-foreground">Bedrooms</p>
                              <p className="font-medium">{property.bedrooms}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Bathrooms</p>
                              <p className="font-medium">{property.bathrooms}</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground">Square Feet</p>
                            <p className="font-medium">{property.squareFeet} sq ft</p>
                          </div>
                          
                          <div>
                            <p className="text-muted-foreground">Amenities</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {property.amenities?.map((amenity, i) => (
                                <span key={i} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded-full">
                                  {amenity}
                                </span>
                              ))}
                              {!property.amenities?.length && <p>None listed</p>}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
            
            {comparisonData.length > 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Comparison Table</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Feature</th>
                          {comparisonData.map((property, index) => (
                            <th key={property.id} className="text-left py-2">
                              Property {index + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 font-medium">Price</td>
                          {comparisonData.map((property) => (
                            <td key={property.id} className="py-3">${property.price}/mo</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 font-medium">Bedrooms</td>
                          {comparisonData.map((property) => (
                            <td key={property.id} className="py-3">{property.bedrooms}</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 font-medium">Bathrooms</td>
                          {comparisonData.map((property) => (
                            <td key={property.id} className="py-3">{property.bathrooms}</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 font-medium">Square Feet</td>
                          {comparisonData.map((property) => (
                            <td key={property.id} className="py-3">{property.squareFeet} sq ft</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 font-medium">Location</td>
                          {comparisonData.map((property) => (
                            <td key={property.id} className="py-3">{`${property.city}, ${property.state}`}</td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 font-medium">Pet Friendly</td>
                          {comparisonData.map((property) => (
                            <td key={property.id} className="py-3">
                              {property.amenities?.some(amenity => 
                                amenity.toLowerCase().includes('pet')) ? 
                                <Check className="text-green-500 h-5 w-5" /> : 
                                <X className="text-red-500 h-5 w-5" />
                              }
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ComparisonPage;
