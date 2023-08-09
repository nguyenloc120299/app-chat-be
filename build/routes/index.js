"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { Permission } from "../database/model/ApiKey";
// import apikey from "../auth/apikey";
// import permission from "../helpers/permission";
const auth_1 = __importDefault(require("./access/auth"));
const user_1 = __importDefault(require("./access/user"));
const room_1 = __importDefault(require("./room"));
const chat_1 = __importDefault(require("./chat"));
const user_room_1 = __importDefault(require("./room/user-room"));
const upload_1 = __importDefault(require("./upload"));
const create_1 = __importDefault(require("./room/create"));
const asyncHandler_1 = __importDefault(require("../helpers/asyncHandler"));
const ApiResponse_1 = require("../core/ApiResponse");
const router = express_1.default.Router();
/*---------------------------------------------------------*/
// router.use(apikey);
// router.use(permission(Permission.GENERAL));
/*---------------------------------------------------------*/
/*---------------------------------------------------------*/
router.use("/room-manager", create_1.default);
router.use("/auth", auth_1.default);
router.use("/profile", user_1.default);
router.use("/room", room_1.default);
router.use("/room-user", user_room_1.default);
router.use("/message", chat_1.default);
router.use('/upload', upload_1.default);
router.get('/check', (0, asyncHandler_1.default)(async (req, res) => {
    new ApiResponse_1.SuccessResponse("OK", true).send(res);
}));
exports.default = router;
//# sourceMappingURL=index.js.map