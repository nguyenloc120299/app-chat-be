"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../model/Message");
async function findById(id) {
    return Message_1.MessageModel.findOne({ _id: id, status: true }).lean().exec();
}
async function findByRoom(room, page, limit) {
    const startIndex = (page - 1) * limit;
    return Message_1.MessageModel.find({ room: room, status: true })
        .populate('sender')
        .sort({ createdAt: -1 })
        .skip(startIndex)
        .limit(limit)
        .lean()
        .exec();
}
async function findLastMessageByRoom(id) {
    return Message_1.MessageModel.findOne({ room: id })
        .populate({
        path: "sender",
        select: "name",
    })
        .sort({ createdAt: -1 })
        .select("+sender +content +createdAt -room -_id")
        .limit(1)
        .lean()
        .exec();
}
async function create(sample) {
    const now = new Date();
    sample.createdAt = now;
    sample.updatedAt = now;
    const created = await Message_1.MessageModel.create(sample);
    return created.toObject();
}
async function update(sample) {
    sample.updatedAt = new Date();
    return Message_1.MessageModel.findByIdAndUpdate(sample._id, sample, { new: true })
        .lean()
        .exec();
}
exports.default = {
    findById,
    create,
    update,
    findLastMessageByRoom,
    findByRoom,
};
//# sourceMappingURL=MessageRepo.js.map