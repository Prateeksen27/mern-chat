import express from "express";
import { createChat, findChat, findUserChats } from "../Controller/chatController.js"; // Ensure correct path

const router = express.Router();

router.post("/", createChat);
router.get("/:userId", findUserChats);
router.get("/:firstId/:secondId", findChat);

export default router;
