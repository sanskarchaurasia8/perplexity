import { generateResponse, generateChatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
    try {
        const { message, chat: chatId } = req.body;

        let chat = null;
        let title = null;

        // 👉 new chat create
        if (!chatId) {
            try {
                title = await generateChatTitle(message);
            } catch (err) {
                console.error("Title generation failed:", err.message);
                title = "New Chat";
            }

            chat = await chatModel.create({
                user: req.user.id,
                title,
            });
        }

        const activeChatId = chatId || chat._id;

        // 👉 save user message
        await messageModel.create({
            chat: activeChatId,
            content: message,
            role: "user",
        });

        const messages = await messageModel
            .find({ chat: activeChatId })
            .sort({ createdAt: 1 });

        // 🔥 FORMAT FIX (IMPORTANT)
        const formattedMessages = messages.map((msg) => ({
            role: msg.role === "ai" ? "model" : "user",
            parts: [{ text: msg.content }],
        }));

        let result;

        try {
            result = await generateResponse(formattedMessages);
            console.log("AI RESULT:", result);
        } catch (err) {
            console.error("AI SERVICE ERROR:", err.message);
            result = "AI is currently unavailable. Please try again later.";
        }

        // 👉 save AI message
        const aimessage = await messageModel.create({
            chat: activeChatId,
            content: result || "No response",
            role: "ai",
        });

        const savedChat = chat || (await chatModel.findById(activeChatId));

        return res.status(201).json({
            AIMessage: result,
            title: savedChat?.title ?? title,
            chat: savedChat,
            aimessage,
        });

    } catch (error) {
        console.error("Chat generation failed", error);

        return res.status(500).json({
            message: "AI response generation failed",
            success: false,
            err: error.message || "Unknown error",
        });
    }
}