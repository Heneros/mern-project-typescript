import mongoose from 'mongoose';

const connectDB = (url: string) =>
    mongoose
        .connect(url, {
            // user: process.env.MONGO_ROOT_USERNAME,
            // pass: process.env.MONGO_ROOT_PASSWORD,
            // authSource: 'admin',
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        })
        .then(() => console.log('Connected to db...'))
        .catch((err) => console.log(err, 'err'));

export default connectDB;
