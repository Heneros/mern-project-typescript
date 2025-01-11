import { createPropertySwagger } from './properties/createProperty.swagger';
import { getAllPropertiesSwagger } from './properties/getAllProperties.swagger';
import { idPropertySwagger } from './properties/idPropertySwagger';

export const propertiesSwagger = {
    ...createPropertySwagger,
    ...getAllPropertiesSwagger,
    ...idPropertySwagger,
};
