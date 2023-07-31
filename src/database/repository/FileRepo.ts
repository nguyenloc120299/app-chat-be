import { Types } from "mongoose";
import File, { FileModel } from "../model/File";

async function findById(id: Types.ObjectId): Promise<File | null> {
  return FileModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(sample: File): Promise<File> {
  const now = new Date();
  sample.createdAt = now;
  sample.updatedAt = now;
  const created = await FileModel.create(sample);
  return created.toObject();
}

async function update(sample: File): Promise<File | null> {
  sample.updatedAt = new Date();
  return FileModel.findByIdAndUpdate(sample._id, sample, { new: true })
    .lean()
    .exec();
}

export default {
  findById,
  create,
  update,
};
