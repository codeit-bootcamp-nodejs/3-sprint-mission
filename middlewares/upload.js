import multer from 'multer';
import path from 'path';

// 저장 위치 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 최대 5MB
  fileFilter: (req, file, cb) => {
    if (/\.(jpg|jpeg|png|gif)$/i.test(file.originalname)) cb(null, true);
    else cb(new Error('이미지 파일만 업로드 가능합니다.'));
  }
});