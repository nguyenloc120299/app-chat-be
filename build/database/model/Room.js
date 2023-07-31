"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomModel = exports.Category = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = "Room";
exports.COLLECTION_NAME = "room";
var Category;
(function (Category) {
    Category["ABC"] = "ABC";
    Category["XYZ"] = "XYZ";
})(Category || (exports.Category = Category = {}));
const schema = new mongoose_1.Schema({
    nameRoom: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    avatarRoom: {
        type: mongoose_1.Schema.Types.String,
        default: "",
    },
    members: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: "User",
    },
    unReadMessage: {
        type: [
            {
                user: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "User",
                },
                total: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
    // messages: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "Message",
    // },
    status: {
        type: mongoose_1.Schema.Types.Boolean,
        default: true,
    },
    lastMessage: {
        type: Object,
    },
    createdAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: false,
    },
    updatedAt: {
        type: mongoose_1.Schema.Types.Date,
        required: true,
        select: false,
    },
}, {
    versionKey: false,
});
exports.RoomModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=Room.js.map