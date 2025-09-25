import multer from "multer";
import path from "path";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

// 확장자
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

// 최대 용량
const MAX_FILE_SIZE = 1 * 1024 * 1024;

// S3 클라이언트
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// S3 스토리지
const storage = multerS3({
  s3,
  bucket: process.env.AWS_S3_BUCKET!,
  acl: "public-read",
  key: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const unique = Date.now();
    cb(null, `${base}-${unique}${ext}`);
  },
});

/**
 * Multer 파일 업로드 미들웨어 설정
 *
 * - 파일을 S3 버킷에 업로드합니다.
 * - 파일명은 `{원본명}-{타임스탬프}.{확장자}` 형식으로 저장됩니다.
 * - 1MB 이하의 이미지 파일(`jpg`, `png`, `gif`, `webp`)만 허용됩니다.
 */
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new multer.MulterError(
          "LIMIT_UNEXPECTED_FILE",
          "허용되지 않는 파일 형식입니다."
        )
      );
    }
    cb(null, true);
  },
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
