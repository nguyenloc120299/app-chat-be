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
router.use(authentication_1.default, (0, role_1.default)(Role_1.RoleCode.ADMIN, Role_1.RoleCode.EMPLOYEE), authorization_1.default);
/*-------------------------------------------------------------------------*/
router.post("/create", room_controller_1.RoomController.create);
router.get("/get-all-user", room_controller_1.RoomController.getAll);
exports.default = router;
//# sourceMappingURL=create.js.map