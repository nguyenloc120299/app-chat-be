
import { Types } from "mongoose";
import Message, { MessageModel } from "../model/Message";

async function findById(id: Types.ObjectId): Promise<Message | null> {
  return MessageModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(sample: Message): Promise<Message> {
  const now = new Date();
  sample.createdAt = now;
  sample.updatedAt = now;
  const created = await MessageModel.create(sample);
  return created.toObject();
}

async function update(sample: Message): Promise<Message | null> {
  sample.updatedAt = new Date();
  return MessageModel.findByIdAndUpdate(sample._id, sample, { new: true })
    .lean()
    .exec();
}

export default {
  findById,
  create,
  update,
};
