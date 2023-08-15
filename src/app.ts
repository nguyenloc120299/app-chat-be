import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import TelegramBot, { Message } from 'node-telegram-bot-api'
import "./database"; // initialize database
import routes from "./routes";
import { Server } from "http";
import { Socket } from "socket.io";
import { SocketServer } from "./socket/socket-server";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount from './config/fcmmess-4c2c4-a71320874f3d.json'
import { apiToken } from "./config";
import UserRepo from "./database/repository/UserRepo";
import { forEach } from "lodash";
import User from "./database/model/User";

export const bot = new TelegramBot(apiToken, { polling: true });

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);
app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

// Routes
app.use("/api/", routes);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
});
// Socket
const httpServer: Server = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket: Socket) => {
  SocketServer(socket, io);
});
bot.on('message', async (msg: Message) => {
  console.log("🚀 ~ file: app.ts:44 ~ bot.on ~ msg:", msg)
  const userName = msg.chat.username;
  const chatId = msg.chat.id;
  const linkTele = `https://t.me/${userName}`
  const users = await UserRepo.findByTeleLink(linkTele)
  console.log("🚀 ~ file: app.ts:48 ~ bot.on ~ users:", users)

  users.forEach(async (user: User) => {
    if (user) {
      user.chatTeleId = chatId
      await UserRepo.updateUser(user)
    }
  })
  if (msg.text === '/start') {
    bot.sendMessage(chatId, 'Xin chào, đây là tin nhắn chào mừng từ bot thông báo. Bạn sẽ nhận được thông báo khi có người nhắc đến bạn ');
  }
});

export default httpServer;
