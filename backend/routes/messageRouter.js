import express from "express";
import { sendMessage, getAllMessages, deleteMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", getAllMessages);
router.delete("/delete/:id", deleteMessage);

export default router;