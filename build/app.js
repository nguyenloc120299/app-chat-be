"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bot = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
require("./database"); // initialize database
const routes_1 = __importDefault(require("./routes"));
const socket_server_1 = require("./socket/socket-server");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const fcmmess_4c2c4_a71320874f3d_json_1 = __importDefault(require("./config/fcmmess-4c2c4-a71320874f3d.json"));
const config_1 = require("./config");
const UserRepo_1 = __importDefault(require("./database/repository/UserRepo"));
exports.bot = new node_telegram_bot_api_1.default(config_1.apiToken, { polling: true });
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use((0, cors_1.default)({ origin: "*", optionsSuccessStatus: 200 }));
// Routes
app.use("/api/", routes_1.default);
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(fcmmess_4c2c4_a71320874f3d_json_1.default),
});
// Socket
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
    },
});
io.on("connection", (socket) => {
    (0, socket_server_1.SocketServer)(socket, io);
});
exports.bot.on('message', async (msg) => {
    console.log("🚀 ~ file: app.ts:44 ~ bot.on ~ msg:", msg);
    const userName = msg.chat.username;
    const chatId = msg.chat.id;
    const linkTele = `https://t.me/${userName}`;
    const users = await UserRepo_1.default.findByTeleLink(linkTele);
    console.log("🚀 ~ file: app.ts:48 ~ bot.on ~ users:", users);
    users.forEach(async (user) => {
        if (user) {
            user.chatTeleId = chatId;
            await UserRepo_1.default.updateUser(user);
        }
    });
    if (msg.text === '/start') {
        exports.bot.sendMessage(chatId, 'Xin chào, đây là tin nhắn chào mừng từ bot thông báo. Bạn sẽ nhận được thông báo khi có người nhắc đến bạn ');
    }
});
exports.default = httpServer;
//# sourceMappingURL=app.js.map