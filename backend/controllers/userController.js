import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import path from 'path';

export const register = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Please Upload Your Avatar and  Resume!", 400));
    }
    const { avatar, resume } = req.files;

    // Handle Avatar
    const responseAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder: "PORTFOLIO_AVATAR" }
    );
    if (!responseAvatar || responseAvatar.error) {
        console.error(
            "Cloudinary Error:",
            responseAvatar.error || "Unknown Cloudinary error"
        );
        return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
    }

    // Handle Resume
    // console.log(resume)
    const extension = path.extname(resume.name).toLowerCase();
    let resourceType = 'auto';

    if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'].includes(extension)) {
        resourceType = 'image';
    } else if (['.pdf'].includes(extension)) {
        resourceType = 'raw';
    }
    // console.log(resourceType)
    const responseResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        {
            folder: "PORTFOLIO_RESUME",
            resource_type: resourceType
        }
    );
    if (!responseResume || responseResume.error) {
        console.error(
            "Cloudinary Error:",
            responseResume.error || "Unknown Cloudinary error"
        );
        return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
    }
    const {
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        twitterURL,
        facebookURL,
        linkedInURL,
    } = req.body;

    const user = await User.create({
        fullName,
        email,
        phone,
        aboutMe,
        password,
        portfolioURL,
        githubURL,
        instagramURL,
        twitterURL,
        facebookURL,
        linkedInURL,
        avatar: {
            public_id: responseAvatar.public_id, // Set your cloudinary public_id here
            url: responseAvatar.secure_url, // Set your cloudinary secure_url here
        },
        resume: {
            public_id: responseResume.public_id, // Set your cloudinary public_id here
            url: responseResume.secure_url, // Set your cloudinary secure_url here
        },
    });
    // res.status(200).json({
    //     success: true,
    //     message: "User Registered Successfully!!"
    // });
    generateToken(user, "User Registered Successfully!!", 201, res);
});