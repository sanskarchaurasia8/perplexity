import { initilizeSocketConnection } from "../service/chat.socket";
import { sendMessage } from "../service/chat.api";
import { setCurrentChatId, setError, setLoading, createNewChat, addNewMessage } from "../chat.slice";
import { useDispatch } from "react-redux";


export const useChat = () => {
    const dispatch = useDispatch();

    async function handleSendMessage({ chatId, message }) {
        dispatch(setLoading(true));
        try {
            const data = await sendMessage({ chatId, message });
            const activeChat = data.chat;
            const aiText = data.AIMessage || data.aiMessage?.content || "";

            dispatch(createNewChat({
                chatId: activeChat._id,
                title: activeChat.title || "New Chat",
            }));
            dispatch(setCurrentChatId(activeChat._id));
            dispatch(addNewMessage({ chatId: activeChat._id, content: message, role: "user" }));
            dispatch(addNewMessage({ chatId: activeChat._id, content: aiText, role: "ai" }));

            return { ...data, aiText };
        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message || "Error sending message"));
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return {
        initilizeSocketConnection,
        handleSendMessage,
    };
};
