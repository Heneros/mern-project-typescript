import asyncHandler from 'express-async-handler';
import Property from '../../models/propertiesModel';

// $-title   Create property
// $-path    POST /api/v1/property/create
// $-auth    Private

const createProperty = asyncHandler(async (req, res) => {
    try {
        const {
            title, price, category, preview, description, bedrooms, bathrooms, area, floor, parking,
        } = req.body;

        const property = await Property.create({
            title, price, category, preview, description, bedrooms, bathrooms, area, floor, parking,
        });

        if (property) {
            res.status(201).json({});
        }
    } catch (error) {
        res.status(400).json({ message: 'error create post of property' });
    }
});
