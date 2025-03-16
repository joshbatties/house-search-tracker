
import { useState } from "react";
import { Share2, Copy, Mail, Link as LinkIcon } from "lucide-react";
import { 
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui";
import { Property } from "@/types/Property";
import { toast } from "sonner";

interface SharePropertyProps {
  property: Property;
}

const ShareProperty = ({ property }: SharePropertyProps) => {
  const [open, setOpen] = useState(false);
  
  const propertyUrl = `${window.location.origin}/properties/${property.id}`;
  const mailSubject = `Check out this property: ${property.title}`;
  const mailBody = `I thought you might be interested in this property:\n\n${property.title}\n${property.address}, ${property.city}, ${property.state} ${property.zipCode}\n\nPrice: $${property.price}/month\n\nView details: ${propertyUrl}`;
  const mailtoLink = `mailto:?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

  const copyLink = () => {
    navigator.clipboard.writeText(propertyUrl)
      .then(() => {
        toast.success("Link copied to clipboard");
        setOpen(false);
      })
      .catch(err => {
        console.error("Failed to copy link:", err);
        toast.error("Failed to copy link");
      });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share property</span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Share property
        </TooltipContent>
      </Tooltip>
      
      <PopoverContent className="w-72 p-4" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Share this property</h3>
            <p className="text-sm text-muted-foreground">
              Share details of {property.title} with others
            </p>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start" 
              onClick={copyLink}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start" 
              asChild
            >
              <a href={mailtoLink}>
                <Mail className="mr-2 h-4 w-4" />
                Email
              </a>
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              asChild
            >
              <a href={property.listingUrl || "#"} target="_blank" rel="noopener noreferrer">
                <LinkIcon className="mr-2 h-4 w-4" />
                View original listing
              </a>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareProperty;
