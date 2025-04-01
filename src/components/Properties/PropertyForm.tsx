import { useState, useCallback } from 'react';
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
import { PlusCircle, MinusCircle, Upload, X, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

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
      positiveFeatures: [],
      negativeFeatures: [],
    }
  );

  const [amenityInput, setAmenityInput] = useState('');
  const [positiveFeatureInput, setPositiveFeatureInput] = useState('');
  const [negativeFeatureInput, setNegativeFeatureInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    editProperty?.imageUrl ? editProperty.imageUrl : null
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    if (!file.type.startsWith('image/')) {
      toast.error('Only images are accepted');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `property-images/${fileName}`;

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100;
            setUploadProgress(percent);
          },
        });

      if (error) {
        throw error;
      }

      setFormData({
        ...formData,
        imageUrl: filePath,
      });

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  }, [formData]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif']
    },
    maxFiles: 1
  });

  const removeImage = () => {
    setPreviewUrl(null);
    setFormData({
      ...formData,
      imageUrl: '',
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

  const addPositiveFeature = () => {
    if (positiveFeatureInput.trim() && formData.positiveFeatures) {
      setFormData({
        ...formData,
        positiveFeatures: [...formData.positiveFeatures, positiveFeatureInput.trim()],
      });
      setPositiveFeatureInput('');
    }
  };

  const removePositiveFeature = (index: number) => {
    if (formData.positiveFeatures) {
      setFormData({
        ...formData,
        positiveFeatures: formData.positiveFeatures.filter((_, i) => i !== index),
      });
    }
  };

  const addNegativeFeature = () => {
    if (negativeFeatureInput.trim() && formData.negativeFeatures) {
      setFormData({
        ...formData,
        negativeFeatures: [...formData.negativeFeatures, negativeFeatureInput.trim()],
      });
      setNegativeFeatureInput('');
    }
  };

  const removeNegativeFeature = (index: number) => {
    if (formData.negativeFeatures) {
      setFormData({
        ...formData,
        negativeFeatures: formData.negativeFeatures.filter((_, i) => i !== index),
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const requiredFields = ['title', 'price', 'address', 'city', 'state'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        return;
      }
      
      onSubmit(formData as Omit<Property, "id" | "createdAt" | "updatedAt" | "dateAdded">);
    } catch (error) {
      toast.error('An error occurred while saving the property.');
      console.error(error);
    }
  };

  const getImageDisplayUrl = useCallback(async () => {
    if (!previewUrl && formData.imageUrl) {
      if (formData.imageUrl.startsWith('property-images/')) {
        const { data } = supabase.storage.from('property-images').getPublicUrl(formData.imageUrl);
        setPreviewUrl(data.publicUrl);
      } else {
        setPreviewUrl(formData.imageUrl);
      }
    }
  }, [formData.imageUrl, previewUrl]);

  React.useEffect(() => {
    getImageDisplayUrl();
  }, [getImageDisplayUrl]);

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
            <h3 className="text-lg font-medium">Images & Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Property Image</Label>
                
                {previewUrl ? (
                  <div className="relative w-full h-48 rounded-md overflow-hidden border border-border">
                    <img 
                      src={previewUrl} 
                      alt="Property preview" 
                      className="w-full h-full object-cover"
                    />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-black/90 transition-colors"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                      isDragActive 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      {isDragActive ? (
                        <p>Drop the image here...</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium">Drag & drop an image here</p>
                          <p className="text-xs text-muted-foreground">or click to select a file</p>
                          <p className="text-xs text-muted-foreground">Max size: 5MB</p>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                {isUploading && (
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  Upload an image of the property or paste a URL below
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="space-y-2 mb-4">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl && !formData.imageUrl.startsWith('property-images/') ? formData.imageUrl : ''}
                    onChange={handleChange}
                    placeholder="https://..."
                    disabled={!!previewUrl && formData.imageUrl?.startsWith('property-images/')}
                  />
                  <p className="text-xs text-muted-foreground">
                    You can paste an image URL or use the drag & drop uploader
                  </p>
                </div>
                
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
            <h3 className="text-lg font-medium">Property Features</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="positive-features" className="flex items-center gap-2 mb-2">
                  <PlusCircle className="h-4 w-4 text-green-500" />
                  Positive Features
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="positive-features"
                    value={positiveFeatureInput}
                    onChange={(e) => setPositiveFeatureInput(e.target.value)}
                    placeholder="Add positive feature (e.g., Close to public transit)"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPositiveFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addPositiveFeature} variant="outline">
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.positiveFeatures?.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removePositiveFeature(index)}
                        className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="negative-features" className="flex items-center gap-2 mb-2">
                  <MinusCircle className="h-4 w-4 text-red-500" />
                  Negative Features
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="negative-features"
                    value={negativeFeatureInput}
                    onChange={(e) => setNegativeFeatureInput(e.target.value)}
                    placeholder="Add negative feature (e.g., Limited parking)"
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addNegativeFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addNegativeFeature} variant="outline">
                    Add
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.negativeFeatures?.map((feature, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-sm"
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeNegativeFeature(index)}
                        className="ml-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
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
            disabled={isSubmitting || isDisabled || isUploading}
          >
            {isSubmitting ? (
              <>
                <span className="mr-2">Saving...</span>
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
