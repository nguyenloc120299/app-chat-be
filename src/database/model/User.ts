import { model, Schema, Types } from "mongoose";
import Role from "./Role";

export const DOCUMENT_NAME = "User";
export const COLLECTION_NAME = "users";

export default interface User {
  _id: Types.ObjectId;
  name?: string;
  profilePicUrl?: string;
  phone?: string;
  password?: string;
  roles: Role[];
  tokenFireBase?: string;
  chatTeleId?: number;
  verified?: boolean;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  linkFaceBook?: string;
  linkTelegram?: string;
}

const schema = new Schema<User>(
  {
    name: {
      type: Schema.Types.String,
      trim: true,
      maxlength: 200,
    },

    profilePicUrl: {
      type: Schema.Types.String,
      trim: true,
    },
    tokenFireBase: {
      type: Schema.Types.String,
    },
    chatTeleId: {
      type: Schema.Types.Number,
    },
    phone: {
      type: Schema.Types.String,
      unique: true,
      //sparse: true, // allows null
      required: true,
      trim: true,
      select: true,
    },
    password: {
      type: Schema.Types.String,
      select: false,
    },
    linkFaceBook: {
      type: Schema.Types.String,
      select: true,
    },
    linkTelegram: {
      type: Schema.Types.String,
      select: true,
    },
    roles: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Role",
        },
      ],
      required: true,
      select: false,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: true,
    },
    updatedAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  }
);

schema.index({ _id: 1, status: 1 });
schema.index({ phone: 1 });
schema.index({ status: 1 });

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
