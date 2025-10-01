import { api, signupAndLogin, bearer } from '../helpers/http';

describe('[Comments] Validator 실패 케이스', () => {
  test('상품 댓글 생성 실패 400 (빈 content)', async () => {
    const { accessToken } = await signupAndLogin();
    const product = await api()
      .post('/products')
      .set(bearer(accessToken))
      .send({ name: '이름', description: '설명', price: 1 })
      .expect(201);

    const res = await api()
      .post(`/products/${product.body.id}/comments`)
      .set(bearer(accessToken))
      .send({ content: '' })
      .expect(400);
    expect(res.body.message).toMatch(/댓글 유효성 검사 실패/);
  });

  test('게시글 댓글 생성 실패 400 (잘못된 articleId)', async () => {
    const { accessToken } = await signupAndLogin();
    const res = await api()
      .post('/articles/abc/comments')
      .set(bearer(accessToken))
      .send({ content: '안녕하세요' })
      .expect(400);
    expect(res.body.message).toMatch(/유효하지 않은 게시글 ID/);
  });
});
