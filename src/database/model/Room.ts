import { Schema, model, Types } from "mongoose";
import MESSAGE from "./Message";
import User from "./User";

export const DOCUMENT_NAME = "Room";
export const COLLECTION_NAME = "room";

export enum Category {
  ABC = "ABC",
  XYZ = "XYZ",
}
export interface USER_READMESS {
  user: Types.ObjectId;
  total: number;
}
export interface LAST_MESSAGE {
  content: string;
  sender: User;
  createdAt: Date;
}
export default interface ROOM {
  _id: Types.ObjectId;
  nameRoom: string;
  avatarRoom?: string;
  members?: Array<Types.ObjectId>;
  // messages?: Array<Types.ObjectId>;
  unReadMessage?: USER_READMESS[];
  lastMessage?: LAST_MESSAGE;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<ROOM>(
  {
    nameRoom: {
      type: Schema.Types.String,
      required: true,
    },
    avatarRoom: {
      type: Schema.Types.String,
      default: "",
    },
    members: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    unReadMessage: {
      type: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
          total: {
            type: Number,
            default: 0,
          },
        },
      ],
    },

    // messages: {
    //   type: [Schema.Types.ObjectId],
    //   ref: "Message",
    // },
    status: {
      type: Schema.Types.Boolean,
      default: true,
    },
    lastMessage: {
      type: Object,
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

export const RoomModel = model<ROOM>(DOCUMENT_NAME, schema, COLLECTION_NAME);
