import mongoose from "mongoose";
import {systemLogs} from "../utils/logger.js";

const connectionToDB = async () => {
    try {
        const params = {
            dbName: process.env.DB_NAME,
        };
        const connect = await mongoose.connect(
            process.env.MONGO_URI,
            params
        );
        console.log(`MongoDB Connected: ${connect.connection.host}`);
        systemLogs.info(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error}`);
        systemLogs.error(error);
    }
};

export default connectionToDB;
