
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { PropertyViewing } from "@/types/PropertyViewing";
import { viewingsService } from "@/services/viewings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format, isBefore, isToday } from "date-fns";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CalendarDays, Calendar as CalendarCheck } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form schema for adding/editing viewings
const viewingFormSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string().min(1, "Please enter a start time"),
  endTime: z.string().min(1, "Please enter an end time"),
  notes: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]),
});

type ViewingFormValues = z.infer<typeof viewingFormSchema>;

const PropertyViewingSchedule = () => {
  const { id } = useParams<{ id: string }>();
  const [viewings, setViewings] = useState<PropertyViewing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form initialization
  const form = useForm<ViewingFormValues>({
    resolver: zodResolver(viewingFormSchema),
    defaultValues: {
      date: new Date(),
      startTime: "10:00",
      endTime: "11:00",
      notes: "",
      status: "scheduled",
    },
  });

  useEffect(() => {
    if (!id) return;
    
    const loadViewings = async () => {
      setIsLoading(true);
      try {
        const data = await viewingsService.getViewings(id);
        setViewings(data);
      } catch (error) {
        console.error("Error loading viewings:", error);
        toast.error("Failed to load property viewings");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadViewings();
  }, [id]);

  const onSubmit = async (data: ViewingFormValues) => {
    if (!id) return;
    
    try {
      const newViewing = await viewingsService.addViewing({
        propertyId: id,
        date: data.date.toISOString(),
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes || "",
        status: data.status,
      });
      
      setViewings(prev => [...prev, newViewing]);
      setIsDialogOpen(false);
      form.reset({
        date: new Date(),
        startTime: "10:00",
        endTime: "11:00",
        notes: "",
        status: "scheduled",
      });
      
      toast.success("Viewing scheduled successfully");
      
      // Add to calendar functionality could be implemented here
      // or through a separate button in the UI
    } catch (error) {
      console.error("Error scheduling viewing:", error);
      toast.error("Failed to schedule viewing");
    }
  };

  const handleDeleteViewing = async (viewingId: string) => {
    try {
      await viewingsService.deleteViewing(viewingId);
      setViewings(prev => prev.filter(viewing => viewing.id !== viewingId));
      toast.success("Viewing cancelled");
    } catch (error) {
      console.error("Error cancelling viewing:", error);
      toast.error("Failed to cancel viewing");
    }
  };

  const handleUpdateStatus = async (viewingId: string, newStatus: PropertyViewing['status']) => {
    try {
      const updatedViewing = await viewingsService.updateViewing(viewingId, { status: newStatus });
      setViewings(prev => prev.map(viewing => viewing.id === viewingId ? updatedViewing : viewing));
      
      const statusMessages = {
        scheduled: "Viewing rescheduled",
        completed: "Viewing marked as completed",
        cancelled: "Viewing cancelled"
      };
      
      toast.success(statusMessages[newStatus]);
    } catch (error) {
      console.error("Error updating viewing status:", error);
      toast.error("Failed to update viewing");
    }
  };

  // Sort viewings by date (most recent first)
  const sortedViewings = [...viewings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Group viewings by status
  const upcomingViewings = sortedViewings.filter(v => v.status === "scheduled");
  const pastViewings = sortedViewings.filter(v => v.status !== "scheduled");

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Viewing Schedule</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Viewing
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Schedule a Property Viewing</DialogTitle>
              <DialogDescription>
                Set up a date and time to view this property. You'll get a reminder before the viewing.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            disabled={(date) => isBefore(date, new Date()) && !isToday(date)}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any notes about the viewing..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Schedule Viewing</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded-md"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingViewings.length > 0 ? (
              <div className="space-y-3">
                <h3 className="text-md font-medium flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Upcoming Viewings
                </h3>
                {upcomingViewings.map((viewing) => (
                  <div
                    key={viewing.id}
                    className="border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900 p-4 rounded-md"
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold flex items-center">
                          <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                          {format(new Date(viewing.date), "PPP")}
                        </div>
                        <div className="text-sm flex items-center text-gray-600 dark:text-gray-300">
                          <Clock className="mr-2 h-4 w-4" />
                          {viewing.startTime} - {viewing.endTime}
                        </div>
                        {viewing.notes && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {viewing.notes}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Select
                          defaultValue={viewing.status}
                          onValueChange={(value) => handleUpdateStatus(viewing.id, value as PropertyViewing['status'])}
                        >
                          <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="completed">Mark Completed</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                          onClick={() => handleDeleteViewing(viewing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                No upcoming viewings scheduled.
              </div>
            )}
            
            {pastViewings.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-md font-medium flex items-center">
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  Past Viewings
                </h3>
                {pastViewings.slice(0, 3).map((viewing) => (
                  <div
                    key={viewing.id}
                    className={`border p-4 rounded-md ${
                      viewing.status === "completed"
                        ? "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900"
                        : "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900"
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold flex items-center">
                          <CalendarIcon className={`mr-2 h-4 w-4 ${
                            viewing.status === "completed" ? "text-green-500" : "text-red-500"
                          }`} />
                          {format(new Date(viewing.date), "PPP")}
                          <span className="ml-2 text-xs px-2 py-1 rounded-full capitalize bg-white dark:bg-gray-800">
                            {viewing.status}
                          </span>
                        </div>
                        <div className="text-sm flex items-center text-gray-600 dark:text-gray-300">
                          <Clock className="mr-2 h-4 w-4" />
                          {viewing.startTime} - {viewing.endTime}
                        </div>
                        {viewing.notes && (
                          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            {viewing.notes}
                          </div>
                        )}
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                        onClick={() => handleDeleteViewing(viewing.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {pastViewings.length > 3 && (
                  <div className="text-center text-sm text-blue-600 dark:text-blue-400">
                    +{pastViewings.length - 3} more past viewings
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyViewingSchedule;
