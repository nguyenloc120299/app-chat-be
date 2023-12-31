"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authentication_1 = __importDefault(require("../../auth/authentication"));
const Role_1 = require("../../database/model/Role");
const role_1 = __importDefault(require("../../helpers/role"));
const authorization_1 = __importDefault(require("../../auth/authorization"));
const room_controller_1 = require("../../controllers/room.controller");
const router = express_1.default.Router();
/*-------------------------------------------------------------------------*/
router.use(authentication_1.default, (0, role_1.default)(Role_1.RoleCode.ADMIN), authorization_1.default);
/*-------------------------------------------------------------------------*/
// router.post("/create", RoomController.create);
router.get("/get-all", room_controller_1.RoomController.getAll);
// router.get('/users',
//   UserControllers.getAllUser
// )
// router.post('/add-members', RoomController.addMembers)
router.post('/update-room', room_controller_1.RoomController.updateRoom);
router.post('/delete', room_controller_1.RoomController.deleteRoom);
exports.default = router;
//# sourceMappingURL=index.js.map