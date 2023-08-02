"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = require("../../controllers/message.controller");
const authentication_1 = __importDefault(require("../../auth/authentication"));
const router = express_1.default.Router();
/*-------------------------------------------------------------------------*/
router.use(authentication_1.default);
/*-------------------------------------------------------------------------*/
router.post("/send", message_controller_1.MessageController.send);
router.get("/all", message_controller_1.MessageController.getAll);
router.post("/update", message_controller_1.MessageController.updateMessage);
exports.default = router;
//# sourceMappingURL=index.js.map