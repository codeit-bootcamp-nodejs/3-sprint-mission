import multer from 'multer';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

// Multer DiskStorage 설정
const storage = (subpath: string) => multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
    // 인자로 받은 subpath를 사용해 업로드 경로를 설정
    const targetUploadDir = path.resolve(process.cwd(), 'uploads', subpath);
    if (!fs.existsSync(targetUploadDir)) {
      fs.mkdirSync(targetUploadDir, { recursive: true });
    }
    cb(null, targetUploadDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, png, gif) are allowed!'));
  }
};

export const uploadImage = (subpath: string) => multer({
  storage: storage(subpath),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});