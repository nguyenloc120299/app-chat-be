import { Schema, model, Types } from "mongoose";

export const DOCUMENT_NAME = "File";
export const COLLECTION_NAME = "files";

export enum Category {
  ABC = "ABC",
  XYZ = "XYZ",
}

export default interface File {
  _id: Types.ObjectId;
  public_id?: string;
  url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<File>(
  {
    public_id: {
      type: Schema.Types.String,
      required: true,
    },
    url: {
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

export const FileModel = model<File>(DOCUMENT_NAME, schema, COLLECTION_NAME);
