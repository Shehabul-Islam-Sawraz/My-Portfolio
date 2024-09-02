import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Please Upload Your Avatar and  Resume!", 400));
    }
    const { avatar, resume } = req.files;

    const responseAvatar = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        { folder: "PORTFOLIO AVATAR" }
    );
    if (!responseAvatar || responseAvatar.error) {
        console.error(
            "Cloudinary Error:",
            responseAvatar.error || "Unknown Cloudinary error"
        );
        return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
    }

    const responseResume = await cloudinary.uploader.upload(
        resume.tempFilePath,
        { folder: "PORTFOLIO RESUME" }
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