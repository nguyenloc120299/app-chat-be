"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("../model/Room");
async function findById(id) {
    return Room_1.RoomModel.findOne({ _id: id, status: true })
        .populate('members')
        .lean().exec();
}
async function findAll(page, pageSize) {
    const startIndex = (page - 1) * pageSize;
    return Room_1.RoomModel.find()
        .populate("members")
        .sort({ createdAt: -1, updatedAt: -1 })
        .skip(startIndex).limit(pageSize).lean().exec();
}
async function findRoomsByUsers(user, page, pageSize) {
    const startIndex = (page - 1) * pageSize;
    return Room_1.RoomModel.find({ members: { $in: user } })
        .populate('members')
        .skip(startIndex)
        .limit(pageSize)
        .lean()
        .exec();
}
async function create(sample) {
    const now = new Date();
    sample.createdAt = now;
    sample.updatedAt = now;
    const created = await Room_1.RoomModel.create(sample);
    return created.toObject();
}
async function update(sample) {
    sample.updatedAt = new Date();
    return Room_1.RoomModel.findByIdAndUpdate(sample._id, sample, { new: true })
        .lean()
        .exec();
}
exports.default = {
    findById,
    create,
    update,
    findAll,
    findRoomsByUsers,
};
//# sourceMappingURL=RoomRepo.js.map