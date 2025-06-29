
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 기본 업로드 디렉토리 (최상위 uploads 폴더)
const baseUploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Multer DiskStorage 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // req.uploadPath가 라우터에서 설정되면 해당 경로를 사용하고, 없으면 기본 경로를 사용
    const targetUploadDir = req.uploadPath || baseUploadDir;

    // 대상 업로드 디렉토리가 없으면 생성
    if (!fs.existsSync(targetUploadDir)) {
      fs.mkdirSync(targetUploadDir, { recursive: true });
    }
    cb(null, targetUploadDir); // ✨ 여기에 req.uploadPath를 사용하도록 변경
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, png, gif) are allowed!'), false);
  }
};

const uploadImage = multer({ // 이름은 uploadImage로 유지
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB 제한
  }
});

export default uploadImage;