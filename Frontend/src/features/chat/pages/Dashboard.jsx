import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useChat } from "../hooks/useChat";
import { sendMessage as sendMessageApi } from "../service/chat.api";

const Dashboard = () => {
    const chat = useChat();
    const user = useSelector((state) => state.auth.user);
    const [selectedChat, setSelectedChat] = useState(0);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        // { role: "ai", text: "Hello! Kya main aapki madad kar sakta hoon?" }
    ]);
    const [chatId, setChatId] = useState(null);
    const [loading, setLoading] = useState(false);

    const chatItems = [
        "AI task helper",
        "Project strategy",
        "Health plan",
        "Study notes",
        "Interview prep",
        "Marketing copy",
    ];

    useEffect(() => {
        chat.initilizeSocketConnection();
    }, [chat]);

    // 🔥 NEW: scroll container ref
    const containerRef = useRef(null);

    // 🔥 SMART AUTO SCROLL (ChatGPT style)
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const isNearBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight < 100;

        if (isNearBottom) {
            el.scrollTop = el.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = message.trim();

        setMessages((prev) => [
            ...prev,
            { role: "user", text: userMessage }
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await sendMessageApi({
                chatId,
                message: userMessage
            });

            const aiText =
                response.AIMessage ||
                response.message ||
                "AI failed to generate response.";

            setChatId(response.chat?._id || chatId);

            setMessages((prev) => [
                ...prev,
                { role: "ai", text: aiText }
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "ai", text: "AI failed. Please try again." }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-screen w-full bg-slate-950 text-slate-100 p-3 md:p-5">
            <div className="mx-auto h-full max-w-6xl rounded-2xl border border-slate-700 bg-slate-900/90 shadow-2xl overflow-hidden md:flex">
                
                {/* Sidebar */}
                <aside className="hidden w-72 border-r border-slate-700 bg-slate-900 md:block">
                    <div className="border-b border-slate-700 p-4 text-lg font-semibold text-white">
                        Perplexity
                    </div>
                    <div className="space-y-2 p-3">
                        {chatItems.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setSelectedChat(idx)}
                                className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                                    selectedChat === idx
                                        ? "bg-linear-to-r from-cyan-500 to-blue-500 text-slate-900"
                                        : "bg-slate-800 text-slate-200 hover:bg-slate-700"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Chat Section */}
                <section className="flex flex-1 flex-col min-h-0">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-700 p-4">
                        <div>
                            <h1 className="text-xl font-bold">
                                {chatItems[selectedChat]}
                            </h1>
                            <p className="text-xs text-slate-400">
                                {user?.username || "Guest"}
                            </p>
                        </div>
                        <button className="rounded-xl bg-cyan-500 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-cyan-400">
                            New Chat
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex flex-1 flex-col p-4 min-h-0">
                        <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 min-h-0">
                            
                            {/* 🔥 SCROLL CONTAINER */}
                            <div
                                ref={containerRef}
                                className="flex-1 overflow-y-auto p-4 min-h-0"
                                style={{ scrollBehavior: "smooth" }}
                            >
                                <div className="flex flex-col gap-3">
                                    {messages.map((m, i) => (
                                        <div
                                            key={i}
                                            className={`max-w-[88%] ${
                                                m.role === "ai"
                                                    ? "self-start"
                                                    : "self-end text-right"
                                            }`}
                                        >
                                            <div
                                                className={`inline-block rounded-xl px-3 py-2 text-sm ${
                                                    m.role === "ai"
                                                        ? "bg-slate-700 text-slate-100"
                                                        : "bg-cyan-500 text-slate-900"
                                                }`}
                                            >
                                                {m.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Input */}
                        <div className="mt-3 rounded-2xl border border-slate-700 bg-slate-900 p-3">
                            <div className="flex gap-2">
                                <input
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={loading}
                                    className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-emerald-400 disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send"}
                                </button>
                            </div>
                            <p className="mt-2 text-xs text-slate-400">
                                AI response sometimes may take a second. Please wait.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;