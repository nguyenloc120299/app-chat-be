import { Schema, model, Types } from "mongoose";
import User from "./User";

export const DOCUMENT_NAME = "Room";
export const COLLECTION_NAME = "room";

export enum Category {
  ABC = "ABC",
  XYZ = "XYZ",
}

export default interface Sample {
  _id: Types.ObjectId;
  nameRoom: string;
  members: Array<Types.ObjectId>;
  messages: Array<Types.ObjectId>
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Sample>(
  {
    nameRoom: {
      type: Schema.Types.String,
      required: true,
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    messages: {
      type: [Schema.Types.ObjectId],
      ref: "Message",
    },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    createdAt: {
      type: Schema.Types.Date,
      required: true,
      select: false,
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

export const SampleModel = model<Sample>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
