import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import path from 'path';
import configApp from "../config/app.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";

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

export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Email or Password is Missing!", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Incorrect Email Or Password!", 404));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect Email Or Password!", 401));
    }
    generateToken(user, "Logged In Successfully!", 200, res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "Logged Out Successfully!",
        });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user,
    });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const newUserData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        aboutMe: req.body.aboutMe,
        githubURL: req.body.githubURL,
        instagramURL: req.body.instagramURL,
        portfolioURL: req.body.portfolioURL,
        facebookURL: req.body.facebookURL,
        twitterURL: req.body.twitterURL,
        linkedInURL: req.body.linkedInURL,
    };
    if (req.files && req.files.avatar) {
        const avatar = req.files.avatar;
        const user = await User.findById(req.user.id);
        const profileImageId = user.avatar.public_id;
        await cloudinary.uploader.destroy(profileImageId);
        const newProfileImage = await cloudinary.uploader.upload(
            avatar.tempFilePath,
            {
                folder: "PORTFOLIO_AVATAR",
            }
        );

        if (!newProfileImage || newProfileImage.error) {
            console.error(
                "Cloudinary Error:",
                newProfileImage.error || "Unknown Cloudinary error"
            );
            return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
        }

        newUserData.avatar = {
            public_id: newProfileImage.public_id,
            url: newProfileImage.secure_url,
        };
    }

    if (req.files && req.files.resume) {
        const resume = req.files.resume;
        const user = await User.findById(req.user.id);
        const resumeFileId = user.resume.public_id;
        if (resumeFileId) {
            await cloudinary.uploader.destroy(resumeFileId);
        }

        const extension = path.extname(resume.name).toLowerCase();
        let resourceType = 'auto';

        if (['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp'].includes(extension)) {
            resourceType = 'image';
        } else if (['.pdf'].includes(extension)) {
            resourceType = 'raw';
        }

        const newResume = await cloudinary.uploader.upload(resume.tempFilePath,
            {
                folder: "PORTFOLIO_RESUME",
                resource_type: resourceType
            }
        );

        if (!newResume || newResume.error) {
            console.error(
                "Cloudinary Error:",
                newResume.error || "Unknown Cloudinary error"
            );
            return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
        }

        newUserData.resume = {
            public_id: newResume.public_id,
            url: newResume.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully!",
        user,
    });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please fill up all the fields!", 400));
    }
    const isPasswordMatched = await user.comparePassword(currentPassword);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Incorrect Current Password!"));
    }
    if (newPassword !== confirmNewPassword) {
        return next(
            new ErrorHandler("New Password and Confirm Password don\'t Match!")
        );
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password Updated Successfully!",
    });
});

export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
    const id = configApp.myPortfolioId;
    const user = await User.findById(id);
    res.status(200).json({
        success: true,
        user,
    });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("No user found with this email!", 404));
    }
    const resetToken = user.getResetPasswordToken();

    // Saving user with reset token
    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${configApp.dashboardURL}/password/reset/${resetToken}`;

    const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If you haven't requested this email then, please ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Portfolio Dashboard Password Recovery`,
            message,
        });
        res.status(201).json({
            success: true,
            message: `Email sent to ${user.email} successfully!`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired!", 400));
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password & Confirm Password do not match"));
    }
    user.password = await req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    generateToken(user, "Password Reset Successfully!", 200, res);
});