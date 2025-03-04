
import Layout from "@/components/Layout/Layout";
import PropertyForm from "@/components/Properties/PropertyForm";
import { usePropertyStore } from "@/store/propertyStore";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Property } from "@/types/Property";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

const AddPropertyPage = () => {
  const { addProperty } = usePropertyStore();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session, anonymousId, incrementPropertyCount, isAnonymousLimitReached, propertyCount } = useAuth();

  const handleSubmit = async (data: Omit<Property, "id" | "createdAt" | "updatedAt" | "dateAdded">) => {
    try {
      if (isAnonymousLimitReached) {
        toast({
          title: "Property Limit Reached",
          description: "You've reached the limit of 10 properties. Please create an account to add more.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      setIsSubmitting(true);
      const newProperty = await addProperty(data);
      
      // Increment property count for anonymous users
      if (!session && anonymousId) {
        incrementPropertyCount();
      }
      
      toast({
        title: "Property Added",
        description: "Your property has been successfully added.",
      });
      
      navigate(`/properties/${newProperty.id}`);
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
        
        {isAnonymousLimitReached ? (
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTitle className="text-yellow-800">Property Limit Reached</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You've added {propertyCount} properties. To add more, please{" "}
              <Link to="/auth" className="font-medium underline">create an account</Link>.
            </AlertDescription>
          </Alert>
        ) : !session && propertyCount > 0 ? (
          <Alert className="bg-blue-50 border-blue-200 mb-6">
            <AlertTitle className="text-blue-800">Anonymous Mode</AlertTitle>
            <AlertDescription className="text-blue-700">
              You've added {propertyCount} out of 10 allowed properties. Consider{" "}
              <Link to="/auth" className="font-medium underline">creating an account</Link>{" "}
              to save your properties permanently.
            </AlertDescription>
          </Alert>
        ) : null}
        
        <PropertyForm 
          onSubmit={handleSubmit} 
          isSubmitting={isSubmitting}
          isDisabled={isAnonymousLimitReached}
        />
      </div>
    </Layout>
  );
};

export default AddPropertyPage;
