import { api, signupAndLogin, bearer } from '../helpers/http';
import crypto from 'crypto';

describe('[Me] 인증 필요', () => {
  test('내 정보 조회 200, 수정 200, 비밀번호 변경 200, 내 상품 201/200, 좋아요 목록 200', async () => {
    const suffix1 = crypto.randomUUID().slice(0, 8);
    const suffix2 = crypto.randomUUID().slice(0, 8);

    const { accessToken } = await signupAndLogin({
      nickname: `이용자-${suffix1}`,
    });

    const me = await api().get('/me').set(bearer(accessToken)).expect(200);
    expect(me.body.id).toBeDefined();

    const meUpdate = await api()
      .patch('/me')
      .set(bearer(accessToken))
      .send({ nickname: `이용자수정-${suffix2}` })
      .expect(200);
    expect(meUpdate.body.nickname).toBe(`이용자수정-${suffix2}`);

    await api()
      .patch('/me/password')
      .set(bearer(accessToken))
      .send({ currentPassword: 'password1!', newPassword: 'newpassword2@' })
      .expect(200);

    await api()
      .post('/products')
      .set(bearer(accessToken))
      .send({ name: '상품', description: '등록', price: 1 })
      .expect(201);

    const myProducts = await api()
      .get('/me/products')
      .set(bearer(accessToken))
      .expect(200);
    expect(Array.isArray(myProducts.body)).toBe(true);

    const likedProducts = await api()
      .get('/me/likes/products')
      .set(bearer(accessToken))
      .expect(200);
    expect(Array.isArray(likedProducts.body)).toBe(true);

    const likedArticles = await api()
      .get('/me/likes/articles')
      .set(bearer(accessToken))
      .expect(200);
    expect(Array.isArray(likedArticles.body)).toBe(true);
  });
});
