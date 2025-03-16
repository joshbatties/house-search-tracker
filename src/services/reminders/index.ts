
import { PropertyReminder } from "@/types/PropertyReminder";
import { v4 as uuid } from "uuid";

// Simulated local storage for reminders
const REMINDERS_STORAGE_KEY = 'property_reminders';

// Helper functions
const getStoredReminders = (): PropertyReminder[] => {
  const reminders = localStorage.getItem(REMINDERS_STORAGE_KEY);
  return reminders ? JSON.parse(reminders) : [];
};

const storeReminders = (reminders: PropertyReminder[]) => {
  localStorage.setItem(REMINDERS_STORAGE_KEY, JSON.stringify(reminders));
};

// Service methods
export const remindersService = {
  getReminders: async (propertyId: string): Promise<PropertyReminder[]> => {
    const reminders = getStoredReminders();
    return reminders.filter(reminder => reminder.propertyId === propertyId);
  },
  
  getAllReminders: async (): Promise<PropertyReminder[]> => {
    return getStoredReminders();
  },
  
  addReminder: async (propertyId: string, title: string, date: string): Promise<PropertyReminder> => {
    const reminders = getStoredReminders();
    const newReminder: PropertyReminder = {
      id: uuid(),
      propertyId,
      title,
      date,
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    
    storeReminders([...reminders, newReminder]);
    return newReminder;
  },
  
  updateReminder: async (reminderId: string, updates: Partial<PropertyReminder>): Promise<PropertyReminder> => {
    const reminders = getStoredReminders();
    const reminderIndex = reminders.findIndex(reminder => reminder.id === reminderId);
    
    if (reminderIndex === -1) {
      throw new Error('Reminder not found');
    }
    
    const updatedReminder = {
      ...reminders[reminderIndex],
      ...updates
    };
    
    reminders[reminderIndex] = updatedReminder;
    storeReminders(reminders);
    
    return updatedReminder;
  },
  
  deleteReminder: async (reminderId: string): Promise<void> => {
    const reminders = getStoredReminders();
    const filteredReminders = reminders.filter(reminder => reminder.id !== reminderId);
    storeReminders(filteredReminders);
  },
  
  toggleCompleted: async (reminderId: string): Promise<PropertyReminder> => {
    const reminders = getStoredReminders();
    const reminderIndex = reminders.findIndex(reminder => reminder.id === reminderId);
    
    if (reminderIndex === -1) {
      throw new Error('Reminder not found');
    }
    
    const updatedReminder = {
      ...reminders[reminderIndex],
      isCompleted: !reminders[reminderIndex].isCompleted
    };
    
    reminders[reminderIndex] = updatedReminder;
    storeReminders(reminders);
    
    return updatedReminder;
  }
};
