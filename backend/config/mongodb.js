import mongoose from "mongoose";
import dns from "dns";

const connectDB = async () => {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
    mongoose.connection.on('connected', () => console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)

}

export default connectDB;

// Do not use '@' symbol in your databse user's password else it will show an error.