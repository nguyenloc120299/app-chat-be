import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Message";
export const COLLECTION_NAME = "messages";

export enum Category {
  ABC = "ABC",
  XYZ = "XYZ",
}
export enum TypeSend {
  TEXT = "Text",
  IMAGE = "Image"
}

export default interface MESSAGE {
  _id: Types.ObjectId;
  content: string;
  typeFile?: TypeSend;
  file?: string;
  sender: Types.ObjectId,
  // messageRead: Array<Types.ObjectId>;
  room: Types.ObjectId;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<MESSAGE>(
  {
    content: {
      type: Schema.Types.String,
      required: true,
    },
    file: {
      type: Schema.Types.String,
    },
    typeFile: {
      type: Schema.Types.String,
      enum: Object.values(TypeSend),
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
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

schema.index({ code: 1, status: 1 });

export const MessageModel = model<MESSAGE>(DOCUMENT_NAME, schema, COLLECTION_NAME);
