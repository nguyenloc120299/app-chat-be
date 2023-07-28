import Joi from "joi";
import { JoiObjectId } from "../../helpers/validator";

export default {
  send: Joi.object().keys({
    content: Joi.string().required(),
    room: Joi.string().required(),
  }),
  roomId: Joi.object().keys({
    roomId: JoiObjectId().required(),
  }),
};
