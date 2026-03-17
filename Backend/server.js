
import "dotenv/config";
process.env.JWT_SECRET = process.env.JWT_SECRET || "supersecretdev";
process.env.MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/perplexity";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";
import { testAi } from "./src/services/ai.service.js";


const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

initSocket(httpServer);


connectDB()
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
        process.exit(1);
    });

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});