import multer from 'multer';
import { errorHandler } from '../../src/middlewares/errorHandler.js';

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('[Middleware] errorHandler', () => {
  test('처리 400 (파일 크기 초과)', () => {
    const err = new (multer as any).MulterError('LIMIT_FILE_SIZE');
    const req: any = {};
    const res = mockRes();
    const next = jest.fn();

    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toMatch(/파일 크기는 1MB/);
  });

  test('처리 400 (허용되지 않는 파일)', () => {
    const err = new (multer as any).MulterError('LIMIT_UNEXPECTED_FILE');
    const req: any = {};
    const res = mockRes();
    const next = jest.fn();

    errorHandler(err, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].message).toMatch(/허용되지 않는 파일/);
  });
});
