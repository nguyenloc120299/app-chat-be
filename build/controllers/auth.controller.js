"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthControllers = void 0;
const UserRepo_1 = __importDefault(require("../database/repository/UserRepo"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const crypto_1 = __importDefault(require("crypto"));
const ApiError_1 = require("../core/ApiError");
const bcrypt_1 = __importDefault(require("bcrypt"));
const authUtils_1 = require("../auth/authUtils");
const utils_1 = require("./utils");
const ApiResponse_1 = require("../core/ApiResponse");
const KeystoreRepo_1 = __importDefault(require("../database/repository/KeystoreRepo"));
const JWT_1 = __importDefault(require("../core/JWT"));
const mongoose_1 = require("mongoose");
exports.AuthControllers = {
    signUp: (0, asyncHandler_1.default)(async (req, res) => {
        const user = await UserRepo_1.default.findByPhone(req.body.phone);
        if (user)
            throw new ApiError_1.BadRequestError("Người dùng đã tồn tại");
        const accessTokenKey = crypto_1.default.randomBytes(64).toString("hex");
        const refreshTokenKey = crypto_1.default.randomBytes(64).toString("hex");
        const passwordHash = await bcrypt_1.default.hash(req.body.password, 10);
        const { user: createdUser, keystore } = await UserRepo_1.default.create({
            name: req.body.name,
            phone: req.body.phone,
            password: passwordHash,
            linkFaceBook: req.body.linkFaceBook,
            linkTelegram: req.body.linkTelegram
        }, accessTokenKey, refreshTokenKey, req.body.roleCode);
        const tokens = await (0, authUtils_1.createTokens)(createdUser, keystore.primaryKey, keystore.secondaryKey);
        const userData = await (0, utils_1.getUserData)(createdUser);
        new ApiResponse_1.SuccessResponse("Đăng kí tài khoản thành công", {
            user: userData,
            tokens: tokens,
        }).send(res);
    }),
    signIn: (0, asyncHandler_1.default)(async (req, res) => {
        const user = await UserRepo_1.default.findByPhone(req.body.phone);
        if (!user)
            throw new ApiError_1.BadRequestError("Tài khoản chưa được đăng kí");
        if (!user.password)
            throw new ApiError_1.BadRequestError("Mật khẩu không đúng");
        const match = await bcrypt_1.default.compare(req.body.password, user.password);
        if (!match)
            throw new ApiError_1.AuthFailureError("Mật khẩu không đúng");
        const accessTokenKey = crypto_1.default.randomBytes(64).toString("hex");
        const refreshTokenKey = crypto_1.default.randomBytes(64).toString("hex");
        await KeystoreRepo_1.default.create(user, accessTokenKey, refreshTokenKey);
        const tokens = await (0, authUtils_1.createTokens)(user, accessTokenKey, refreshTokenKey);
        const userData = await (0, utils_1.getUserData)(user);
        new ApiResponse_1.SuccessResponse("Login Success", {
            user: userData,
            tokens: tokens,
        }).send(res);
    }),
    refresh: (0, asyncHandler_1.default)(async (req, res) => {
        req.accessToken = (0, authUtils_1.getAccessToken)(req.headers.authorization); // Express headers are auto converted to lowercase
        const accessTokenPayload = await JWT_1.default.decode(req.accessToken);
        (0, authUtils_1.validateTokenData)(accessTokenPayload);
        const user = await UserRepo_1.default.findById(new mongoose_1.Types.ObjectId(accessTokenPayload.sub));
        if (!user)
            throw new ApiError_1.AuthFailureError("User not registered");
        req.user = user;
        const refreshTokenPayload = await JWT_1.default.validate(req.body.refreshToken);
        (0, authUtils_1.validateTokenData)(refreshTokenPayload);
        if (accessTokenPayload.sub !== refreshTokenPayload.sub)
            throw new ApiError_1.AuthFailureError("Invalid access token");
        const keystore = await KeystoreRepo_1.default.find(req.user, accessTokenPayload.prm, refreshTokenPayload.prm);
        if (!keystore)
            throw new ApiError_1.AuthFailureError("Invalid access token");
        await KeystoreRepo_1.default.remove(keystore._id);
        const accessTokenKey = crypto_1.default.randomBytes(64).toString("hex");
        const refreshTokenKey = crypto_1.default.randomBytes(64).toString("hex");
        await KeystoreRepo_1.default.create(req.user, accessTokenKey, refreshTokenKey);
        const tokens = await (0, authUtils_1.createTokens)(req.user, accessTokenKey, refreshTokenKey);
        const userData = await (0, utils_1.getUserData)(user);
        new ApiResponse_1.TokenRefreshResponse("Token Issued", userData, tokens.accessToken, tokens.refreshToken).send(res);
    }),
    logout: (0, asyncHandler_1.default)(async (req, res) => {
        await KeystoreRepo_1.default.remove(req.keystore._id);
        new ApiResponse_1.SuccessMsgResponse("Logout success").send(res);
    }),
};
//# sourceMappingURL=auth.controller.js.map