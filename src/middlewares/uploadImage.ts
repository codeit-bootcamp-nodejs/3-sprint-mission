import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { ERROR_MESSAGES } from "../constants/errorConstants";

const storage = multer.memoryStorage();

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(ERROR_MESSAGES.IMAGE_INVALID_ERROR));
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter,
});

export const uploadImage = upload.single("image");
