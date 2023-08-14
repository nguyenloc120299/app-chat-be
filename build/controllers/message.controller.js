"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const ApiResponse_1 = require("../core/ApiResponse");
const MessageRepo_1 = __importDefault(require("../database/repository/MessageRepo"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const RoomRepo_1 = __importDefault(require("../database/repository/RoomRepo"));
const mongoose_1 = require("mongoose");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const UserRepo_1 = __importDefault(require("../database/repository/UserRepo"));
const app_1 = require("../app");
exports.MessageController = {
    send: (0, asyncHandler_1.default)(async (req, res) => {
        const { content, room, role, file, typeFile } = req.body;
        const roomCurrent = await RoomRepo_1.default.findById(room);
        if (!roomCurrent)
            return new ApiResponse_1.BadRequestResponse("Nhóm chat không còn tồn tại").send(res);
        const newMessage = await MessageRepo_1.default.create({
            content,
            room,
            sender: req.user._id,
            role,
            file,
            typeFile,
        });
        if (roomCurrent && roomCurrent.unReadMessage) {
            roomCurrent.unReadMessage = roomCurrent.unReadMessage.map((item) => {
                if (item.user.toString() != req.user._id.toString()) {
                    return { ...item, total: item.total + 1 };
                }
                return item;
            });
            roomCurrent.lastMessage = {
                content,
                sender: req.user,
                createdAt: new Date(),
            };
            await RoomRepo_1.default.update(roomCurrent);
        }
        return new ApiResponse_1.SuccessResponse("success", newMessage).send(res);
    }),
    getAll: (0, asyncHandler_1.default)(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const roomId = req.query.roomId;
        const messages = await MessageRepo_1.default.findByRoom(new mongoose_1.Types.ObjectId(roomId), page, limit);
        const total = await MessageRepo_1.default.countMessagesById(new mongoose_1.Types.ObjectId(roomId));
        const messagesReverse = messages === null || messages === void 0 ? void 0 : messages.reverse();
        return new ApiResponse_1.SuccessResponse("success", {
            messages: messagesReverse,
            total: total,
        }).send(res);
    }),
    updateMessage: (0, asyncHandler_1.default)(async (req, res) => {
        const { messageId, pin } = req.body;
        const messageCurrent = await MessageRepo_1.default.findById(messageId);
        if (!messageCurrent)
            return new ApiResponse_1.BadRequestResponse("Tin nhắn không tìm thấy").send(res);
        messageCurrent.pin = pin || false;
        return new ApiResponse_1.SuccessResponse("success", messageCurrent).send(res);
    }),
    pushNotification: (0, asyncHandler_1.default)(async (req, res) => {
        const { titleNotification, bodyNotification, userId, room, role } = req.body;
        const user = await UserRepo_1.default.findById(userId);
        if (!user)
            return new ApiResponse_1.BadRequestResponse("User not found").send(res);
        if (!user.tokenFireBase || !(user === null || user === void 0 ? void 0 : user.chatTeleId))
            return new ApiResponse_1.BadRequestResponse("Token not found").send(res);
        const message = {
            notification: {
                title: titleNotification,
                body: bodyNotification,
            },
            token: user.tokenFireBase,
            data: {
                path: "/",
            },
            android: {
                notification: {
                    icon: "https://pools.s3.ap-southeast-1.amazonaws.com/pools-wallet/android/ic_launcher.png",
                    color: "#FFFFFF",
                },
            },
        };
        const webpageLink = 'https://chat-fe-y7o1.onrender.com/';
        // Tạo tin nhắn với liên kết bằng cú pháp Markdown
        const messageBotTele = `${bodyNotification}\n\n[${webpageLink}](${`Xem tin nhắn mới`})`;
        app_1.bot.sendMessage(user.chatTeleId, messageBotTele, { parse_mode: 'Markdown' });
        const response = await firebase_admin_1.default.messaging().send(message);
        const roomCurrent = await RoomRepo_1.default.findById(room);
        if (!roomCurrent)
            return new ApiResponse_1.BadRequestResponse("Nhóm chat không còn tồn tại").send(res);
        const newMessage = await MessageRepo_1.default.create({
            content: "@" + (user === null || user === void 0 ? void 0 : user.name),
            room,
            sender: req.user._id,
            role,
        });
        if (roomCurrent && roomCurrent.unReadMessage) {
            roomCurrent.unReadMessage = roomCurrent.unReadMessage.map((item) => {
                if (item.user.toString() != req.user._id.toString()) {
                    return { ...item, total: item.total + 1 };
                }
                return item;
            });
            roomCurrent.lastMessage = {
                content: "@" + (user === null || user === void 0 ? void 0 : user.name),
                sender: req.user,
                createdAt: new Date(),
            };
            await RoomRepo_1.default.update(roomCurrent);
        }
        return new ApiResponse_1.SuccessResponse("success", newMessage).send(res);
    }),
};
//# sourceMappingURL=message.controller.js.map