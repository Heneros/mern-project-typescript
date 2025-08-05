import mongoose from 'mongoose';

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI environment variable is not defined');
    process.exit(1);
}

let cachedConnection: typeof mongoose | null = null;

const connectDB = async (mongoUri: string) => {
   
   
if (cachedConnection) {
  //  console.log('Using cached database connection.');
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(mongoUri, {

      serverSelectionTimeoutMS: 5000, 
    });
    cachedConnection = connection;
    console.log('Database connected successfully.');
    return connection;
  } catch (error) {
        console.error('Database connection failed:', error);
    process.exit(1);
    
  }

     }
   
   


export default connectDB;
