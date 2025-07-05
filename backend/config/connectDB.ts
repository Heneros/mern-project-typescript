import mongoose from 'mongoose';

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not defined');
    process.exit(1);
}
const connectDB = (url: string) =>
    mongoose
        .connect(url, {
            // user: process.env.MONGO_ROOT_USERNAME,
            // pass: process.env.MONGO_ROOT_PASSWORD,
            //   authSource: 'admin',
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            authSource: 'admin',
  
        })
        .then(() => console.log('Connected to db...'))
        .catch((err) => console.log(err, 'err'));

export default connectDB;
