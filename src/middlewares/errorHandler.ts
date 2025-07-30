import multer from 'multer';
import type { ErrorRequestHandler } from 'express';

interface CustomError extends Error {
  status?: number;
}

/**
 * 전역 에러 핸들링 미들웨어
 *
 * 모든 예외를 캡처하여 적절한 상태 코드와 메시지로 클라이언트에 응답합니다.
 * - Multer 파일 업로드 관련 오류를 수동 처리합니다.
 * - 개발 환경에서는 stack을 응답에 포함합니다.
 *
 * @param {Error} err - 처리할 에러 객체
 * @param {import('express').Request} req - Express 요청 객체
 * @param {import('express').Response} res - Express 응답 객체
 * @param {import('express').NextFunction} next - 다음 미들웨어 함수
 */
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const customErr = err as CustomError;

  console.error('[ERROR]', err);

  // multer 에러
  if (err instanceof multer.MulterError) {
    let message = '파일 업로드 오류';
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = '파일 크기는 1MB를 초과할 수 없습니다.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = '허용되지 않는 파일 형식입니다.';
    }

    return res.status(400).json({ message });
  }

  // 일반 에러
  res.status(customErr.status || 500).json({
    message: customErr.message || '서버 오류',
    ...(process.env.NODE_ENV === 'development' && { stack: customErr.stack }),
  });
};