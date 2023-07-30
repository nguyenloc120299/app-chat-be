"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const cloudinary_1 = __importDefault(require("cloudinary"));
const fs_1 = __importDefault(require("fs"));
cloudinary_1.default.v2.config({
    cloud_name: 'dnc07cnyn',
    api_key: '337548121389118',
    api_secret: 'Nq6k1xQxgpOZK42k6aIy6_zgEt0',
});
exports.UploadController = {
    upload: async (req, res) => {
        try {
            const { file } = req;
            const { path } = file;
            const result = await new Promise((resolve, reject) => {
                cloudinary_1.default.v2.uploader.upload(path, { upload_preset: 'ml_default' }, (error, result) => {
                    if (error)
                        reject(error);
                    else
                        resolve(result);
                });
            });
            fs_1.default.unlinkSync(path);
            res.json({ public_id: result.public_id, url: result.secure_url });
        }
        catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Failed to upload image' });
        }
    },
};
//# sourceMappingURL=upload.controller.js.map