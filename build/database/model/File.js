"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileModel = exports.Category = exports.COLLECTION_NAME = exports.DOCUMENT_NAME = void 0;
const mongoose_1 = require("mongoose");
exports.DOCUMENT_NAME = "File";
exports.COLLECTION_NAME = "files";
var Category;
(function (Category) {
    Category["ABC"] = "ABC";
    Category["XYZ"] = "XYZ";
})(Category || (exports.Category = Category = {}));
const schema = new mongoose_1.Schema({
    public_id: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    url: {
        type: mongoose_1.Schema.Types.String,
        required: true,
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