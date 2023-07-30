import cloudinary from 'cloudinary';
import { Request, Response } from 'express';
import fs from 'fs'

cloudinary.v2.config({
    cloud_name: 'dnc07cnyn',
    api_key: '337548121389118',
    api_secret: 'Nq6k1xQxgpOZK42k6aIy6_zgEt0',
});

export const UploadController = {
    upload: async (req: Request, res: Response) => {
        try {
            const { file } = req as any;

            const { path } = file;

            const result = await new Promise<any>((resolve, reject) => {
                cloudinary.v2.uploader.upload(
                    path,
                    { upload_preset: 'ml_default' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
            });
            fs.unlinkSync(path);

            res.json({ public_id: result.public_id, url: result.secure_url });
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: 'Failed to upload image' });
        }
    },
}