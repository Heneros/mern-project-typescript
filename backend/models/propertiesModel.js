import mongoose from 'mongoose';

const { Schema } = mongoose;

const propertySchema = new Schema(
    {
        title: {
            type: String,
            //  unique: true,
            required: true,
            maxLength: 50,
        },
        preview: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
            default: 'unknown',
        },
        description: {
            type: String,
        },
        price: {
            type: Number,
        },
        bedrooms: {
            type: Number,
        },
        bathrooms: {
            type: Number,
        },
        area: {
            type: Number,
        },
        floor: {
            type: Number,
        },
        parking: {
            type: Number,
        },
        city: {
            type: String,
            // required: true,
            default: 'New York',
        },
        country: {
            type: String,
            // required: true,
            default: 'USA',
        },
    },
    { timestamps: true },
);

const Property = mongoose.model('Property', propertySchema);
export default Property;
