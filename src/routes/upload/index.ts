import express from "express";
import { UploadController } from "../../controllers/upload.controller";

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post("/file", upload.single('file'), UploadController.upload);

export default router;
