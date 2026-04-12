import mongoose from 'mongoose';

const connectDB = async (params) => {
    
    try {
        mongoose.connection.on( 'connected', () => {
            console.log('MongoDB connected successfully');
        } );
        mongoose.connection.on( 'error', (err) => {
            console.error('MongoDB connection error:', err);
        } );

        await mongoose.connect( `${process.env.MONGO_URI}/trading_system` );
    }
    catch (error) {
        console.error('ISE > Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default connectDB ;