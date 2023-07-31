import Joi from "joi";
import { JoiAuthBearer } from "../../helpers/validator";

export default {
  credential: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
  refreshToken: Joi.object().keys({
    refreshToken: Joi.string().required().min(1),
  }),
  auth: Joi.object()
    .keys({
      authorization: JoiAuthBearer().required(),
    })
    .unknown(true),
  signup: Joi.object().keys({
    name: Joi.string().required().min(3),
    phone: Joi.string().required(),
    password: Joi.string().required().min(6),
    roleCode: Joi.string().required(),
    linkFaceBook: Joi.string().required(),
    linkTelegram: Joi.string().required()
  }),

  signin: Joi.object().keys({
    phone: Joi.string().required(),
    password: Joi.string().required().min(6),
  })
};
