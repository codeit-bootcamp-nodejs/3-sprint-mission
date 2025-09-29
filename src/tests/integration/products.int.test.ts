import request from 'supertest';
import app from '../../main';
import { prismaClient } from '../../lib/prismaClient';
import server from '../../main';

afterAll(async () => {
  await prismaClient.$disconnect()
  server.close()
})

describe('Products API (Integration)', () => {
  // 인증 필요 없는 API
  describe('GET /products', () => {
    test('상품 목록을 반환한다.', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.list)).toBe(true);
    });
  });

  // 인증 필요한 API
  describe('POST /products', () => {
    test('인증 없이는 상품 등록이 실패한다', async () => {
      const res = await request(app)
        .post('/products')
        .send({ name: '노트북', description: '삼성 갤럭시', price: 500, tags: ['전자제품'], images: ['example.jpg'] });
      expect(res.status).toBe(401);
    });

    test('인증 후 상품을 등록할 수 있다.', async () => {
      //로그인해서 토큰 등록받기
      const loginRes = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(loginRes.status).toBe(200);

      const cookies = loginRes.headers['set-cookie'];

      const res = await request(app)
        .post('/products')
        .set('Cookie', cookies)
        .send({ name: '노트북', description: '삼성 갤럭시', price: 500, tags: ['전자제품'], images: ['example.jpg'] });

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.name).toBe('노트북')
    });
  });
});

describe('Articles API (Integration)', () => {
  // 인증 필요 없는 API
  describe('GET /articles', () => {
    test('상품 목록을 반환한다.', async () => {
      const res = await request(app).get('/articles');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.list)).toBe(true);
    });
  });

  // 인증 필요한 API
  describe('POST /articles', () => {
    test('인증 없이는 게시글 등록이 실패한다', async () => {
      const res = await request(app)
        .post('/articles')
        .send({ title: '제목', content: '내용' });
      expect(res.status).toBe(401);
    });

    test('인증 후 게시글을 등록할 수 있다.', async () => {
      //로그인해서 토큰 등록받기
      const loginRes = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(loginRes.status).toBe(200);

      const cookies = loginRes.headers['set-cookie'];

      const res = await request(app)
        .post('/articles')
        .set('Cookie', cookies)
        .send({ title: '제목', content: '내용', image: 'example.jpg' });

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id')
      expect(res.body.title).toBe('제목')
    });
  });

  describe('회원가입 API', () => {
    test('정상적으로 회원가입이 되면 201을 반환한다', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'test3@example.com', password: 'password2', image: 'example.jpg', nickname: '테스트2' })

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('id')
    })
  })
});
