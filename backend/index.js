import express from 'express';
import configApp from './config/app.js';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import dbConnection from './config/database.js';
import configCloudinary from './config/cloudinary.js';
import cloudinary from "cloudinary";

const app = express();

const PORT = configApp.appPort;

app.use(
    cors({
        origin: [configApp.portfolioURL, configApp.dashboardURL],
        methods: ["GET", "POST", "DELETE", "PUT"],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

dbConnection();

cloudinary.v2.config({
    cloud_name: configCloudinary.cloudName,
    api_key: configCloudinary.apiKey,
    api_secret: configCloudinary.apiSecret,
});

app.listen(PORT, () => {
    console.log(`Server listening at port ${PORT}`)
})

export default app;