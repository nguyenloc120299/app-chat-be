import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import "./database"; // initialize database
import routes from "./routes";
import { Server } from "http";
import { Socket } from "socket.io";
import { SocketServer } from "./socket/socket-server";
import admin, { ServiceAccount } from "firebase-admin";
import serviceAccount  from './config/fcmmess-4c2c4-a71320874f3d.json'
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

export default httpServer;
