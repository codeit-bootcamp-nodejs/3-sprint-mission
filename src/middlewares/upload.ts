import multer from 'multer';
import path from 'path';
import fs from 'fs';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

// 확장자
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// 최대 용량
const MAX_FILE_SIZE = 1 * 1024 * 1024;

// local / s3 분기
const strategy = process.env.UPLOAD_STRATEGY || 'local';

let storage: multer.StorageEngine;

if (strategy === 's3') {
  const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });

  // multerS3.AUTO_CONTENT_TYPE은 런타임에는 존재하지만, 타입 정의에는 누락되어 있어 'as any'로 접근
  const AUTO_CONTENT_TYPE = (multerS3 as any).AUTO_CONTENT_TYPE;

  storage = multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET!,
    acl: 'public-read',
    contentType: AUTO_CONTENT_TYPE,
    key: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      const unique = Date.now();
      cb(null, `${base}-${unique}${ext}`);
    },
  });
} else if (strategy === 'local') {
  const uploadDir = process.env.UPLOAD_DIR || path.resolve(process.cwd(), 'uploads');
  fs.mkdirSync(uploadDir, { recursive: true });

  storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext);
      const unique = Date.now();
      cb(null, `${base}-${unique}${ext}`);
    },
  });
} else {
  throw new Error(`지원하지 않는 업로드 전략입니다: ${strategy}`);
}

/**
 * Multer 파일 업로드 미들웨어 설정
 *
 * - 전략에 따라 로컬 또는 S3에 파일을 저장합니다.
 * - 파일명은 `{원본명}-{타임스탬프}.{확장자}` 형식으로 저장됩니다.
 * - 1MB 이하의 이미지 파일(`jpg`, `png`, `gif`, `webp`)만 허용됩니다.
 *
 * @type {import('multer').Multer}
 */
export const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', '허용되지 않는 파일 형식입니다.'));
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
