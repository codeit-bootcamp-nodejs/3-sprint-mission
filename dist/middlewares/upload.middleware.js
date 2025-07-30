"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// 기본 업로드 디렉토리 (최상위 uploads 폴더)
const baseUploadDir = path_1.default.resolve(process.cwd(), 'uploads');
if (!fs_1.default.existsSync(baseUploadDir)) {
    fs_1.default.mkdirSync(baseUploadDir, { recursive: true });
}
// Multer DiskStorage 설정
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const targetUploadDir = req.uploadPath || baseUploadDir;
        if (!fs_1.default.existsSync(targetUploadDir)) {
            fs_1.default.mkdirSync(targetUploadDir, { recursive: true });
        }
        cb(null, targetUploadDir);
    },
    filename: (req, file, cb) => {
        const extname = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${Date.now()}${extname}`);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Only images (jpeg, png, gif) are allowed!'), false);
    }
};
const uploadImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB 제한
    }
});
exports.default = uploadImage;
