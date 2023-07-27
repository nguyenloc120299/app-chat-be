import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "Message";
export const COLLECTION_NAME = "message";

export enum Category {
  ABC = "ABC",
  XYZ = "XYZ",
}
export enum TypeSend {
  TEXT = "Text",
  IMAGE = "Image"
}

export default interface Message {
  _id: Types.ObjectId;
  content: string;
  typeSend: TypeSend;
  file: string;
  sender: Types.ObjectId,
  // messageRead: Array<Types.ObjectId>;
  room: Types.ObjectId;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<Message>(
  {
    content: {
      type: Schema.Types.String,
      required: true,
    },
    file: {
      type: Schema.Types.String,
    },
    typeSend: {
      type: Schema.Types.String,
      enum: Object.values(TypeSend)
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    room: {
      type: Schema.Types.ObjectId,
      ref: "Room"
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

export const MessageModel = model<Message>(
  DOCUMENT_NAME,
  schema,
  COLLECTION_NAME
);
