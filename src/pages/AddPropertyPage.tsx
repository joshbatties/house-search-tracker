
import Layout from "@/components/Layout/Layout";
import PropertyForm from "@/components/Properties/PropertyForm";
import { usePropertyStore } from "@/store/propertyStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/Property";

const AddPropertyPage = () => {
  const { addProperty } = usePropertyStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (data: Omit<Property, "id" | "createdAt" | "updatedAt" | "dateAdded">) => {
    try {
      const newProperty = await addProperty(data);
      
      toast({
        title: "Property Added",
        description: "Your property has been successfully added.",
      });
      
      navigate(`/properties/${newProperty.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Property</h1>
          <p className="text-muted-foreground">
            Enter the details of a rental property you're interested in
          </p>
        </div>
        
        <PropertyForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default AddPropertyPage;
