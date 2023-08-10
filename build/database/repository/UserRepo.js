"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../model/User");
const Role_1 = require("../model/Role");
const ApiError_1 = require("../../core/ApiError");
const KeystoreRepo_1 = __importDefault(require("./KeystoreRepo"));
async function exists(id) {
    const user = await User_1.UserModel.exists({ _id: id, status: true });
    return user !== null && user !== undefined;
}
async function findPrivateProfileById(id) {
    return User_1.UserModel.findOne({ _id: id, status: true })
        .select("+email")
        .populate({
        path: "roles",
        match: { status: true },
        select: { code: 1 },
    })
        .lean()
        .exec();
}
async function findAllAdmin() {
    let query = {};
    const role = await Role_1.RoleModel.findOne({ code: Role_1.RoleCode.ADMIN }).exec();
    query.roles = { $in: [role === null || role === void 0 ? void 0 : role._id] };
    return User_1.UserModel.find(query).lean().exec();
}
async function findAll(page, pageSize, roleName, search, userId) {
    const startIndex = (page - 1) * pageSize;
    const searchQuery = search;
    // Create a regular expression to perform a case-insensitive search
    const searchRegex = new RegExp(searchQuery, "i");
    let query = {};
    if (roleName) {
        const role = await Role_1.RoleModel.findOne({ code: roleName }).exec();
        query.roles = { $in: [role === null || role === void 0 ? void 0 : role._id] };
    }
    if (searchQuery) {
        // Perform a case-insensitive search on name and phone fields
        query.$or = [{ name: searchRegex }, { phone: searchRegex }];
    }
    query._id = { $ne: userId };
    // Execute the query
    if (Object.keys(query).length > 0) {
        return User_1.UserModel.find(query).skip(startIndex).limit(pageSize).lean().exec();
    }
    else {
        return User_1.UserModel.find({}).skip(startIndex).limit(pageSize).lean().exec();
    }
}
// contains critical information of the user
async function findById(id) {
    return User_1.UserModel.findOne({ _id: id, status: true })
        .select("+email +password +roles")
        .populate({
        path: "roles",
        match: { status: true },
    })
        .lean()
        .exec();
}
async function findByPhone(phone) {
    return User_1.UserModel.findOne({ phone })
        .select("+email +password +roles +gender +dob +grade +country +state +city +school +bio +hobbies")
        .populate({
        path: "roles",
        match: { status: true },
        select: { code: 1 },
    })
        .lean()
        .exec();
}
async function findFieldsById(id, ...fields) {
    return User_1.UserModel.findOne({ _id: id, status: true }, [...fields])
        .lean()
        .exec();
}
async function findPublicProfileById(id) {
    return User_1.UserModel.findOne({ _id: id, status: true }).lean().exec();
}
async function create(user, accessTokenKey, refreshTokenKey, roleCode) {
    const now = new Date();
    const role = await Role_1.RoleModel.findOne({ code: roleCode })
        .select("+code")
        .lean()
        .exec();
    if (!role)
        throw new ApiError_1.InternalError("Role must be defined");
    user.roles = [role];
    user.createdAt = user.updatedAt = now;
    const createdUser = await User_1.UserModel.create(user);
    const keystore = await KeystoreRepo_1.default.create(createdUser, accessTokenKey, refreshTokenKey);
    return {
        user: { ...createdUser.toObject(), roles: user.roles },
        keystore: keystore,
    };
}
async function update(user, accessTokenKey, refreshTokenKey) {
    user.updatedAt = new Date();
    await User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
        .lean()
        .exec();
    const keystore = await KeystoreRepo_1.default.create(user, accessTokenKey, refreshTokenKey);
    return { user: user, keystore: keystore };
}
async function updateInfo(user) {
    user.updatedAt = new Date();
    return User_1.UserModel.updateOne({ _id: user._id }, { $set: { ...user } })
        .lean()
        .exec();
}
async function findOneByToken(token) {
    return await User_1.UserModel.findOne({ tokenFireBase: token });
}
exports.default = {
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
    findOneByToken,
    findAllAdmin,
};
//# sourceMappingURL=UserRepo.js.map