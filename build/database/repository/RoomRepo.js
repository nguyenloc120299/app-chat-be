"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("../model/Room");
async function findById(id) {
    return Room_1.RoomModel.findOne({ _id: id, status: true })
        .populate({
        path: "members",
        populate: {
            path: "roles",
        },
    })
        .lean()
        .exec();
}
async function findAll(page, pageSize, search) {
    const startIndex = (page - 1) * pageSize;
    const searchRegex = new RegExp(search, 'i');
    let query = {
        $or: [
            { nameRoom: searchRegex },
        ]
    };
    return Room_1.RoomModel.find(query)
        .populate({
        path: "members",
        populate: {
            path: "roles",
        },
    })
        .sort({ createdAt: -1, updatedAt: -1 })
        .skip(startIndex)
        .limit(pageSize)
        .lean()
        .exec();
}
async function findRoomsByUsers(user, page, pageSize, search) {
    const startIndex = (page - 1) * pageSize;
    const searchRegex = new RegExp(search, 'i');
    let query = {
        $or: [
            { nameRoom: searchRegex },
        ],
        members: { $in: user }
    };
    return Room_1.RoomModel.find(query)
        .populate({
        path: "members",
        populate: {
            path: "roles",
        },
    })
        .skip(startIndex)
        .limit(pageSize)
        .lean()
        .exec();
}
async function countRooms() {
    return Room_1.RoomModel.countDocuments();
}
async function create(sample) {
    const now = new Date();
    sample.createdAt = now;
    sample.updatedAt = now;
    const created = await Room_1.RoomModel.create(sample);
    await created.populate({
        path: "members",
        populate: {
            path: "roles",
        },
    });
    return created.toObject();
}
async function update(sample) {
    sample.updatedAt = new Date();
    return Room_1.RoomModel.findByIdAndUpdate(sample._id, sample, { new: true })
        .populate({
        path: "members",
        populate: {
            path: "roles",
        },
    })
        .lean()
        .exec();
}
async function deleteRoom(room) {
    await Room_1.RoomModel.findByIdAndDelete({ _id: room });
}
exports.default = {
    findById,
    create,
    update,
    findAll,
    findRoomsByUsers,
    countRooms,
    deleteRoom
};
//# sourceMappingURL=RoomRepo.js.map