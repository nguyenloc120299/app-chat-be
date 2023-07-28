import express from "express";
import authentication from "../../auth/authentication";
import { RoleCode } from "../../database/model/Role";
import role from "../../helpers/role";
import authorization from "../../auth/authorization";
import { RoomController } from "../../controllers/room.controller";
import validator from "../../helpers/validator";
import schema from "../access/schema";
const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication, role(RoleCode.ADMIN), authorization);
/*-------------------------------------------------------------------------*/

router.post("/create", RoomController.create);

router.get(
  "/get-all",
  RoomController.getAll
);
export default router;
