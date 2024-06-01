import mongoose from 'mongoose';

const connectDB = (url) => mongoose.connect(url, {
    // user: process.env.MONGO_ROOT_USERNAME,
    // pass: process.env.MONGO_ROOT_PASSWORD,
    // authSource: 'admin',

    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to db...'))
    .catch((err) => console.log(err, 'err'));

// const connectDB = (url) => mongoose
//     .connect(url, {

//     })
//     .then(() => console.log('Connected to db...'))
//     .catch((err) => console.log(err));

export default connectDB;
