
import { Types } from "mongoose";
import ROOM, { RoomModel } from "../model/Room";

async function findById(id: Types.ObjectId): Promise<ROOM | null> {
    return RoomModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(sample: ROOM): Promise<ROOM> {
    const now = new Date();
    sample.createdAt = now;
    sample.updatedAt = now;
    const created = await RoomModel.create(sample);
    return created.toObject();
}

async function update(sample: ROOM): Promise<ROOM | null> {
    sample.updatedAt = new Date();
    return RoomModel.findByIdAndUpdate(sample._id, sample, { new: true })
        .lean()
        .exec();
}


export default {
    findById,
    create,
    update,
};
