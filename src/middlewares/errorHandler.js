import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const errorHandler = (err, req, res, next) => {
  console.error("전역 에러 발생:", err);

  let statusCode = 500;
  let message = '서버 내부 오류가 발생했습니다.';
  let details = undefined;

  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        statusCode = 409;
        message = err.message || '요청하신 데이터가 이미 존재합니다.';
        if (err.meta && Array.isArray(err.meta.target)) {
          details = `중복된 필드: ${err.meta.target.join(', ')}`;
        }
        break;

      case 'P2025':
        statusCode = 404;
        message = err.message || err.meta?.cause || '요청한 데이터를 찾을 수 없습니다.';
        break;

      default:
        statusCode = 500;
        message = err.message || '데이터베이스 관련 오류가 발생했습니다.';
    }
  } else if (err.message === '유효성 검사 오류' && Array.isArray(err.details)) {
    statusCode = 400;
    message = err.message;
    details = err.details;
  } else {
    statusCode = err.statusCode || 500;
    message = err.message || '서버 내부 오류가 발생했습니다.';
  }

  res.status(statusCode).json({
    message: message,
    ...(details && { details: details }),
  });
};

export default errorHandler;