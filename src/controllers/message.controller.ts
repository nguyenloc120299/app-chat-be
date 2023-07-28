import { ProtectedRequest } from "app-request";
import _ from "lodash";
import { BadRequestResponse, SuccessResponse } from "../core/ApiResponse";
import MessageRepo from "../database/repository/MessageRepo";
import asyncHandler from "../helpers/asyncHandler";
import MESSAGE from "../database/model/Message";
import RoomRepo from "../database/repository/RoomRepo";
import { USER_READMESS } from "../database/model/Room";
import { Types } from "mongoose";

export const MessageController = {
  send: asyncHandler(async (req: ProtectedRequest, res) => {
    const { content, room } = req.body;

    const roomCurrent = await RoomRepo.findById(room);
    if (!roomCurrent)
      return new BadRequestResponse("Nhóm chat không còn tồn tại").send(res);
    const newMessage = await MessageRepo.create({
      content,
      room,
      sender: req.user._id,
    } as MESSAGE);

    if (roomCurrent && roomCurrent.unReadMessage) {
      roomCurrent.unReadMessage = roomCurrent.unReadMessage.map(
        (item: USER_READMESS) => {
          if (item.user.toString() != req.user._id.toString()) {
            return { ...item, total: item.total + 1 };
          }
          return item;
        }
      );
      await RoomRepo.update(roomCurrent);
    }

    return new SuccessResponse("success", newMessage).send(res);
  }),

  getAll: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const roomId = req.query.roomId as string;
    const messages = await MessageRepo.findByRoom(
      new Types.ObjectId(roomId),
      page,
      limit
    );
    const messagesReverse = messages?.reverse();
    return new SuccessResponse("success", messagesReverse).send(res);
  }),

  
};
