"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const validator_1 = require("../../helpers/validator");
exports.default = {
    send: joi_1.default.object().keys({
        content: joi_1.default.string().required(),
        room: joi_1.default.string().required(),
    }),
    roomId: joi_1.default.object().keys({
        roomId: (0, validator_1.JoiObjectId)().required(),
    }),
};
//# sourceMappingURL=schema.js.map