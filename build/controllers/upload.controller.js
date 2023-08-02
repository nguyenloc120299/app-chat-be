"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = __importDefault(require("fs"));
const FileRepo_1 = __importDefault(require("../database/repository/FileRepo"));
cloudinary_1.default.v2.config({
    cloud_name: "dqqzhk0pd",
    api_key: "169568384122127",
    api_secret: "jS_bj0t2gG6fJ-ICiL2CV0VdpUM",
});
exports.UploadController = {
    upload: async (req, res) => {
        try {
            const { file } = req;
            const { path } = file;
            const result = await new Promise((resolve, reject) => {
                cloudinary_1.default.v2.uploader.upload(path, { upload_preset: "kyu77xbt", resource_type: "auto" }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
            });
            fs_1.default.unlinkSync(path);
            await FileRepo_1.default.create({
                public_id: result.public_id,
                url: result.secure_url,
            });
            res.json({ public_id: result.public_id, url: result.secure_url });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ error: "Failed to upload image" });
        }
    },
};
//# sourceMappingURL=upload.controller.js.map