import express from "express";
// import { Permission } from "../database/model/ApiKey";
// import apikey from "../auth/apikey";
// import permission from "../helpers/permission";
import signup from "./access/auth";
import me from './access/user'
import room from './room'
import mess from './chat'
import userRoom from './room/user-room'
import upload from './upload'
import roomManager from './room/create'
import asyncHandler from "../helpers/asyncHandler";
import { PublicRequest } from "app-request";
import { SuccessResponse } from "../core/ApiResponse";

const router = express.Router();

/*---------------------------------------------------------*/
// router.use(apikey);

// router.use(permission(Permission.GENERAL));


/*---------------------------------------------------------*/
/*---------------------------------------------------------*/

router.use("/room-manager", roomManager);
router.use("/auth", signup);
router.use("/profile", me);
router.use("/room", room);
router.use("/room-user", userRoom);
router.use("/message", mess);
router.use('/upload', upload)

router.get('/check', asyncHandler(async (req: PublicRequest, res) => {
    new SuccessResponse("OK", true).send(res)
}))
export default router;