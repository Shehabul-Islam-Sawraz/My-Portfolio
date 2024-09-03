import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
    const { senderName, subject, message } = req.body;
    if (!senderName || !subject || !message) {
        return next(new ErrorHandler("Please full up all the fields!!", 400));
    }
    const data = await Message.create({ senderName, subject, message });
    res.status(201).json({
        success: true,
        message: "Message Sent Successfully",
        data,
    });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
    const messages = await Message.find();
    res.status(201).json({
        success: true,
        messages,
    });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const message = await Message.findById(id);
    if (!message) {
        return next(new ErrorHandler("Message Not Found!!", 400));
    }
    await message.deleteOne();
    res.status(201).json({
        success: true,
        message: "Message Deleted Successfully!",
    });
});