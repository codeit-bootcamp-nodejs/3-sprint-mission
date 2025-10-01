import { api, signupAndLogin, bearer } from '../helpers/http';

describe('[Products] 공개', () => {
  test('목록 200, 상세 200/404', async () => {
    const { accessToken } = await signupAndLogin();
    const created = await api()
      .post('/products')
      .set(bearer(accessToken))
      .send({ name: '상품', description: '설명', price: 1000, tags: ['태그'] })
      .expect(201);

    const list = await api().get('/products').expect(200);
    expect(Array.isArray(list.body)).toBe(true);

    await api().get(`/products/${created.body.id}`).expect(200);
    await api().get('/products/999999').expect(404);
  });
});
