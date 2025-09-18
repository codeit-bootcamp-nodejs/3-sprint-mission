import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'signed'),
  verify: jest.fn(),
}));

describe('[Auth] tokenUtils verify 분기', () => {
  beforeEach(() => {
    jest.resetModules();
    (jwt.verify as jest.Mock).mockReset();
    process.env.ACCESS_TOKEN_SECRET = 'a';
    process.env.REFRESH_TOKEN_SECRET = 'b';
  });

  test('만료/위조 403 (verifyAccessToken)', () => {
    jest.isolateModules(() => {
      jest.doMock('jsonwebtoken', () => ({
        sign: jest.fn(),
        verify: jest.fn(() => {
          throw new Error('invalid');
        }),
      }));
      const tokenUtils = require('../../src/auth/tokenUtils.js');
      expect(() => tokenUtils.verifyAccessToken('bad')).toThrow(
        /토큰이 만료되었거나 유효하지 않습니다./
      );
    });
  });

  test('잘못된 토큰 403 (verifyRefreshToken)', () => {
    jest.isolateModules(() => {
      jest.doMock('jsonwebtoken', () => ({
        sign: jest.fn(),
        verify: jest.fn(() => {
          throw new Error('bad refresh');
        }),
      }));
      const tokenUtils = require('../../src/auth/tokenUtils.js');
      expect(() => tokenUtils.verifyRefreshToken('bad')).toThrow(
        /Refresh token invalid/
      );
    });
  });
});
