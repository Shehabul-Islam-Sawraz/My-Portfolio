import express from "express";
import {
    getUser,
    login,
    logout,
    register,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.get("/", isAuthenticated, getUser);

export default router;