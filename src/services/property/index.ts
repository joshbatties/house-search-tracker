
// Export all services
import { getProperties, getProperty } from './getPropertyService';
import { createProperty } from './createPropertyService';
import { updateProperty, toggleFavorite } from './updatePropertyService';
import { deleteProperty } from './deletePropertyService';
import { PropertyInput } from './types';

export const propertyService = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  toggleFavorite
};

export type { PropertyInput };
