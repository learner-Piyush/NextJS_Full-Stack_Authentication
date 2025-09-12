import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection

        connection.on("connected", () => {
            console.log("✅ MongoDB connected successfully")
        })

        connection.on("error", (err) => {
            console.error("❌ MongoDB connection error", err)
            process.exit()
        })
    } catch (error) {
        console.error("Something went wrong ¯\_(ツ)_/¯", error)
    }
}