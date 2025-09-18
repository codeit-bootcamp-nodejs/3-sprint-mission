import request from 'supertest';
import { app } from '../../src/app';
import crypto from 'crypto';

export const api = () => request(app);
export const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

export const signupAndLogin = async (opts?: {
  email?: string;
  password?: string;
  nickname?: string;
}) => {
  const unique = crypto.randomUUID().slice(0, 8);
  const email = opts?.email ?? `u${unique}@test.com`;
  const password = opts?.password ?? 'password1!';
  const nickname = opts?.nickname ?? `n${unique}`;

  await api()
    .post('/auth/signup')
    .send({ email, password, nickname })
    .expect(201);

  const { body } = await api()
    .post('/auth/login')
    .send({ email, password })
    .expect(200);

  return {
    accessToken: body.accessToken as string,
    refreshToken: body.refreshToken as string,
    email,
    password,
    nickname,
  };
};
