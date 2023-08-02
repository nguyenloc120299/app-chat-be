"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../../controllers/auth.controller");
const authentication_1 = __importDefault(require("../../auth/authentication"));
const user_controller_1 = require("../../controllers/user.controller");
const router = express_1.default.Router();
/*-------------------------------------------------------------------------*/
router.use(authentication_1.default);
/*-------------------------------------------------------------------------*/
router.get('/me', user_controller_1.UserControllers.getMe);
router.post('/refresh', auth_controller_1.AuthControllers.refresh);
router.post('/me', user_controller_1.UserControllers.updateMe);
router.delete("/logout", auth_controller_1.AuthControllers.logout);
exports.default = router;
//# sourceMappingURL=user.js.map