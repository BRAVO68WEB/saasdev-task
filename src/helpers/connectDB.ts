import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        if(mongoose.connection.readyState) console.log("✅ Database connected.");
        else throw new Error("❌ Database connection failed.");
    } catch (err) {
        console.log(err);
    }
}

connectDB();