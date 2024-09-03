import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import configApp from "../config/app.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler("User not Authenticated!", 400));
    }
    const decoded = jwt.verify(token, configApp.jwtSecretKey);
    // While generating web token in userSchema, we had set a param `id` to be the authenticated user id
    req.user = await User.findById(decoded.id);
    next();
});