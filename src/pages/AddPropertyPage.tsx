
import Layout from "@/components/Layout/Layout";
import PropertyForm from "@/components/Properties/PropertyForm";
import { usePropertyStore } from "@/store/propertyStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/Property";
import { v4 as uuidv4 } from 'uuid';

const AddPropertyPage = () => {
  const { addProperty } = usePropertyStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (data: Omit<Property, "id" | "createdAt" | "updatedAt">) => {
    const newProperty = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addProperty(newProperty);
    
    toast({
      title: "Property Added",
      description: "Your property has been successfully added.",
    });
    
    navigate(`/properties/${newProperty.id}`);
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
