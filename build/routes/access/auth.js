"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validator_1 = __importDefault(require("../../helpers/validator"));
const schema_1 = __importDefault(require("./schema"));
const auth_controller_1 = require("../../controllers/auth.controller");
const router = express_1.default.Router();
router.post("/signup", (0, validator_1.default)(schema_1.default.signup), auth_controller_1.AuthControllers.signUp);
router.post("/signin", (0, validator_1.default)(schema_1.default.signin), auth_controller_1.AuthControllers.signIn);
exports.default = router;
//# sourceMappingURL=auth.js.map