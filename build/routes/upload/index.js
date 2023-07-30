"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const upload_controller_1 = require("../../controllers/upload.controller");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const router = express_1.default.Router();
router.post("/file", upload.single('file'), upload_controller_1.UploadController.upload);
exports.default = router;
//# sourceMappingURL=index.js.map