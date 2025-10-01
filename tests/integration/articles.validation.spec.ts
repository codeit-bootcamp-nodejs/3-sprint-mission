import { api, signupAndLogin, bearer } from '../helpers/http';

describe('[Articles] Validator 실패 케이스', () => {
  test('생성 400 (제목/내용 없음)', async () => {
    const { accessToken } = await signupAndLogin();
    const res = await api()
      .post('/articles')
      .set(bearer(accessToken))
      .send({ title: '', content: '' })
      .expect(400);
    expect(res.body.message).toMatch(/게시글 유효성 검사 실패/);
  });

  test('수정 400 (body 없음)', async () => {
    const { accessToken } = await signupAndLogin();
    const created = await api()
      .post('/articles')
      .set(bearer(accessToken))
      .send({ title: '제목', content: '내용' })
      .expect(201);

    const res = await api()
      .patch(`/articles/${created.body.id}`)
      .set(bearer(accessToken))
      .send({})
      .expect(400);
    expect(res.body.message).toMatch(/수정할 내용을 최소 1개/);
  });

  test('수정 400 (제목 없음)', async () => {
    const { accessToken } = await signupAndLogin();
    const created = await api()
      .post('/articles')
      .set(bearer(accessToken))
      .send({ title: '제목', content: '내용' })
      .expect(201);

    const res = await api()
      .patch(`/articles/${created.body.id}`)
      .set(bearer(accessToken))
      .send({ title: '' })
      .expect(400);
    expect(res.body.message).toMatch(/게시글 유효성 검사 실패/);
  });
});
