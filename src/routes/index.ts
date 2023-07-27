import express from "express";
// import { Permission } from "../database/model/ApiKey";
// import apikey from "../auth/apikey";
// import permission from "../helpers/permission";
import signup from "./access/auth";
import me from './access/user'
import room from './room/create'
const router = express.Router();

/*---------------------------------------------------------*/
// router.use(apikey);

// router.use(permission(Permission.GENERAL));


/*---------------------------------------------------------*/
/*---------------------------------------------------------*/

router.use("/auth", signup);
router.use("/profile", me);
router.use("/room", room);

export default router;