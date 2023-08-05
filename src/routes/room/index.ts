import express from "express";
import authentication from "../../auth/authentication";
import { RoleCode } from "../../database/model/Role";
import role from "../../helpers/role";
import authorization from "../../auth/authorization";
import { RoomController } from "../../controllers/room.controller";
import { UserControllers } from "../../controllers/user.controller";
const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

router.post("/create", RoomController.create);

router.get(
  "/get-all",
  RoomController.getAll
);

router.get('/users',
  UserControllers.getAllUser
)

router.post('/add-members', RoomController.addMembers)

router.post('/update-room', RoomController.updateRoom)

router.post('/delete', RoomController.deleteRoom)

export default router; 
