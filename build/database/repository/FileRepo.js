"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const File_1 = require("../model/File");
async function findById(id) {
    return File_1.FileModel.findOne({ _id: id, status: true }).lean().exec();
}
async function create(sample) {
    const now = new Date();
    sample.createdAt = now;
    sample.updatedAt = now;
    const created = await File_1.FileModel.create(sample);
    return created.toObject();
}
async function update(sample) {
    sample.updatedAt = new Date();
    return File_1.FileModel.findByIdAndUpdate(sample._id, sample, { new: true })
        .lean()
        .exec();
}
exports.default = {
    findById,
    create,
    update,
};
//# sourceMappingURL=FileRepo.js.map