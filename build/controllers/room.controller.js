"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const RoomRepo_1 = __importDefault(require("../database/repository/RoomRepo"));
const ApiResponse_1 = require("../core/ApiResponse");
const MessageRepo_1 = __importDefault(require("../database/repository/MessageRepo"));
const mongoose_1 = require("mongoose");
const rooms = [];
exports.RoomController = {
    create: (0, asyncHandler_1.default)(async (req, res) => {
        const { nameRoom, avatarRoom, members } = req.body;
        const newRoom = await RoomRepo_1.default.create({
            nameRoom,
            avatarRoom,
            members: [req.user._id, ...members],
            unReadMessage: [req.user._id, ...members].map((member) => {
                return {
                    total: 0,
                    user: member,
                };
            }),
        });
        rooms.push(newRoom);
        new ApiResponse_1.SuccessResponse("Blog created successfully", newRoom).send(res);
    }),
    getAll: (0, asyncHandler_1.default)(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search;
        const rooms = await RoomRepo_1.default.findAll(page, limit, search);
        const total = await RoomRepo_1.default.countRooms();
        new ApiResponse_1.SuccessResponse("Blog created successfully", {
            rooms,
            total
        }).send(res);
    }),
    getRoomByUser: (0, asyncHandler_1.default)(async (req, res) => {
        const userId = req.user._id;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search;
        const rooms = await RoomRepo_1.default.findRoomsByUsers(new mongoose_1.Types.ObjectId(userId), page, limit, search);
        const total = await RoomRepo_1.default.countRooms();
        new ApiResponse_1.SuccessResponse("Blog created successfully", {
            rooms,
            total
        }).send(res);
    }),
    readMessage: (0, asyncHandler_1.default)(async (req, res) => {
        const roomCurrent = await RoomRepo_1.default.findById(req.body.room);
        if (roomCurrent && roomCurrent.unReadMessage) {
            roomCurrent.unReadMessage = roomCurrent.unReadMessage.map((item) => {
                if (item.user.toString() == req.user._id.toString()) {
                    return { ...item, total: 0 };
                }
                return item;
            });
            await RoomRepo_1.default.update(roomCurrent);
        }
        return new ApiResponse_1.SuccessResponse("Đã xem  ", true).send(res);
    }),
    addMembers: (0, asyncHandler_1.default)(async (req, res) => {
        var _a;
        const { roomId, members } = req.body;
        const room = await RoomRepo_1.default.findById(roomId);
        if (room && ((_a = room.members) === null || _a === void 0 ? void 0 : _a.length) && room.unReadMessage) {
            room.members = [...room.members, ...members];
            const newUnreadMess = members.map((item) => {
                return {
                    user: item,
                    total: 0,
                };
            });
            room.unReadMessage = [...room.unReadMessage, ...newUnreadMess];
            const updatedRoom = await RoomRepo_1.default.update(room);
        }
        return new ApiResponse_1.SuccessResponse("Đã update ", true).send(res);
    }),
    updateRoom: (0, asyncHandler_1.default)(async (req, res) => {
        const { roomId, avatarRoom, nameRoom } = req.body;
        const roomCurrent = await RoomRepo_1.default.findById(roomId);
        if (!roomCurrent)
            return new ApiResponse_1.BadRequestResponse("Phòng không tìm thấy").send(res);
        roomCurrent.avatarRoom = avatarRoom || roomCurrent.avatarRoom;
        roomCurrent.nameRoom = nameRoom || roomCurrent.nameRoom;
        await RoomRepo_1.default.update(roomCurrent);
        return new ApiResponse_1.SuccessResponse("Đã update date", roomCurrent).send(res);
    }),
    deleteRoom: (0, asyncHandler_1.default)(async (req, res) => {
        const { room } = req.body;
        await MessageRepo_1.default.deleteManyByRoom(room);
        await RoomRepo_1.default.deleteRoom(room);
        return new ApiResponse_1.SuccessResponse("Đã xoá", true).send(res);
    })
};
//# sourceMappingURL=room.controller.js.map