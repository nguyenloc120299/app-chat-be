import User, { UserModel } from "../model/User";
import Role, { RoleCode, RoleModel } from "../model/Role";
import { InternalError } from "../../core/ApiError";
import { Types } from "mongoose";
import KeystoreRepo from "./KeystoreRepo";
import Keystore from "../model/Keystore";

async function exists(id: Types.ObjectId): Promise<boolean> {
  const user = await UserModel.exists({ _id: id, status: true });
  return user !== null && user !== undefined;
}

async function findPrivateProfileById(
  id: Types.ObjectId
): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true })
    .select("+email")
    .populate({
      path: "roles",
      match: { status: true },
      select: { code: 1 },
    })
    .lean<User>()
    .exec();
}

async function findAll(page: number, pageSize: number, roleName: RoleCode | [], search: string, userId: Types.ObjectId): Promise<User[] | []> {
  const startIndex = (page - 1) * pageSize;
  const searchQuery = search;

  // Create a regular expression to perform a case-insensitive search
  const searchRegex = new RegExp(searchQuery, 'i');

  let query: any = {};

  if (roleName) {
    const role = await RoleModel.findOne({ code: roleName }).exec();
    query.roles = { $in: [role?._id] };
  }

  if (searchQuery) {
    // Perform a case-insensitive search on name and phone fields
    query.$or = [
      { name: searchRegex },
      { phone: searchRegex },
    ];
  }
  query._id = { $ne: userId };
  // Execute the query
  if (Object.keys(query).length > 0) {
    return UserModel.find(query)
      .skip(startIndex)
      .limit(pageSize)
      .lean()
      .exec();
  } else {
    return UserModel.find({})
      .skip(startIndex)
      .limit(pageSize)
      .lean()
      .exec();
  }
}


// contains critical information of the user
async function findById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true })
    .select("+email +password +roles")
    .populate({
      path: "roles",
      match: { status: true },
    })
    .lean()
    .exec();
}

async function findByPhone(phone: string): Promise<User | null> {
  return UserModel.findOne({ phone })
    .select(
      "+email +password +roles +gender +dob +grade +country +state +city +school +bio +hobbies"
    )
    .populate({
      path: "roles",
      match: { status: true },
      select: { code: 1 },
    })
    .lean()
    .exec();
}

async function findFieldsById(
  id: Types.ObjectId,
  ...fields: string[]
): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true }, [...fields])
    .lean()
    .exec();
}

async function findPublicProfileById(id: Types.ObjectId): Promise<User | null> {
  return UserModel.findOne({ _id: id, status: true }).lean().exec();
}

async function create(
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string,
  roleCode: string
): Promise<{ user: User; keystore: Keystore }> {
  const now = new Date();

  const role = await RoleModel.findOne({ code: roleCode })
    .select("+code")
    .lean()
    .exec();
  if (!role) throw new InternalError("Role must be defined");

  user.roles = [role];
  user.createdAt = user.updatedAt = now;
  const createdUser = await UserModel.create(user);
  const keystore = await KeystoreRepo.create(
    createdUser,
    accessTokenKey,
    refreshTokenKey
  );
  return {
    user: { ...createdUser.toObject(), roles: user.roles },
    keystore: keystore,
  };
}

async function update(
  user: User,
  accessTokenKey: string,
  refreshTokenKey: string
): Promise<{ user: User; keystore: Keystore }> {
  user.updatedAt = new Date();
  await UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
  const keystore = await KeystoreRepo.create(
    user,
    accessTokenKey,
    refreshTokenKey
  );
  return { user: user, keystore: keystore };
}

async function updateInfo(user: User): Promise<any> {
  user.updatedAt = new Date();
  return UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
    .lean()
    .exec();
}

async function findOneByToken(token: string): Promise<User | null> {
  return await UserModel.findOne({ tokenFireBase: token })
}
export default {
  exists,
  findPrivateProfileById,
  findById,
  findByPhone,
  findFieldsById,
  findPublicProfileById,
  create,
  update,
  updateInfo,
  findAll,
  findOneByToken
};
