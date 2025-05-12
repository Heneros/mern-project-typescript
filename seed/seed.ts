import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Seeder } from 'mongo-seeding';

dotenv.config();

const run = async () => {
    const config = {
        database: process.env.MONGO_URI_LOCAL,
        dropDatabase: true,
    };

    const seeder = new Seeder(config);

    const collectionsProperties = seeder.readCollectionsFromPath(
        path.resolve(__dirname, 'data'),
        {
            transformers: [
                Seeder.Transformers.replaceDocumentIdWithUnderscoreId,
            ],
        },
    );

    await seeder.import(collectionsProperties);
    console.log(' Data imported');
};

run().catch((err) => console.error('Error seed', err));
