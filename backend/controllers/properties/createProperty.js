import asyncHandler from 'express-async-handler';
import Property from '../../models/propertiesModel.js';

// $-title   Create property
// $-path    POST /api/v1/property/create
// $-auth    Private
const createProperty = asyncHandler(async (req, res) => {
    try {
        const {
            title,
            price,
            category,
            preview,
            description,
            bedrooms,
            bathrooms,
            area,
            floor,
            parking,
        } = req.body;

        if (!title) {
            res.status(400).json({ message: 'No title' });
        }

        if (!price) {
            res.status(400).json({ message: 'No price' });
        }

        // if (!preview) {
        //     res.status(400).json({ message: 'No preview' });
        // }

        const propertyExists = await Property.findOne({ title });

        if (propertyExists) {
            res.status(400).json({ message: 'Property already created' });
        }

        const newProperty = new Property({
            title,
            price,
            category,
            preview: preview || 'https://res.cloudinary.com/dmk9uxtiu/image/upload/v1716984705/mernvilla/uploads/logo-1716984707439.jpg.jpg',
            description,
            bedrooms,
            bathrooms,
            area,
            floor,
            parking,
        });

        const createdProperty = await newProperty.save();

        if (!createdProperty) {
            res.status(400).json({ message: 'Property could not created' });
        }

        if (createdProperty) {
            res.status(201).json({ success: true, message: 'Property created successfully!' });
        }
    } catch (error) {
        res.status(400).json({ message: 'error create post of property' });
    }
});

export default createProperty;
