import asyncHandler from 'express-async-handler';
import Property from '../../models/propertiesModel';

// $-title   Get property
// $-path    GET /api/v1/property/:id
// $-auth    Public
const getProperty = asyncHandler(async (req, res) => {
    const propertyId = req.params.id;

    const propertyPage = await Property.findById(propertyId);
    if (propertyPage) {
        res.status(200).json({ success: true, propertyPage });
    } else {
        res.status(404).json({ message: `not found ${propertyId}` });
    }
});

export default getProperty;
