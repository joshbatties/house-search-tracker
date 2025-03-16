
export interface PropertyViewing {
  id: string;
  propertyId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes: string;
  attendees?: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}
