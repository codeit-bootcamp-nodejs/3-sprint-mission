import { api, signupAndLogin, bearer } from '../helpers/http';

describe('[Articles] 인증 필요', () => {
  let token: string;

  beforeEach(async () => {
    token = (await signupAndLogin()).accessToken;
  });

  test('생성 201, 수정 200, 삭제 204', async () => {
    const created = await api()
      .post('/articles')
      .set(bearer(token))
      .send({ title: '제목1', content: '내용1' })
      .expect(201);

    await api()
      .patch(`/articles/${created.body.id}`)
      .set(bearer(token))
      .send({ title: '제목2' })
      .expect(200);

    await api()
      .delete(`/articles/${created.body.id}`)
      .set(bearer(token))
      .expect(204);
  });

  test('댓글 생성 201, 댓글 조회 200, 좋아요 on 201, 좋아요 off 200', async () => {
    const created = await api()
      .post('/articles')
      .set(bearer(token))
      .send({ title: '제목3', content: '내용3' })
      .expect(201);

    await api()
      .post(`/articles/${created.body.id}/comments`)
      .set(bearer(token))
      .send({ content: '댓글1' })
      .expect(201);

    const comments = await api()
      .get(`/articles/${created.body.id}/comments`)
      .expect(200);
    expect(Array.isArray(comments.body)).toBe(true);

    await api()
      .post(`/articles/${created.body.id}/likes`)
      .set(bearer(token))
      .expect(201);
    await api()
      .delete(`/articles/${created.body.id}/likes`)
      .set(bearer(token))
      .expect(200);
  });
});
