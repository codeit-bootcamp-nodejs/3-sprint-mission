import { api, signupAndLogin, bearer } from '../helpers/http';

describe('[Products] Validator 실패 케이스', () => {
  test('생성 400 (price 문자열)', async () => {
    const { accessToken } = await signupAndLogin();
    const res = await api()
      .post('/products')
      .set(bearer(accessToken))
      .send({ name: 'n', description: 'd', price: 'abc' })
      .expect(400);
    expect(res.body.message).toMatch(/상품 등록 유효성 검사 실패/);
  });

  test('생성 400 (가격 음수)', async () => {
    const { accessToken } = await signupAndLogin();
    const res = await api()
      .post('/products')
      .set(bearer(accessToken))
      .send({ name: 'n', description: 'd', price: -1 })
      .expect(400);
    expect(res.body.message).toMatch(/상품 등록 유효성 검사 실패/);
  });

  test('생성 400 (잘못된 imageUrl)', async () => {
    const { accessToken } = await signupAndLogin();
    const res = await api()
      .post('/products')
      .set(bearer(accessToken))
      .send({ name: 'n', description: 'd', price: 1, imageUrl: 'not-url' })
      .expect(400);
    expect(res.body.message).toMatch(/이미지 URL/);
  });

  test('수정 400 (body 없음)', async () => {
    const { accessToken } = await signupAndLogin();
    const created = await api()
      .post('/products')
      .set(bearer(accessToken))
      .send({ name: 'x', description: 'y', price: 10 })
      .expect(201);

    const res = await api()
      .patch(`/products/${created.body.id}`)
      .set(bearer(accessToken))
      .send({})
      .expect(400);
    expect(res.body.message).toMatch(/수정할 내용을 최소 1개/);
  });
});
