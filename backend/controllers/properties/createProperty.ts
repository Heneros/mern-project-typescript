import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import Property from '@/models/propertiesModel';

// $-title   Create property
// $-path    POST /api/v1/property/create
// $-auth    Private
const createProperty = async (req: Request, res: Response): Promise<void> => {
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
            questionsAndAnswers,
        } = req.body;

        if (!title) {
            res.status(400).json({ message: 'No title' });
            return;
        }

        if (!price) {
            res.status(400).json({ message: 'No price' });
            return;
        }

        const propertyExists = await Property.findOne({ title });

        if (propertyExists) {
            res.status(400).json({ message: 'Property already created' });
            return;
        }

        const newProperty = new Property({
            title,
            price,
            category,
            preview:
                preview ||
                'https://res.cloudinary.com/dmk9uxtiu/image/upload/v1716984705/mernvilla/uploads/logo-1716984707439.jpg',
            description,
            bedrooms,
            bathrooms,
            area,
            floor,
            parking,
            questionsAndAnswers,
        });

        const createdProperty = await newProperty.save();

        if (!createdProperty) {
            res.status(400).json({ message: 'Property could not created' });
            return;
        }

        if (createdProperty) {
            res.status(201).json({
                success: true,
                message: 'Property created successfully!',
            });
        }
    } catch (error) {
        res.status(400).json({ message: 'error create post of property' });
        console.log(error);
    }
};

export default createProperty;
