import dotenv from 'dotenv';
import { Router } from 'express';
import { uploadImage } from '../middlewares/uploadImage';
import { ERROR_MESSAGES } from '../constants/errorConstants';

dotenv.config();
const uploadImageRouter = Router();

const hostUrl = process.env.HOST_URL || 'http://localhost:3000';

uploadImageRouter.post('/', uploadImage, (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: ERROR_MESSAGES.IMAGE_UPLOAD_ERROR });
  } res.status(200).json({
    message: '🗂️ 파일 업로드 완료',
    filename: req.file.filename,
    path: `${hostUrl}/files/${req.file.filename}`,
  })
});

export default uploadImageRouter;