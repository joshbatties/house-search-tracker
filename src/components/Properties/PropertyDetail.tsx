
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePropertyStore } from '@/store/propertyStore';
import { format } from 'date-fns';
import { 
  MapPin, Bed, Bath, Home, ExternalLink, Edit, Trash2, ChevronLeft, 
  Heart, Calendar, Pencil, Tag, Check, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const statusColors = {
  interested: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  viewed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  applied: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  accepted: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
};

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProperty, deleteProperty, toggleFavorite } = usePropertyStore();
  const property = getProperty(id || '');
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h3 className="text-2xl font-semibold mb-2">Property Not Found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">The property you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/properties">Back to Properties</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteProperty(property.id);
    toast.success('Property deleted successfully');
    navigate('/properties');
  };
  
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="mb-4"
          >
            <Link to="/properties">
              <ChevronLeft size={16} className="mr-1" />
              Back to Properties
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">{property.title}</h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => toggleFavorite(property.id)}
                aria-label={property.favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  size={18} 
                  className={cn(
                    property.favorite ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"
                  )} 
                />
              </Button>
              
              <Button variant="outline" size="icon" asChild>
                <Link to={`/properties/edit/${property.id}`}>
                  <Edit size={18} />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className={cn("font-medium capitalize", statusColors[property.status])}>
              {property.status}
            </Badge>
            
            <Badge variant="outline" className="flex items-center">
              <Tag size={14} className="mr-1" />
              ${property.price.toLocaleString()}/month
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="rounded-xl overflow-hidden aspect-video mb-6">
              <img 
                src={property.imageUrl} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-subtle p-6 space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About this property</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {property.description || "No description provided."}
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Location</h2>
                <div className="flex items-start">
                  <MapPin className="text-gray-500 dark:text-gray-400 mt-1 mr-2 flex-shrink-0" size={18} />
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">{property.address}</p>
                    <p className="text-gray-700 dark:text-gray-300">
                      {property.city}, {property.state} {property.zipCode}
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h2 className="text-xl font-semibold mb-3">Property Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <Bed className="text-gray-500 dark:text-gray-400 mr-2" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">
                      {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Bath className="text-gray-500 dark:text-gray-400 mr-2" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">
                      {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <Home className="text-gray-500 dark:text-gray-400 mr-2" size={18} />
                    <span className="text-gray-700 dark:text-gray-300">
                      {property.squareFeet.toLocaleString()} sq ft
                    </span>
                  </div>
                </div>
              </div>
              
              {property.amenities.length > 0 && (
                <>
                  <Separator />
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="flex items-center"
                        >
                          <Check size={12} className="mr-1" />
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {property.notes && (
                <>
                  <Separator />
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Notes</h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {property.notes}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-subtle p-5">
              <h3 className="font-semibold text-lg mb-4">Property Info</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date Added</p>
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {format(new Date(property.dateAdded), 'PPP')}
                    </span>
                  </div>
                </div>
                
                {property.listingUrl && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Original Listing</p>
                    <a 
                      href={property.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      <span className="break-all">View Listing</span>
                    </a>
                  </div>
                )}
                
                {(property.contactName || property.contactPhone || property.contactEmail) && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contact Information</p>
                    <div className="space-y-2">
                      {property.contactName && (
                        <p className="text-gray-700 dark:text-gray-300">{property.contactName}</p>
                      )}
                      {property.contactPhone && (
                        <p className="text-gray-700 dark:text-gray-300">{property.contactPhone}</p>
                      )}
                      {property.contactEmail && (
                        <a 
                          href={`mailto:${property.contactEmail}`}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        >
                          {property.contactEmail}
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-subtle p-5">
              <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Button asChild className="w-full justify-start">
                  <Link to={`/map?property=${property.id}`}>
                    <MapPin size={16} className="mr-2" />
                    View on Map
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="w-full justify-start">
                  <Link to={`/properties/edit/${property.id}`}>
                    <Pencil size={16} className="mr-2" />
                    Edit Details
                  </Link>
                </Button>
                
                {property.listingUrl && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    asChild
                  >
                    <a 
                      href={property.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      Open Original Listing
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{property.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyDetail;
