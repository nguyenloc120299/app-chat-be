"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const UserRepo_1 = __importDefault(require("../database/repository/UserRepo"));
const ApiError_1 = require("../core/ApiError");
const ApiResponse_1 = require("../core/ApiResponse");
const lodash_1 = __importDefault(require("lodash"));
exports.UserControllers = {
    getMe: (0, asyncHandler_1.default)(async (req, res) => {
        const user = await UserRepo_1.default.findPrivateProfileById(req.user._id);
        if (!user)
            throw new ApiError_1.BadRequestError('User not registered');
        return new ApiResponse_1.SuccessResponse('success', lodash_1.default.pick(user, ['name', 'email', 'profilePicUrl', 'roles'])).send(res);
    }),
    getAllUser: (0, asyncHandler_1.default)(async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search;
        const roleName = req.query.roleName;
        const users = await UserRepo_1.default.findAll(page, limit, roleName, search);
        return new ApiResponse_1.SuccessResponse('success', users).send(res);
    })
};
//# sourceMappingURL=user.controller.js.map