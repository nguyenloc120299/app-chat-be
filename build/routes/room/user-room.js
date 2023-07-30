"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../../auth/authentication"));
const room_controller_1 = require("../../controllers/room.controller");
const router = express_1.default.Router();
/*-------------------------------------------------------------------------*/
router.use(authentication_1.default);
/*-------------------------------------------------------------------------*/
router.get("/get-room", room_controller_1.RoomController.getRoomByUser);
router.get("/get-all-user", room_controller_1.RoomController.getAll);
router.post('/read-mess', room_controller_1.RoomController.readMessage);
exports.default = router;
//# sourceMappingURL=user-room.js.map