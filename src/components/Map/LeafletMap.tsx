
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Property } from '@/types/Property';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  properties: Property[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (property: Property) => void;
  highlightedPropertyId?: string;
}

const LeafletMap = ({ 
  properties, 
  center = [37.7749, -122.4194], // Default to San Francisco
  zoom = 12,
  onMarkerClick,
  highlightedPropertyId 
}: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{[id: string]: L.Marker}>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;
    
    // Initialize map if it doesn't exist
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom);
      
      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    } else {
      // Update view if center or zoom changes
      mapRef.current.setView(center, zoom);
    }

    // Add markers for properties
    properties.forEach(property => {
      if (!mapRef.current) return;
      
      // Check if marker already exists
      if (markersRef.current[property.id]) return;
      
      // Create marker for property
      const marker = L.marker([property.latitude, property.longitude])
        .addTo(mapRef.current)
        .bindPopup(`
          <div>
            <strong>${property.title}</strong><br/>
            $${property.price}/month<br/>
            ${property.bedrooms} bd | ${property.bathrooms} ba | ${property.squareFeet} sqft
          </div>
        `);
      
      // Add click handler
      marker.on('click', () => {
        if (onMarkerClick) {
          onMarkerClick(property);
        }
      });
      
      // Store marker reference
      markersRef.current[property.id] = marker;
    });
    
    // Highlight property if needed
    if (highlightedPropertyId && markersRef.current[highlightedPropertyId]) {
      const marker = markersRef.current[highlightedPropertyId];
      marker.openPopup();
      
      if (mapRef.current) {
        mapRef.current.setView(
          [
            properties.find(p => p.id === highlightedPropertyId)?.latitude || center[0],
            properties.find(p => p.id === highlightedPropertyId)?.longitude || center[1]
          ],
          15
        );
      }
    }
    
    // Clean up map on unmount
    return () => {
      if (mapRef.current) {
        // mapRef.current.remove();
        // Don't remove the map on every rerender
      }
    };
  }, [properties, center, zoom, onMarkerClick, highlightedPropertyId]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
};

export default LeafletMap;
