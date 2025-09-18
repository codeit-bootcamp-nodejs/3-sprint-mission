import { api, signupAndLogin, bearer } from '../helpers/http';
import crypto from 'crypto';

describe('[Auth] 통합', () => {
  test('회원가입 201, 로그인 200 (토큰 발급)', async () => {
    const suffix = crypto.randomUUID().slice(0, 8);
    const email = `u${Date.now()}-${suffix}@test.com`;
    const password = 'qlalf1!';
    const nickname = `n${Date.now()}-${suffix}`;

    await api()
      .post('/auth/signup')
      .send({ email, password, nickname })
      .expect(201);

    const login = await api()
      .post('/auth/login')
      .send({ email, password })
      .expect(200);
    expect(login.body.accessToken).toBeDefined();
    expect(login.body.refreshToken).toBeDefined();
  });

  test('토큰 재발급 200 (RefreshToken)', async () => {
    const { refreshToken } = await signupAndLogin();
    const res = await api()
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  test('토큰 재발급 실패 401 (RefreshToken 누락)', async () => {
    const res = await api().post('/auth/refresh').send({}).expect(401);
    expect(res.body.message).toMatch(/RefreshToken이 필요/);
  });

  test('로그아웃 200 (인증 필요)', async () => {
    const { accessToken } = await signupAndLogin();
    await api().post('/auth/logout').set(bearer(accessToken)).expect(200);
  });

  test('로그인 실패 401 (잘못된 비밀번호)', async () => {
    const suffix = crypto.randomUUID().slice(0, 8);
    const email = `u${Date.now()}-${suffix}@test.com`;
    const nickname = `nick-${suffix}`;

    await api()
      .post('/auth/signup')
      .send({ email, password: 'password1!', nickname })
      .expect(201);

    const res = await api()
      .post('/auth/login')
      .send({ email, password: 'wrongpassword' })
      .expect(401);

    expect(res.body.message).toMatch(/이메일 또는 비밀번호/);
  });
});
