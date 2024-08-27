import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({ path: "./.env" })

const config = {
    mongoURI: process.env.MONGO_URI,
}

const dbConnection = () => {
    mongoose
        .connect(config.mongoURI, {
            dbName: "MyPortfolio",
        })
        .then(() => {
            console.log("Connected to database.")
        })
        .catch(error => {
            console.log(`Some error occured while connecting to database: ${error}`)
        });
};

export default dbConnection;