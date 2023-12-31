import { ProtectedRequest } from "app-request";
import _ from "lodash";
import { BadRequestResponse, SuccessResponse } from "../core/ApiResponse";
import MessageRepo from "../database/repository/MessageRepo";
import asyncHandler from "../helpers/asyncHandler";
import MESSAGE from "../database/model/Message";
import RoomRepo from "../database/repository/RoomRepo";
import { USER_READMESS } from "../database/model/Room";
import { Types } from "mongoose";
import admin from "firebase-admin";
import UserRepo from "../database/repository/UserRepo";
import { bot } from "../app";
export const MessageController = {
  send: asyncHandler(async (req: ProtectedRequest, res) => {
    const { content, room, role, file, typeFile } = req.body;

    const roomCurrent = await RoomRepo.findById(room);
    if (!roomCurrent)
      return new BadRequestResponse("Nhóm chat không còn tồn tại").send(res);
    const newMessage = await MessageRepo.create({
      content,
      room,
      sender: req.user._id,
      role,
      file,
      typeFile,
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
      roomCurrent.lastMessage = {
        content,
        sender: req.user,
        createdAt: new Date(),
      };
      await RoomRepo.update(roomCurrent);
    }

    return new SuccessResponse("success", newMessage).send(res);
  }),

  getAll: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const roomId = req.query.roomId as string;
    const messages = await MessageRepo.findByRoom(
      new Types.ObjectId(roomId),
      page,
      limit
    );
    const total = await MessageRepo.countMessagesById(
      new Types.ObjectId(roomId)
    );
    const messagesReverse = messages?.reverse();
    return new SuccessResponse("success", {
      messages: messagesReverse,
      total: total,
    }).send(res);
  }),

  updateMessage: asyncHandler(async (req: ProtectedRequest, res) => {
    const { messageId, pin } = req.body;
    const messageCurrent = await MessageRepo.findById(messageId);
    if (!messageCurrent)
      return new BadRequestResponse("Tin nhắn không tìm thấy").send(res);
    messageCurrent.pin = pin || false;
    return new SuccessResponse("success", messageCurrent).send(res);
  }),

  pushNotification: asyncHandler(async (req: ProtectedRequest, res) => {
    const { titleNotification, bodyNotification, userId, room, role } =
      req.body;
    const user = await UserRepo.findById(userId);
    if (!user) return new BadRequestResponse("User not found").send(res);
    if (!user?.chatTeleId || !user.tokenFireBase)
      return new BadRequestResponse("Token not found").send(res);
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
    bot.sendMessage(user.chatTeleId, messageBotTele, { parse_mode: 'Markdown' });

    const response = await admin.messaging().send(message as any);
    const roomCurrent = await RoomRepo.findById(room);
    if (!roomCurrent)
      return new BadRequestResponse("Nhóm chat không còn tồn tại").send(res);
    const newMessage = await MessageRepo.create({
      content: "@" + user?.name,
      room,
      sender: req.user._id,
      role,
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
      roomCurrent.lastMessage = {
        content: "@" + user?.name,
        sender: req.user,
        createdAt: new Date(),
      };
      await RoomRepo.update(roomCurrent);
    }
    return new SuccessResponse("success", newMessage).send(res);
  }),
};
