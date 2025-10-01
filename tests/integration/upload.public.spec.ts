import path from 'path';
import { api } from '../helpers/http';

describe('[Upload] 공개', () => {
  it('업로드 201 (이미지)', async () => {
    const img = path.join(process.cwd(), 'tests/fixtures/test.png');
    const res = await api()
      .post('/upload/image')
      .attach('image', img)
      .expect(201);

    expect(res.body.imageUrl).toMatch(/^\/uploads\//);
  });
});
