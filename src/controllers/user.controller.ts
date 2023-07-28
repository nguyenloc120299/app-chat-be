import { ProtectedRequest } from "app-request";
import asyncHandler from "../helpers/asyncHandler";
import UserRepo from "../database/repository/UserRepo";
import { BadRequestError } from "../core/ApiError";
import { SuccessResponse } from "../core/ApiResponse";
import _ from "lodash";


export const UserControllers = {
    getMe: asyncHandler(async (req: ProtectedRequest, res) => {
        const user = await UserRepo.findPrivateProfileById(req.user._id);
        if (!user) throw new BadRequestError('User not registered');

        return new SuccessResponse(
            'success',
            _.pick(user, ['name', 'email', 'profilePicUrl', 'roles']),
        ).send(res);
    }),
}
