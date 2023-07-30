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
const router = express.Router();

/*---------------------------------------------------------*/
// router.use(apikey);

// router.use(permission(Permission.GENERAL));


/*---------------------------------------------------------*/
/*---------------------------------------------------------*/

router.use("/auth", signup);
router.use("/profile", me);
router.use("/room", room);
router.use("/room-user", userRoom);
router.use("/message", mess);
router.use('/upload', upload)
export default router;