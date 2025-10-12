import dotenv from 'dotenv';
import { Router } from 'express';
import { uploadImage } from '../middlewares/uploadImage';
import { uploadToS3 } from '../services/s3Service';
import { ERROR_MESSAGES } from '../constants/errorConstants';

dotenv.config();
const uploadImageRouter = Router();

uploadImageRouter.post('/', uploadImage, async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: ERROR_MESSAGES.IMAGE_UPLOAD_ERROR });
  }
  try {
    const fileUrl = await uploadToS3(req.file);
    res.status(200).json({
      message: '🗂️ 파일 업로드 완료',
      name: req.file.originalname,
      path: fileUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ERROR_MESSAGES.IMAGE_UPLOAD_ERROR });
  }
});

export default uploadImageRouter;