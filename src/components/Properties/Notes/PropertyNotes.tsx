
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { PropertyNote } from "@/types/PropertyNote";
import { notesService } from "@/services/notes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pin, Trash } from "lucide-react";
import { format } from "date-fns";

const PropertyNotes = () => {
  const { id } = useParams<{ id: string }>();
  const [notes, setNotes] = useState<PropertyNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newNoteContent, setNewNoteContent] = useState("");

  useEffect(() => {
    if (!id) return;
    
    const loadNotes = async () => {
      setIsLoading(true);
      try {
        const data = await notesService.getNotes(id);
        setNotes(data);
      } catch (error) {
        console.error("Error loading notes:", error);
        toast.error("Failed to load property notes");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotes();
  }, [id]);

  const handleAddNote = async () => {
    if (!id || !newNoteContent.trim()) return;
    
    try {
      const newNote = await notesService.addNote(id, newNoteContent.trim());
      setNotes(prev => [...prev, newNote]);
      setNewNoteContent("");
      toast.success("Note added successfully");
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await notesService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleTogglePinned = async (noteId: string) => {
    try {
      const updatedNote = await notesService.togglePinned(noteId);
      setNotes(prev => prev.map(note => note.id === noteId ? updatedNote : note));
    } catch (error) {
      console.error("Error toggling pin status:", error);
      toast.error("Failed to update note");
    }
  };

  const sortedNotes = [...notes].sort((a, b) => {
    // Sort by pinned status first, then by creation date (newest first)
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          Property Notes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Add a new note..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="resize-none"
            rows={2}
          />
          <Button onClick={handleAddNote} size="sm" className="self-end">
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
        
        <div className="space-y-3 mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-24 bg-muted rounded-md"></div>
                </div>
              ))}
            </div>
          ) : sortedNotes.length > 0 ? (
            sortedNotes.map((note) => (
              <div
                key={note.id}
                className={`p-3 rounded-md relative border ${
                  note.isPinned ? "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-900" : "border-gray-200 dark:border-gray-800"
                }`}
              >
                <div className="flex justify-between items-start">
                  <p className="whitespace-pre-wrap">{note.content}</p>
                  <div className="flex space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => handleTogglePinned(note.id)}
                    >
                      <Pin
                        className={`h-4 w-4 ${
                          note.isPinned ? "fill-blue-500 text-blue-500" : "text-gray-400"
                        }`}
                      />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {format(new Date(note.createdAt), "MMM d, yyyy · h:mm a")}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No notes added yet. Add your first note above.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyNotes;
