import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import configApp from "../config/app.js";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please Provide Your Full Name!"],
    },
    email: {
        type: String,
        required: [true, "Please Provide Your Email Account!"],
    },
    phone: {
        type: String,
        required: [true, "Phone Number is Required!"],
    },
    aboutMe: {
        type: String,
        required: [true, "Please write something about yourself!"],
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
        minLength: [8, "Password Must Contain at least 8 Characters!"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    resume: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    portfolioURL: {
        type: String,
    },
    githubURL: {
        type: String,
    },
    instagramURL: {
        type: String,
    },
    twitterURL: {
        type: String,
    },
    linkedinURL: {
        type: String,
    },
    facebookURL: {
        type: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Before saving the instance in the database, 
// we check if password is modified!
// If not, then just movve to next middleware
// If yes, then encrypt it and sae the encrypted password in database
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Comparing entered password with hashed password, during login
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
    return jwt.sign({ id: this._id }, configApp.jwtSecretKey, {
        expiresIn: configApp.jwtExpiryTime,
    });
};

export const User = mongoose.model("User", userSchema);