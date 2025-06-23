import multer from 'multer';
import path from 'path'; // path 모듈 임포트
import fs from 'fs';    // 파일 시스템 모듈 임포트

// 업로드할 디렉토리가 없으면 생성 (uploads/articles)
const uploadDir = path.resolve(process.cwd(), 'uploads/articles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // 하위 디렉토리까지 재귀적으로 생성
}

// Multer DiskStorage 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 파일이 저장될 경로 설정
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 파일명 설정: 필드명-타임스탬프.확장자 (파일명 중복 방지)
    const extname = path.extname(file.originalname); // 원본 파일의 확장자 추출
    cb(null, `${file.fieldname}-${Date.now()}${extname}`); // 예: image-1750321037370.jpg
  }
});

// 파일 필터링 함수: 특정 이미지 파일 타입만 허용
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif']; // 허용할 MIME 타입 정의
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true); // 파일 허용
  } else {
    // 허용되지 않는 파일 타입일 경우 에러 발생
    cb(new Error('Only images (jpeg, png, gif) are allowed!'), false);
  }
};

// Multer 인스턴스 생성: 저장소, 필터, **파일 크기 제한** 포함
const uploadImage = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // ✨ 5MB로 파일 크기 제한 (바이트 단위: 1MB = 1024 * 1024 바이트)
  }
});

export default uploadImage;