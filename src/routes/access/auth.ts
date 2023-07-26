import express from "express";
import validator from "../../helpers/validator";
import schema from "./schema";
import { AuthControllers } from "../../controllers/auth.controller";


const router = express.Router();

router.post(
  "/signup",
  validator(schema.signup),
  AuthControllers.signUp
);

router.post(
  "/signin",
  validator(schema.signin),
  AuthControllers.signIn
);


export default router;
