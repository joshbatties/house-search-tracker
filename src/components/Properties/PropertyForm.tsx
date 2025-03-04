import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePropertyStore } from '@/store/propertyStore';
import { Property } from '@/types/Property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// Update the PropertyFormProps interface to include additional props
export interface PropertyFormProps {
  editProperty?: Property;
  onSubmit: (data: Omit<Property, "id" | "createdAt" | "updatedAt" | "dateAdded">) => void;
  isSubmitting?: boolean;
  isDisabled?: boolean;
}

const PropertyForm = ({ 
  editProperty, 
  onSubmit, 
  isSubmitting = false,
  isDisabled = false
}: PropertyFormProps) => {
  const navigate = useNavigate();
  const { addProperty, updateProperty } = usePropertyStore();

  const [formData, setFormData] = useState<Partial<Property>>(
    editProperty || {
      title: '',
      description: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      squareFeet: 0,
      imageUrl: '',
      listingUrl: '',
      latitude: 0,
      longitude: 0,
      notes: '',
      favorite: false,
      status: 'interested',
      amenities: [],
    }
  );

  const [amenityInput, setAmenityInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields
    if (['price', 'bedrooms', 'bathrooms', 'squareFeet', 'latitude', 'longitude'].includes(name)) {
      setFormData({
        ...formData,
        [name]: name === 'bedrooms' ? parseInt(value) : parseFloat(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value as Property['status'],
    });
  };

  const addAmenity = () => {
    if (amenityInput.trim() && formData.amenities) {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenityInput.trim()],
      });
      setAmenityInput('');
    }
  };

  const removeAmenity = (index: number) => {
    if (formData.amenities) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      const requiredFields = ['title', 'price', 'address', 'city', 'state'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      // Call the onSubmit handler passed as a prop
      onSubmit(formData as Omit<Property, "id" | "createdAt" | "updatedAt" | "dateAdded">);
    } catch (error) {
      toast.error('An error occurred while saving the property.');
      console.error(error);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-card">
      <CardHeader>
        <CardTitle>{editProperty ? 'Edit Property' : 'Add New Property'}</CardTitle>
        <CardDescription>
          {editProperty 
            ? 'Update the details of your property' 
            : 'Enter the details of the property you are interested in'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="required">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., Spacious Downtown Apartment"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price" className="required">Monthly Rent ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  min={0}
                  step={50}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the property..."
                rows={3}
              />
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location</h3>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="required">Street Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="required">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state" className="required">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interested">Interested</SelectItem>
                    <SelectItem value="viewed">Viewed</SelectItem>
                    <SelectItem value="applied">Applied</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="0.000001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="0.000001"
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Property Details</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  min={0}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  min={0}
                  step={0.5}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="squareFeet">Square Feet</Label>
                <Input
                  id="squareFeet"
                  name="squareFeet"
                  type="number"
                  value={formData.squareFeet}
                  onChange={handleChange}
                  min={0}
                  step={10}
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Links & Media</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="listingUrl">Listing URL</Label>
                <Input
                  id="listingUrl"
                  name="listingUrl"
                  type="url"
                  value={formData.listingUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Amenities</h3>
            
            <div className="flex space-x-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="Add amenity (e.g., In-unit Laundry)"
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAmenity();
                  }
                }}
              />
              <Button type="button" onClick={addAmenity} variant="outline">
                Add
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {formData.amenities?.map((amenity, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-sm"
                >
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notes</h3>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional notes about the property..."
                rows={4}
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || isDisabled}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Saving...</span>
                {/* You could add a spinner here if desired */}
              </>
            ) : (
              editProperty ? 'Update Property' : 'Add Property'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PropertyForm;
