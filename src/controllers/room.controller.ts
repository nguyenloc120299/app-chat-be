import { ProtectedRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";
import RoomRepo from "../database/repository/RoomRepo";
import ROOM from "../database/model/Room";
import { SuccessResponse } from "../core/ApiResponse";
export const RoomController = {
    create: asyncHandler(async (req: ProtectedRequest, res) => {
        const { nameRoom, avatarRoom, members } = req.body
        const newRoom = await RoomRepo.create({
            nameRoom,
            avatarRoom,
            members: [
                req.user._id, ...members
            ],
            unReadMessage: [
                {
                    total: 0,
                    user: req.user._id
                },
            ]
        } as ROOM)
        new SuccessResponse('Blog created successfully', newRoom).send(res);
    })
}