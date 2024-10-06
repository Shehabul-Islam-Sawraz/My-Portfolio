import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { SoftwareApplication } from "../models/softwareApplicationSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const addNewApplication = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(
      new ErrorHandler("Software Application Icon/Image Required!", 404)
    );
  }
  const { image } = req.files;
  const { name } = req.body;
  if (!name) {
    return next(new ErrorHandler("Please Provide Software's Name!", 400));
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    image.tempFilePath,
    { folder: "PORTFOLIO_SW_APP_IMAGES" }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next(new ErrorHandler("Failed to upload software icon to Cloudinary", 500));
  }
  const softwareApplication = await SoftwareApplication.create({
    name,
    image: {
      public_id: cloudinaryResponse.public_id, // Set your cloudinary public_id here
      url: cloudinaryResponse.secure_url, // Set your cloudinary secure_url here
    },
  });
  res.status(201).json({
    success: true,
    message: "Software Application Added Successfully!",
    softwareApplication,
  });
});

export const deleteApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let softwareApplication = await SoftwareApplication.findById(id);
  if (!softwareApplication) {
    return next(new ErrorHandler("Software Application Doesn't Exist or Already Deleted!", 404));
  }
  const softwareApplicationImgId = softwareApplication.image.public_id;
  await cloudinary.uploader.destroy(softwareApplicationImgId);
  await softwareApplication.deleteOne();
  res.status(200).json({
    success: true,
    message: "Software Application Deleted Successfully!",
  });
});

export const getAllApplications = catchAsyncErrors(async (req, res, next) => {
  const softwareApplications = await SoftwareApplication.find();
  res.status(200).json({
    success: true,
    softwareApplications,
  });
});