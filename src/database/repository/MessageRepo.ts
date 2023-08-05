import { Types } from "mongoose";
import MESSAGE, { MessageModel } from "../model/Message";

async function findById(id: Types.ObjectId): Promise<MESSAGE | null> {
  return MessageModel.findOne({ _id: id, status: true }).lean().exec();
}
async function countMessagesById(id: Types.ObjectId): Promise<number> {
  return MessageModel.countDocuments({ room: id, status: true });
}

async function findByRoom(
  room: Types.ObjectId,
  page: number,
  limit: number
): Promise<MESSAGE[] | null> {
  const startIndex = (page - 1) * limit;
  return MessageModel.find({ room: room, status: true })
    .populate("sender")
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .lean()
    .exec();
}

async function findLastMessageByRoom(
  id: Types.ObjectId
): Promise<MESSAGE | null> {
  return MessageModel.findOne({ room: id })
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

async function create(sample: MESSAGE): Promise<MESSAGE> {
  const now = new Date();
  sample.createdAt = now;
  sample.updatedAt = now;
  const created = await MessageModel.create(sample);

  return created.toObject();
}

async function update(sample: MESSAGE): Promise<MESSAGE | null> {
  sample.updatedAt = new Date();
  return MessageModel.findByIdAndUpdate(sample._id, sample, { new: true })
    .lean()
    .exec();
}

async function deleteManyByRoom(room: Types.ObjectId): Promise<any> {
  await MessageModel.deleteMany({ room })
}

export default {
  findById,
  create,
  update,
  findLastMessageByRoom,
  findByRoom,
  countMessagesById,
  deleteManyByRoom
};
