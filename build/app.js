"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("./database"); // initialize database
const routes_1 = __importDefault(require("./routes"));
const socket_server_1 = require("./socket/socket-server");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 }));
app.use((0, cors_1.default)({ origin: "*", optionsSuccessStatus: 200 }));
// Routes
app.use("/api/", routes_1.default);
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
exports.default = httpServer;
//# sourceMappingURL=app.js.map