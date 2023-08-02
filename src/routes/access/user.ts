import express from "express";
import validator from "../../helpers/validator";
import schema from "./schema";
import { AuthControllers } from "../../controllers/auth.controller";
import authentication from "../../auth/authentication";
import { UserControllers } from "../../controllers/user.controller";


const router = express.Router();


/*-------------------------------------------------------------------------*/
router.use(authentication);
/*-------------------------------------------------------------------------*/

router.get(
    '/me',
    UserControllers.getMe
);

router.post('/refresh',
    AuthControllers.refresh
)

router.post('/me',UserControllers.updateMe)

router.delete("/logout", AuthControllers.logout);

export default router;
