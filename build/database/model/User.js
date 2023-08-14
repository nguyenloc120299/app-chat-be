"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = "User";
exports.COLLECTION_NAME = "users";
const schema = new mongoose_1.Schema({
    name: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
        maxlength: 200,
    },
    profilePicUrl: {
        type: mongoose_1.Schema.Types.String,
        trim: true,
    },
    tokenFireBase: {
        type: mongoose_1.Schema.Types.String,
    },
    chatTeleId: {
        type: mongoose_1.Schema.Types.Number,
    },
    phone: {
        type: mongoose_1.Schema.Types.String,
        unique: true,
        //sparse: true, // allows null
        required: true,
        trim: true,
        select: true,
    },
    password: {
        type: mongoose_1.Schema.Types.String,
        select: false,
    },
    linkFaceBook: {
        type: mongoose_1.Schema.Types.String,
        select: true,
    },
    linkTelegram: {
        type: mongoose_1.Schema.Types.String,
        select: true,
    },
    roles: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Role",
            },
        ],
        required: true,
        select: false,
    },
    verified: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false,
    },
    status: {
        type: mongoose_1.Schema.Types.Boolean,
        default: true,
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: true,
    },
    updatedAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: false,
    },
}, {
    versionKey: false,
});
schema.index({ _id: 1, status: 1 });
schema.index({ phone: 1 });
schema.index({ status: 1 });
exports.UserModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=User.js.map