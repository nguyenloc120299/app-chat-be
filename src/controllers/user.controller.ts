import { ProtectedRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";
import UserRepo from "../database/repository/UserRepo";
import { BadRequestError } from "../core/ApiError";
import { SuccessResponse } from "../core/ApiResponse";
import _ from "lodash";
import { RoleCode } from "../database/model/Role";
import User from "../database/model/User";

export const UserControllers = {
  getMe: asyncHandler(async (req: ProtectedRequest, res) => {
    const user = await UserRepo.findPrivateProfileById(req.user._id);
    if (!user) throw new BadRequestError("User not registered");
    return new SuccessResponse(
      "success",
      _.pick(user, [
        "name",
        "email",
        "profilePicUrl",
        "roles",
        "linkFaceBook",
        "linkTelegram",
      ])
    ).send(res);
  }),

  getAllUser: asyncHandler(async (req: ProtectedRequest, res) => {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const search = req.query.search as string | "";
    const roleName = req.query.roleName as RoleCode;
    const users = await UserRepo.findAll(
      page,
      limit,
      roleName,
      search,
      req.user._id
    );

    return new SuccessResponse("success", users).send(res);
  }),
  updateMe: asyncHandler(async (req: ProtectedRequest, res) => {
    const { name, profilePicUrl, linkFaceBook, linkTelegram, tokenFireBase } =
      req.body;
    console.log(name, profilePicUrl, linkFaceBook, linkTelegram);

    const user = await UserRepo.findPrivateProfileById(req.user._id);

    if (!user) throw new BadRequestError("User not registered");
    user.name = name;
    user.profilePicUrl = profilePicUrl || user.profilePicUrl;
    user.linkFaceBook = linkFaceBook || "";
    user.linkTelegram = linkTelegram || "";
    user.tokenFireBase = tokenFireBase || user.tokenFireBase;
    await UserRepo.updateInfo(user);

    return new SuccessResponse("Profile updated", user).send(res);
  }),
};
