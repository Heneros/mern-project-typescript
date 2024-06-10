import asyncHandler from 'express-async-handler';
import Property from '../../models/propertiesModel.js';

// $-title   UPDATE property
// $-path    PUT /api/v1/property/:id
// $-auth    Private

const updateProperty = asyncHandler(async (req, res) => {
    const propertyId = req.params.id; 

    const property = await Property.findById(propertyId);

    if (!property) {
        return res.status(404).json({ message: 'Property not found' });
    }

    const fieldsToUpdate = req.body;

    const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        { ...fieldsToUpdate },
        { new: true, runValidators: true }
    );

    if (!updatedProperty) {
        return res.status(400).json({ message: 'Property could not be updated' });
    }

    res.json({
        success: true,
        message: `Property was updated! ${updatedProperty.title}`,
        updatedProperty,
    });
});

export default updateProperty;
