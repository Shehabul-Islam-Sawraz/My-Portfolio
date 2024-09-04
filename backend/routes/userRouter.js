import express from "express";
import {
    forgotPassword,
    getUser,
    getUserForPortfolio,
    login,
    logout,
    register,
    updatePassword,
    updateProfile,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/", isAuthenticated, getUser);
router.put("/update/profile", isAuthenticated, updateProfile);
router.put("/update/password", isAuthenticated, updatePassword);
router.get("/portfolio", getUserForPortfolio);
router.post("/password/forgot", forgotPassword);

export default router;