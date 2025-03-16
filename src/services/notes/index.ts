
import { PropertyNote } from "@/types/PropertyNote";
import { v4 as uuid } from "uuid";

// Simulated local storage for notes
const NOTES_STORAGE_KEY = 'property_notes';

// Helper functions
const getStoredNotes = (): PropertyNote[] => {
  const notes = localStorage.getItem(NOTES_STORAGE_KEY);
  return notes ? JSON.parse(notes) : [];
};

const storeNotes = (notes: PropertyNote[]) => {
  localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
};

// Service methods
export const notesService = {
  getNotes: async (propertyId: string): Promise<PropertyNote[]> => {
    const notes = getStoredNotes();
    return notes.filter(note => note.propertyId === propertyId);
  },
  
  addNote: async (propertyId: string, content: string): Promise<PropertyNote> => {
    const notes = getStoredNotes();
    const newNote: PropertyNote = {
      id: uuid(),
      propertyId,
      content,
      createdAt: new Date().toISOString(),
      isPinned: false
    };
    
    storeNotes([...notes, newNote]);
    return newNote;
  },
  
  updateNote: async (noteId: string, updates: Partial<PropertyNote>): Promise<PropertyNote> => {
    const notes = getStoredNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }
    
    const updatedNote = {
      ...notes[noteIndex],
      ...updates
    };
    
    notes[noteIndex] = updatedNote;
    storeNotes(notes);
    
    return updatedNote;
  },
  
  deleteNote: async (noteId: string): Promise<void> => {
    const notes = getStoredNotes();
    const filteredNotes = notes.filter(note => note.id !== noteId);
    storeNotes(filteredNotes);
  },
  
  togglePinned: async (noteId: string): Promise<PropertyNote> => {
    const notes = getStoredNotes();
    const noteIndex = notes.findIndex(note => note.id === noteId);
    
    if (noteIndex === -1) {
      throw new Error('Note not found');
    }
    
    const updatedNote = {
      ...notes[noteIndex],
      isPinned: !notes[noteIndex].isPinned
    };
    
    notes[noteIndex] = updatedNote;
    storeNotes(notes);
    
    return updatedNote;
  }
};
