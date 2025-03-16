
import { useState, useEffect } from "react";
import { format, parseISO, isToday } from "date-fns";
import { toast } from "sonner";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import Layout from "@/components/Layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { PropertyViewing } from "@/types/PropertyViewing";
import { Property } from "@/types/Property";
import { viewingsService } from "@/services/viewings";
import { propertyService } from "@/services/property";
import { CalendarIcon, HomeIcon, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const CalendarPage = () => {
  const [viewings, setViewings] = useState<PropertyViewing[]>([]);
  const [properties, setProperties] = useState<Record<string, Property>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedViewing, setSelectedViewing] = useState<PropertyViewing | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const loadViewings = async () => {
      setIsLoading(true);
      try {
        const viewingsData = await viewingsService.getAllViewings();
        
        // Only load scheduled viewings
        const scheduledViewings = viewingsData.filter(v => v.status === "scheduled");
        setViewings(scheduledViewings);
        
        // Load property data for each viewing
        const propertyIds = [...new Set(scheduledViewings.map(v => v.propertyId))];
        const propertiesData: Record<string, Property> = {};
        
        for (const propertyId of propertyIds) {
          try {
            const property = await propertyService.getProperty(propertyId);
            if (property) {
              propertiesData[propertyId] = property;
            }
          } catch (err) {
            console.error(`Error loading property ${propertyId}:`, err);
          }
        }
        
        setProperties(propertiesData);
      } catch (error) {
        console.error("Error loading viewings:", error);
        toast.error("Failed to load viewings");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadViewings();
  }, []);

  // Create a map of dates to viewings for the calendar
  const viewingDates = viewings.reduce((acc, viewing) => {
    const date = viewing.date.split('T')[0]; // Get YYYY-MM-DD format
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(viewing);
    return acc;
  }, {} as Record<string, PropertyViewing[]>);

  // Filter viewings for the selected date
  const selectedDateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const viewingsOnSelectedDate = viewingDates[selectedDateStr] || [];

  // Event handler for clicking on a viewing
  const handleViewingClick = (viewing: PropertyViewing) => {
    setSelectedViewing(viewing);
    setIsDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Viewing Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-[350px] bg-muted rounded-md"></div>
                </div>
              ) : (
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                  modifiers={{
                    hasViewings: Object.keys(viewingDates).map(date => new Date(date)),
                    today: [new Date()],
                  }}
                  modifiersStyles={{
                    hasViewings: {
                      backgroundColor: "rgb(219 234 254)",
                      color: "rgb(29 78 216)",
                      fontWeight: "bold",
                    },
                    today: {
                      fontWeight: "bold",
                    }
                  }}
                  components={{
                    DayContent: ({ date }) => {
                      const dateStr = format(date, 'yyyy-MM-dd');
                      const hasViewings = !!viewingDates[dateStr]?.length;
                      
                      return (
                        <div className="relative flex h-9 w-9 items-center justify-center">
                          {date.getDate()}
                          {hasViewings && (
                            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1 w-1 rounded-full bg-blue-600"></div>
                          )}
                        </div>
                      );
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>
                {selectedDate ? (
                  <>
                    Viewings on {format(selectedDate, 'MMMM d, yyyy')}
                    {isToday(selectedDate) && (
                      <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        Today
                      </Badge>
                    )}
                  </>
                ) : (
                  "Select a date to see viewings"
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-20 bg-muted rounded-md"></div>
                    </div>
                  ))}
                </div>
              ) : viewingsOnSelectedDate.length > 0 ? (
                <div className="space-y-4">
                  {viewingsOnSelectedDate.map(viewing => {
                    const property = properties[viewing.propertyId];
                    return (
                      <div
                        key={viewing.id}
                        className="border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900 p-4 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
                        onClick={() => handleViewingClick(viewing)}
                      >
                        <div className="flex flex-col md:flex-row justify-between gap-2">
                          <div>
                            <div className="font-semibold">
                              {property ? property.title : "Unknown Property"}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {viewing.startTime} - {viewing.endTime}
                            </div>
                            {property && (
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {property.address}, {property.city}
                              </div>
                            )}
                          </div>
                          <Badge className="self-start">
                            Viewing
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  {selectedDate ? "No viewings scheduled for this date." : "Select a date to see viewings."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          {selectedViewing && (
            <>
              <DialogHeader>
                <DialogTitle>Viewing Details</DialogTitle>
                <DialogDescription>
                  {format(parseISO(selectedViewing.date), 'EEEE, MMMM d, yyyy')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium">Time</div>
                    <div>{selectedViewing.startTime} - {selectedViewing.endTime}</div>
                  </div>
                </div>
                
                {properties[selectedViewing.propertyId] && (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <HomeIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium">Property</div>
                        <div className="font-bold">{properties[selectedViewing.propertyId].title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {properties[selectedViewing.propertyId].address},<br />
                          {properties[selectedViewing.propertyId].city}, {properties[selectedViewing.propertyId].state} {properties[selectedViewing.propertyId].zipCode}
                        </div>
                        <Link 
                          to={`/properties/${selectedViewing.propertyId}`} 
                          className="text-sm text-blue-600 dark:text-blue-400 hover:underline block mt-2"
                        >
                          View Property Details
                        </Link>
                      </div>
                    </div>
                  </>
                )}
                
                {selectedViewing.notes && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                      <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">Notes</div>
                      <div>{selectedViewing.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default CalendarPage;
