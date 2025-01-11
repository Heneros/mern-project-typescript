import asyncHandler from 'express-async-handler';
import Property from '@/models/propertiesModel';

// $-title   PATCH property
// $-path    PATCH /api/v1/property/:id
// $-auth    Private

const updateProperty = asyncHandler(async (req, res): Promise<void> => {
    const propertyId = req.params.id;

    const property = await Property.findById(propertyId);

    if (!property) {
        res.status(404).json({ message: 'Property not found' });
    }

    const fieldsToUpdate = req.body;

    const updatedProperty = await Property.findByIdAndUpdate(
        propertyId,
        { ...fieldsToUpdate },
        { new: true, runValidators: true },
    );

    if (!updatedProperty) {
        res.status(400).json({ message: 'Property could not be updated' });
        return;
    }

    res.json({
        success: true,
        message: `Property was updated! ${updatedProperty.title}`,
        updatedProperty,
    });
});

export default updateProperty;
