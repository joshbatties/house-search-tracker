
import Layout from "@/components/Layout/Layout";
import PropertyDetail from "@/components/Properties/PropertyDetail";
import { useParams, useNavigate, Link } from "react-router-dom";
import { usePropertyStore } from "@/store/propertyStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const PropertyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { properties, deleteProperty } = usePropertyStore();
  // Get property by id
  const property = properties.find(p => p.id === id);

  const handleDelete = () => {
    if (id) {
      deleteProperty(id);
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted.",
      });
      navigate("/properties");
    }
  };

  if (!property) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <h1 className="text-2xl font-bold">Property Not Found</h1>
          <p className="text-muted-foreground">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <a href="/properties">View All Properties</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{property.title}</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to={`/edit-property/${property.id}`} className="flex items-center gap-2">
                <Pencil className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the property from your account.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <PropertyDetail property={property} />
      </div>
    </Layout>
  );
};

export default PropertyDetailPage;
