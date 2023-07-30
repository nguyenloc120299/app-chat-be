import express from "express";
import { MessageController } from "../../controllers/message.controller";
import authentication from "../../auth/authentication";
import validator, { ValidationSource } from "../../helpers/validator";
import schema from "./schema";
const router = express.Router();

/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.post("/send", MessageController.send);

router.get(
  "/all",
  MessageController.getAll
);
export default router;
