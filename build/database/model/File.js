"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModel = exports.TYPEFILE = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = "File";
exports.COLLECTION_NAME = "files";
var TYPEFILE;
(function (TYPEFILE) {
    TYPEFILE["AVATAR"] = "AVATAR";
    TYPEFILE["MESSAGE"] = "MESSAGE";
    TYPEFILE["ORDER"] = "ORDER";
})(TYPEFILE || (exports.TYPEFILE = TYPEFILE = {}));
const schema = new mongoose_1.Schema({
    public_id: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    url: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    type: {
        type: mongoose_1.Schema.Types.String,
        required: true,
        enum: Object.values(TYPEFILE)
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
exports.FileModel = (0, mongoose_1.model)(exports.DOCUMENT_NAME, schema, exports.COLLECTION_NAME);
//# sourceMappingURL=File.js.map