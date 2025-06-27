import express from 'express';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: '이미지가 업로드되지 않았습니다.' });
  }

  const imagePath = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl: imagePath });
})

export default router;