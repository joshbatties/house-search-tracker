
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { NeighborhoodData, NeighborhoodAmenity } from "@/types/NeighborhoodAmenity";
import { neighborhoodService } from "@/services/neighborhood";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingBag,
  Utensils,
  School,
  Trees,
  Train,
  Dumbbell,
  Pill,
  Building,
  Star,
  MapPin,
  AlertCircle
} from "lucide-react";

const PropertyNeighborhood = () => {
  const { id } = useParams<{ id: string }>();
  const [neighborhoodData, setNeighborhoodData] = useState<NeighborhoodData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const loadNeighborhoodData = async () => {
      setIsLoading(true);
      try {
        const data = await neighborhoodService.getNeighborhoodData(id);
        setNeighborhoodData(data);
      } catch (error) {
        console.error("Error loading neighborhood data:", error);
        toast.error("Failed to load neighborhood data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNeighborhoodData();
  }, [id]);

  // Helper to get amenity icon
  const getAmenityIcon = (type: NeighborhoodAmenity['type']) => {
    const icons = {
      grocery: <ShoppingBag className="h-4 w-4" />,
      restaurant: <Utensils className="h-4 w-4" />,
      school: <School className="h-4 w-4" />,
      park: <Trees className="h-4 w-4" />,
      transit: <Train className="h-4 w-4" />,
      gym: <Dumbbell className="h-4 w-4" />,
      pharmacy: <Pill className="h-4 w-4" />,
      hospital: <Building className="h-4 w-4" />,
      shopping: <ShoppingBag className="h-4 w-4" />
    };
    
    return icons[type] || <MapPin className="h-4 w-4" />;
  };

  // Group amenities by type
  const groupedAmenities = neighborhoodData?.amenities.reduce((acc, amenity) => {
    if (!acc[amenity.type]) {
      acc[amenity.type] = [];
    }
    acc[amenity.type].push(amenity);
    return acc;
  }, {} as Record<string, NeighborhoodAmenity[]>) || {};

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Neighborhood Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-1/3 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded-md"></div>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-1/3 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded-md"></div>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-4 w-1/3 bg-muted rounded"></div>
              <div className="h-40 bg-muted rounded-md"></div>
            </div>
          </div>
        ) : neighborhoodData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Walk Score</h3>
                  <span className="text-2xl font-bold">{neighborhoodData.walkScore}</span>
                </div>
                <Progress value={neighborhoodData.walkScore} className="h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {neighborhoodData.walkScore >= 90 
                    ? "Walker's Paradise" 
                    : neighborhoodData.walkScore >= 70
                    ? "Very Walkable"
                    : neighborhoodData.walkScore >= 50
                    ? "Somewhat Walkable"
                    : "Car-Dependent"
                  }
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Transit Score</h3>
                  <span className="text-2xl font-bold">{neighborhoodData.transitScore}</span>
                </div>
                <Progress value={neighborhoodData.transitScore} className="h-2" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {neighborhoodData.transitScore >= 90 
                    ? "Rider's Paradise" 
                    : neighborhoodData.transitScore >= 70
                    ? "Excellent Transit"
                    : neighborhoodData.transitScore >= 50
                    ? "Good Transit"
                    : "Minimal Transit"
                  }
                </p>
              </div>
            </div>
            
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="essential">Essential</TabsTrigger>
                <TabsTrigger value="leisure">Leisure</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {neighborhoodData.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="border border-gray-200 dark:border-gray-800 p-3 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                          {getAmenityIcon(amenity.type)}
                        </div>
                        <div>
                          <div className="font-medium">{amenity.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {amenity.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{amenity.distance} mi</div>
                        {amenity.rating && (
                          <div className="flex items-center text-xs text-amber-500">
                            <Star className="h-3 w-3 fill-current mr-1" />
                            {amenity.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="essential" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...(groupedAmenities.grocery || []), ...(groupedAmenities.pharmacy || []), ...(groupedAmenities.transit || [])].map((amenity) => (
                    <div
                      key={amenity.id}
                      className="border border-gray-200 dark:border-gray-800 p-3 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                          {getAmenityIcon(amenity.type)}
                        </div>
                        <div>
                          <div className="font-medium">{amenity.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {amenity.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{amenity.distance} mi</div>
                        {amenity.rating && (
                          <div className="flex items-center text-xs text-amber-500">
                            <Star className="h-3 w-3 fill-current mr-1" />
                            {amenity.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!groupedAmenities.grocery && !groupedAmenities.pharmacy && !groupedAmenities.transit) && (
                    <div className="col-span-full flex items-center justify-center p-6 border border-dashed rounded-md">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                        <p>No essential amenities found nearby</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="leisure" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[...(groupedAmenities.restaurant || []), ...(groupedAmenities.park || []), ...(groupedAmenities.gym || []), ...(groupedAmenities.shopping || [])].map((amenity) => (
                    <div
                      key={amenity.id}
                      className="border border-gray-200 dark:border-gray-800 p-3 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                          {getAmenityIcon(amenity.type)}
                        </div>
                        <div>
                          <div className="font-medium">{amenity.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {amenity.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{amenity.distance} mi</div>
                        {amenity.rating && (
                          <div className="flex items-center text-xs text-amber-500">
                            <Star className="h-3 w-3 fill-current mr-1" />
                            {amenity.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!groupedAmenities.restaurant && !groupedAmenities.park && !groupedAmenities.gym && !groupedAmenities.shopping) && (
                    <div className="col-span-full flex items-center justify-center p-6 border border-dashed rounded-md">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                        <p>No leisure amenities found nearby</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="education" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(groupedAmenities.school || []).map((amenity) => (
                    <div
                      key={amenity.id}
                      className="border border-gray-200 dark:border-gray-800 p-3 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full">
                          {getAmenityIcon(amenity.type)}
                        </div>
                        <div>
                          <div className="font-medium">{amenity.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {amenity.type}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{amenity.distance} mi</div>
                        {amenity.rating && (
                          <div className="flex items-center text-xs text-amber-500">
                            <Star className="h-3 w-3 fill-current mr-1" />
                            {amenity.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {(!groupedAmenities.school) && (
                    <div className="col-span-full flex items-center justify-center p-6 border border-dashed rounded-md">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                        <p>No educational facilities found nearby</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
            Unable to load neighborhood data.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyNeighborhood;
