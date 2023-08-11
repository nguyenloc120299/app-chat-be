import express from "express";
import authentication from "../../auth/authentication";
import { RoleCode } from "../../database/model/Role";
import role from "../../helpers/role";
import authorization from "../../auth/authorization";
import { RoomController } from "../../controllers/room.controller";

const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.ADMIN,RoleCode.EMPLOYEE), authorization);
/*-------------------------------------------------------------------------*/

router.post("/create", RoomController.create);
router.get("/get-all-user", RoomController.getAll);



export default router;
