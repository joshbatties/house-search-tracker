
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { PropertyReminder } from "@/types/PropertyReminder";
import { remindersService } from "@/services/reminders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, CheckCircle2, Circle } from "lucide-react";

const PropertyReminders = () => {
  const { id } = useParams<{ id: string }>();
  const [reminders, setReminders] = useState<PropertyReminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newReminderTitle, setNewReminderTitle] = useState("");
  const [newReminderDate, setNewReminderDate] = useState<Date | undefined>(undefined);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const loadReminders = async () => {
      setIsLoading(true);
      try {
        const data = await remindersService.getReminders(id);
        setReminders(data);
      } catch (error) {
        console.error("Error loading reminders:", error);
        toast.error("Failed to load property reminders");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReminders();
  }, [id]);

  const handleAddReminder = async () => {
    if (!id || !newReminderTitle.trim() || !newReminderDate) return;
    
    try {
      const newReminder = await remindersService.addReminder(
        id,
        newReminderTitle.trim(),
        newReminderDate.toISOString()
      );
      
      setReminders(prev => [...prev, newReminder]);
      setNewReminderTitle("");
      setNewReminderDate(undefined);
      setCalendarOpen(false);
      toast.success("Reminder added successfully");
    } catch (error) {
      console.error("Error adding reminder:", error);
      toast.error("Failed to add reminder");
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await remindersService.deleteReminder(reminderId);
      setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));
      toast.success("Reminder deleted successfully");
    } catch (error) {
      console.error("Error deleting reminder:", error);
      toast.error("Failed to delete reminder");
    }
  };

  const handleToggleCompleted = async (reminderId: string) => {
    try {
      const updatedReminder = await remindersService.toggleCompleted(reminderId);
      setReminders(prev => prev.map(reminder => reminder.id === reminderId ? updatedReminder : reminder));
    } catch (error) {
      console.error("Error toggling reminder status:", error);
      toast.error("Failed to update reminder");
    }
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    // Sort by completion status, then by date (upcoming first)
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          Reminders & To-Dos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Add a new reminder..."
            value={newReminderTitle}
            onChange={(e) => setNewReminderTitle(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !newReminderDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newReminderDate ? (
                    format(newReminderDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newReminderDate}
                  onSelect={(date) => {
                    setNewReminderDate(date);
                    if (date) setCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              onClick={handleAddReminder}
              disabled={!newReminderTitle.trim() || !newReminderDate}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
        
        <div className="space-y-3 mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-muted rounded-md"></div>
                </div>
              ))}
            </div>
          ) : sortedReminders.length > 0 ? (
            sortedReminders.map((reminder) => {
              const reminderDate = new Date(reminder.date);
              const isPastDue = !reminder.isCompleted && reminderDate < new Date();
              
              return (
                <div
                  key={reminder.id}
                  className={`p-3 rounded-md flex items-center justify-between border ${
                    reminder.isCompleted
                      ? "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/30"
                      : isPastDue
                      ? "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900"
                      : "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => handleToggleCompleted(reminder.id)}
                    >
                      {reminder.isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    
                    <div>
                      <div className={`font-medium ${reminder.isCompleted ? "line-through text-gray-500" : ""}`}>
                        {reminder.title}
                      </div>
                      <div className={`text-xs ${
                        reminder.isCompleted
                          ? "text-gray-500"
                          : isPastDue
                          ? "text-red-600 dark:text-red-400"
                          : "text-blue-600 dark:text-blue-400"
                      }`}>
                        {format(reminderDate, "PPP")}
                        {isPastDue && " (Past due)"}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                    onClick={() => handleDeleteReminder(reminder.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No reminders set. Add your first reminder above.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyReminders;
