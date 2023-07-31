import { ProtectedRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";
import RoomRepo from "../database/repository/RoomRepo";
import ROOM, { USER_READMESS } from "../database/model/Room";
import { SuccessResponse } from "../core/ApiResponse";
import MessageRepo from "../database/repository/MessageRepo";
import { Types } from "mongoose";

const rooms: ROOM[]=[]

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
    rooms.push(newRoom)
    new SuccessResponse("Blog created successfully", newRoom).send(res);
  }),
  getAll: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;

    const rooms = await RoomRepo.findAll(page, limit);
    new SuccessResponse("Blog created successfully", rooms).send(res);
  }),

  getRoomByUser: asyncHandler(async (req: ProtectedRequest, res) => {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const rooms = await RoomRepo.findRoomsByUsers(
      new Types.ObjectId(userId),
      page,
      limit
    );

    new SuccessResponse("Blog created successfully", rooms).send(res);
  }),

  readMessage: asyncHandler(async (req: ProtectedRequest, res) => {
    const roomCurrent = await RoomRepo.findById(req.body.room);

    if (roomCurrent && roomCurrent.unReadMessage) {
      roomCurrent.unReadMessage = roomCurrent.unReadMessage.map(
        (item: USER_READMESS) => {
          if (item.user.toString() == req.user._id.toString()) {
            return { ...item, total: 0 };
          }
          return item;
        }
      );
      await RoomRepo.update(roomCurrent);
    }
    return new SuccessResponse("Đã xem  ", true).send(res);
  }),
  addMembers: asyncHandler(async (req: ProtectedRequest, res) => {
    const { roomId, members } = req.body;

    const room = await RoomRepo.findById(roomId);
    if (room && room.members?.length && room.unReadMessage) {
      room.members = [...room.members, ...members];
      const newUnreadMess = members.map((item: any) => {
        return {
          user: item,
          total: 0,
        };
      });
      room.unReadMessage = [...room.unReadMessage, ...newUnreadMess];
      const updatedRoom = await RoomRepo.update(room);
    }
    return new SuccessResponse("Đã update ", true).send(res);
  }),
};
