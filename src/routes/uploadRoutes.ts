import { Router, Request, Response } from 'express';

import { upload } from '../middlewares/upload.js';

const router = Router();

router.post('/image', upload.single('image'), (req: Request, res: Response) => {
  const file = req.file as Express.Multer.File;

  if (!file) {
    return res.status(400).json({ message: '이미지가 업로드되지 않았습니다.' });
  }

  const imagePath = `/uploads/${file.filename}`;
  res.status(201).json({ imageUrl: imagePath });
})

export default router;