import mongoose from "mongoose";
import chatModel from "../Models/chatModel.js"; // Ensure file exists

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;
   
    
    
    try {
        const chat = await chatModel.findOne({
            members: {
                $all: [firstId,secondId]
            }
        });
        if (chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstId,secondId]
        });

        const response = await newChat.save();
        res.status(200).json(response);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] }
        });

        res.status(200).json(chats);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

const findChat = async (req, res) => {
    const { firstId, secondId } = req.params;

    try {
        const chat = await chatModel.findOne({
            members: {
                $all: [firstId,secondId]
            }
        });

        res.status(200).json(chat);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Server error", error: err });
    }
};

export { createChat, findChat, findUserChats };
