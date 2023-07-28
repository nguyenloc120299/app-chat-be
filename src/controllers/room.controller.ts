import { ProtectedRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";
import RoomRepo from "../database/repository/RoomRepo";
import ROOM from "../database/model/Room";
import { SuccessResponse } from "../core/ApiResponse";
import MessageRepo from "../database/repository/MessageRepo";
import { Types } from "mongoose";
export const RoomController = {
  create: asyncHandler(async (req: ProtectedRequest, res) => {
    const { nameRoom, avatarRoom, members } = req.body;
    const newRoom = await RoomRepo.create({
      nameRoom,
      avatarRoom,
      members: [req.user._id, ...members],
      unReadMessage: [req.user._id, ...members].map((member) => {
        return {
          total: 0,
          user: member,
        };
      }),
    } as ROOM);
    new SuccessResponse("Blog created successfully", newRoom).send(res);
  }),
  getAll: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const rooms = await RoomRepo.findAll(page, limit);

    const roomData = await Promise.all(
      rooms.map(async (room) => {
        const lastMessage = await MessageRepo.findLastMessageByRoom(room._id);
        room.lastMessage = lastMessage;
        return room;
      })
    );
    new SuccessResponse("Blog created successfully", roomData).send(res);
  }),

  getRoomByUser: asyncHandler(async (req: ProtectedRequest, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const rooms = await RoomRepo.findRoomsByUsers(new Types.ObjectId(userId),page,limit);
    new SuccessResponse("Rooms", rooms).send(res);
  }),
};
