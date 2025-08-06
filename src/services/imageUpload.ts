import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response } from 'express';

const storage = multer.diskStorage({ //dest와 다르게 storage옵션은 폴더를 자동 생성하지 않음

  destination: function (req, file, cb) { 
    // 폴더가 없으면 폴더를 생성
    const uploadPath = 'uploads/';

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }

    cb(null, uploadPath)
  },

  filename: function (req, file, cb) { // 변경된 이름에 만든 날짜와 확장자까지 처리
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + Date.now() + ext);
  }
})

//파일 확장자 필터 정의
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  // 허용되는 파일 확장자
  const allowedFileTypes = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();

  // 파일의 확장자와 허용된 확장자를 비교
  if (allowedFileTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type')); // 유효하지 않은 파일 형식
  }
};

const upload = multer({  // 사이즈 제한 포함 - 유효성 검사
    storage,
    limits : {fileSize : 5* 1024 * 1024},
    fileFilter,
 }) 

//const upload = multer({ dest: 'uploads/' }) 


function uploadImage(req: Request, res: Response) { // 유효성 검사 실패하면 처리하는 로직?
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'File not provided or invalid file type' });
    }

    console.log(file)
    res.json({ message: 'Finish Upload', path : `/images/${file.filename}` })

}

export {upload, uploadImage};