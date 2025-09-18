import express from 'express';
import request from 'supertest';

jest.mock('../../src/auth/tokenUtils.js', () => ({
  verifyAccessToken: jest.fn(),
}));

import { authMiddleware } from '../../src/auth/authMiddleware.js';
import { errorHandler } from '../../src/middlewares/errorHandler.js';
import { verifyAccessToken } from '../../src/auth/tokenUtils.js';

describe('[Middleware] authorize', () => {
  const makeApp = () => {
    const app = express();
    app.use(express.json());
    app.get('/private', authMiddleware, (_req, res) => res.json({ ok: true }));
    app.use(errorHandler);
    return app;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('접근 401 (토큰 누락)', async () => {
    const app = makeApp();
    const r = await request(app).get('/private');
    expect(r.status).toBe(401);
    expect(typeof r.body.message).toBe('string');
    expect(r.body.message).toMatch(/로그인이 필요/);
  });

  test('접근 403 (토큰 위조/만료)', async () => {
    (verifyAccessToken as jest.Mock).mockImplementation(() => {
      const { CustomError } = require('../../src/utils/CustomError.js');
      throw new CustomError('토큰이 만료되었거나 유효하지 않습니다.', 403);
    });
    const app = makeApp();
    const r = await request(app)
      .get('/private')
      .set('Authorization', 'Bearer faketoken');
    expect(r.status).toBe(403);
    expect(typeof r.body.message).toBe('string');
    expect(r.body.message).toMatch(/유효하지/);
  });

  test('접근 403 (id 비정상)', async () => {
    (verifyAccessToken as jest.Mock).mockReturnValue({ id: 0 });
    const app = makeApp();
    const r = await request(app)
      .get('/private')
      .set('Authorization', 'Bearer valid');
    expect(r.status).toBe(403);
    expect(typeof r.body.message).toBe('string');
    expect(r.body.message).toMatch(/유효하지/);
  });
});
