import cloudinary from "cloudinary";
import { Request, Response } from "express";
import fs from "fs";
import File, { TYPEFILE } from "../database/model/File";
import FileRepo from "../database/repository/FileRepo";

cloudinary.v2.config({
  cloud_name: "dqqzhk0pd",
  api_key: "169568384122127",
  api_secret: "jS_bj0t2gG6fJ-ICiL2CV0VdpUM",
});

export const UploadController = {
  upload: async (req: Request, res: Response) => {
    try {
      const { file } = req as any;

      const type = req.query.type || TYPEFILE.ORDER as string

      const { path } = file;

      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.v2.uploader.upload(
          path,
          { upload_preset: "kyu77xbt", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });
      fs.unlinkSync(path);
      await FileRepo.create({
        public_id: result.public_id,
        url: result.secure_url,
        type
      } as File);
      res.json({ public_id: result.public_id, url: result.secure_url });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: "Failed to upload image" });
    }
  },
};
