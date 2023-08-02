"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageModel = exports.TypeSend = exports.Category = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
const Role_1 = require("./Role");
exports.DOCUMENT_NAME = "Message";
exports.COLLECTION_NAME = "messages";
var Category;
(function (Category) {
    Category["ABC"] = "ABC";
    Category["XYZ"] = "XYZ";
})(Category || (exports.Category = Category = {}));
var TypeSend;
(function (TypeSend) {
    TypeSend["TEXT"] = "VIDEO";
    TypeSend["IMAGE"] = "IMAGE";
})(TypeSend || (exports.TypeSend = TypeSend = {}));
const schema = new mongoose_1.Schema({
    content: {
        type: mongoose_1.Schema.Types.String,
    },
    file: {
        type: mongoose_1.Schema.Types.String,
    },
    pin: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false
    },
    typeFile: {
        type: mongoose_1.Schema.Types.String,
        enum: Object.values(TypeSend),
    },
    role: {
        type: mongoose_1.Schema.Types.String,
        enum: Object.values(Role_1.RoleCode),
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    room: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
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
schema.index({ code: 1, status: 1 });
exports.MessageModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=Message.js.map