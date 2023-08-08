import { Types } from "mongoose";
import ROOM, { RoomModel } from "../model/Room";

async function findById(id: Types.ObjectId): Promise<ROOM | null> {
  return RoomModel.findOne({ _id: id, status: true })
    .populate({
      path: "members",
      populate: {
        path: "roles",
      },
    })
    .lean()
    .exec();
}

async function findAll(page: number, pageSize: number, search: string): Promise<ROOM[] | []> {
  const startIndex = (page - 1) * pageSize;
  const searchRegex = new RegExp(search, 'i');
  let query: any = {
    $or: [
      { nameRoom: searchRegex },
    ]
  };
  return RoomModel.find(query)
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

async function findRoomsByUsers(
  user: Types.ObjectId,
  page: number,
  pageSize: number,
  search: string
): Promise<ROOM[]> {
  const startIndex = (page - 1) * pageSize;
  const searchRegex = new RegExp(search, 'i');
  let query: any = {
    $or: [
      { nameRoom: searchRegex },
    ],
    members: { $in: user }
  };
  return RoomModel.find(query)
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
async function countRooms(): Promise<number> {
  return RoomModel.countDocuments()
}

async function create(sample: ROOM): Promise<ROOM> {
  const now = new Date();
  sample.createdAt = now;
  sample.updatedAt = now;
  const created = await RoomModel.create(sample);
  await created.populate('members')
  return created.toObject();
}

async function update(sample: ROOM): Promise<ROOM | null> {
  sample.updatedAt = new Date();
  return RoomModel.findByIdAndUpdate(sample._id, sample, { new: true })
    .lean()
    .exec();
}
async function deleteRoom(room: Types.ObjectId) {
  await RoomModel.findByIdAndDelete({ _id: room })
}
export default {
  findById,
  create,
  update,
  findAll,
  findRoomsByUsers,
  countRooms,
  deleteRoom
};
