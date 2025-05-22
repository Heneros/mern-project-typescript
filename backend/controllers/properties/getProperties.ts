import asyncHandler from 'express-async-handler';
import Property from '@/models/propertiesModel';
import { pageSize } from '@/constants';

const getAllProperties = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;

    const count = await Property.countDocuments({});

    const properties = await Property.find()
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        success: true,
        count,
        numberOfPages: Math.ceil(count / pageSize),
        properties,
    });
});

export default getAllProperties;
