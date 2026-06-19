import multer from 'multer';
import { AppError } from './errorHandler';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const allowedDocMimes = [...allowedImageMimes, 'application/pdf'];

const memoryStorage = multer.memoryStorage();

function createFileFilter(allowedMimes: string[]) {
  return (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!allowedMimes.includes(file.mimetype)) {
      cb(new AppError(`File type ${file.mimetype} not allowed`, 400));
    } else {
      cb(null, true);
    }
  };
}

export const uploadImage = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: createFileFilter(allowedImageMimes),
});

export const uploadDocument = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: createFileFilter(allowedDocMimes),
});

export const uploadMultipleImages = multer({
  storage: memoryStorage,
  limits: { fileSize: MAX_FILE_SIZE, files: 10 },
  fileFilter: createFileFilter(allowedImageMimes),
});
