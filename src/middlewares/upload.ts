import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 확장자
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// 최대 용량
const MAX_FILE_SIZE = 1 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const unique = Date.now();
    cb(null, `${base}-${unique}${ext}`);
  },
})

/**
 * Multer 파일 업로드 미들웨어 설정
 *
 * - 서버의 `/uploads` 디렉토리에 파일을 저장합니다.
 * - 파일명은 `{원본명}-{타임스탬프}.{확장자}` 형식으로 저장됩니다.
 * - 1MB 이하의 이미지 파일(`jpg`, `png`, `gif`, `webp`)만 허용됩니다.
 *
 * @type {import('multer').Multer}
 */
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', '허용되지 않는 파일 형식입니다.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
})