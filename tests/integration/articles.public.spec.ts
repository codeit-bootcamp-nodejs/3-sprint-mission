import { api, signupAndLogin, bearer } from '../helpers/http';

describe('[Articles] 공개', () => {
  test('목록 200, 상세 200/404', async () => {
    const { accessToken } = await signupAndLogin();
    const created = await api()
      .post('/articles')
      .set(bearer(accessToken))
      .send({ title: '제목테스트', content: '내용테스트' })
      .expect(201);

    const list = await api().get('/articles').expect(200);
    expect(Array.isArray(list.body)).toBe(true);

    await api().get(`/articles/${created.body.id}`).expect(200);
    await api().get('/articles/999999').expect(404);
  });
});
