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
exports.MessageController = {
    send: (0, asyncHandler_1.default)(async (req, res) => {
        const { content, room, role } = req.body;
        const roomCurrent = await RoomRepo_1.default.findById(room);
        if (!roomCurrent)
            return new ApiResponse_1.BadRequestResponse("Nhóm chat không còn tồn tại").send(res);
        const newMessage = await MessageRepo_1.default.create({
            content,
            room,
            sender: req.user._id,
            role
        });
        if (roomCurrent && roomCurrent.unReadMessage) {
            roomCurrent.unReadMessage = roomCurrent.unReadMessage.map((item) => {
                if (item.user.toString() != req.user._id.toString()) {
                    return { ...item, total: item.total + 1 };
                }
                return item;
            });
            await RoomRepo_1.default.update(roomCurrent);
        }
        return new ApiResponse_1.SuccessResponse("success", newMessage).send(res);
    }),
    getAll: (0, asyncHandler_1.default)(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const roomId = req.query.roomId;
        const messages = await MessageRepo_1.default.findByRoom(new mongoose_1.Types.ObjectId(roomId), page, limit);
        const messagesReverse = messages === null || messages === void 0 ? void 0 : messages.reverse();
        return new ApiResponse_1.SuccessResponse("success", messagesReverse).send(res);
    }),
};
//# sourceMappingURL=message.controller.js.map