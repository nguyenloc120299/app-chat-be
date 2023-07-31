import UserRepo from "../database/repository/UserRepo";
import asyncHandler from "../helpers/asyncHandler";
import { ProtectedRequest, PublicRequest, RoleRequest } from "../types/app-request";
import crypto from "crypto";
import { AuthFailureError, BadRequestError } from "../core/ApiError";
import bcrypt from "bcrypt";
import User from "../database/model/User";
import { createTokens, getAccessToken, validateTokenData } from "../auth/authUtils";
import { getUserData } from "./utils";
import { SuccessMsgResponse, SuccessResponse, TokenRefreshResponse } from "../core/ApiResponse";
import KeystoreRepo from "../database/repository/KeystoreRepo";
import JWT from "../core/JWT";
import { Types } from "mongoose";

export const AuthControllers = {
  signUp: asyncHandler(async (req: RoleRequest, res) => {
    const user = await UserRepo.findByPhone(req.body.phone);
    if (user) throw new BadRequestError("Người dùng đã tồn tại");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const { user: createdUser, keystore } = await UserRepo.create(
      {
        name: req.body.name,
        phone: req.body.phone,
        password: passwordHash,
      } as User,
      accessTokenKey,
      refreshTokenKey,
      req.body.roleCode
    );

    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey
    );
    const userData = await getUserData(createdUser);

    new SuccessResponse("Đăng kí tài khoản thành công", {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),

  signIn: asyncHandler(async (req: PublicRequest, res) => {
    const user = await UserRepo.findByPhone(req.body.phone);
    if (!user) throw new BadRequestError("Tài khoản chưa được đăng kí");
    if (!user.password) throw new BadRequestError("Mật khẩu không đúng");

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError("Mật khẩu không đúng");

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await KeystoreRepo.create(user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
    const userData = await getUserData(user);

    new SuccessResponse("Login Success", {
      user: userData,
      tokens: tokens,
    }).send(res);
  }),
  refresh: asyncHandler(async (req: ProtectedRequest, res) => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    const accessTokenPayload = await JWT.decode(req.accessToken);

    validateTokenData(accessTokenPayload);

    const user = await UserRepo.findById(
      new Types.ObjectId(accessTokenPayload.sub)
    );
    if (!user) throw new AuthFailureError("User not registered");
    req.user = user;

    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
      throw new AuthFailureError("Invalid access token");

    const keystore = await KeystoreRepo.find(
      req.user,
      accessTokenPayload.prm,
      refreshTokenPayload.prm
    );

    if (!keystore) throw new AuthFailureError("Invalid access token");
    await KeystoreRepo.remove(keystore._id);

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    await KeystoreRepo.create(req.user, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(
      req.user,
      accessTokenKey,
      refreshTokenKey
    );

    new TokenRefreshResponse(
      "Token Issued",
      req.user,
      tokens.accessToken,
      tokens.refreshToken
    ).send(res);
  }),
  logout: asyncHandler(async (req: ProtectedRequest, res) => {
    await KeystoreRepo.remove(req.keystore._id);
    new SuccessMsgResponse("Logout success").send(res);
  }),
};