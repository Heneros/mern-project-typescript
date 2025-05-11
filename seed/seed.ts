import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const { ObjectId } = mongoose.Types;

const convertObjectIds = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(convertObjectIds);
    } else if (obj !== null && typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
            if (key === '_id' && obj[key]?.$oid) {
                newObj['_id'] = new ObjectId(obj[key].$oid);
            } else {
                newObj[key] = convertObjectIds(obj[key]);
            }
        }
        return newObj;
    }
    return obj;
};

const importData = async () => {
    await mongoose.connect(process.env.MONGO_URI_LOCAL!);

    const rawUsers = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8'),
    );
    const rawproperties = JSON.parse(
        fs.readFileSync(path.join(__dirname, 'data/properties.json'), 'utf-8'),
    );

    const users = convertObjectIds(rawUsers);
    const properties = convertObjectIds(rawproperties);

    await mongoose.connection.collection('users').insertMany(users);
    await mongoose.connection.collection('properties').insertMany(properties);

    console.log(' Import successfully done');
    process.exit();
};

importData().catch((err) => {
    console.error(' Error:', err);
    process.exit(1);
});
