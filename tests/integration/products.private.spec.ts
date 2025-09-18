import { api, signupAndLogin, bearer } from "../helpers/http";

describe("[Products] 인증 필요", () => {
  let token: string;

  beforeEach(async () => {
    token = (await signupAndLogin()).accessToken;
  });

  test("생성 201/400 (유효성 실패)", async () => {
    const ok = await api()
      .post("/products")
      .set(bearer(token))
      .send({ name: "상품", description: "설명", price: 1234 })
      .expect(201);
    expect(ok.body.id).toBeDefined();

    const bad = await api()
      .post("/products")
      .set(bearer(token))
      .send({ name: "", description: "", price: "abc" })
      .expect(400);
    expect(bad.body.message).toMatch(/상품 등록 유효성 검사 실패/);
  });

  test("수정 200/403 (권한 없음), 삭제 204", async () => {
    const me = await signupAndLogin(); // 다른 사용자
    const myProduct = await api()
      .post("/products")
      .set(bearer(me.accessToken))
      .send({ name: "상품수정", description: "될까요", price: 100 })
      .expect(201);

    await api()
      .patch(`/products/${myProduct.body.id}`)
      .set(bearer(me.accessToken))
      .send({ name: "mine-up" })
      .expect(200);

    const other = await api()
      .post("/products")
      .set(bearer(token))
      .send({ name: "상품2", description: "설명2", price: 200 })
      .expect(201);

    const forbidden = await api()
      .patch(`/products/${other.body.id}`)
      .set(bearer(me.accessToken))
      .send({ name: "이건안될건데" })
      .expect(403);
    expect(forbidden.body.message).toMatch(/수정 권한|권한이 없/);

    await api()
      .delete(`/products/${myProduct.body.id}`)
      .set(bearer(me.accessToken))
      .expect(204);
  });

  test("댓글 생성 201, 댓글 조회 200, 좋아요 on/off 201/200", async () => {
    const created = await api()
      .post("/products")
      .set(bearer(token))
      .send({ name: "상품3", description: "내용3", price: 10 })
      .expect(201);

    await api()
      .post(`/products/${created.body.id}/comments`)
      .set(bearer(token))
      .send({ content: "댓글" })
      .expect(201);

    const comments = await api()
      .get(`/products/${created.body.id}/comments`)
      .expect(200);
    expect(Array.isArray(comments.body)).toBe(true);

    await api()
      .post(`/products/${created.body.id}/like`)
      .set(bearer(token))
      .expect(201);
    await api()
      .delete(`/products/${created.body.id}/like`)
      .set(bearer(token))
      .expect(200);
  });
});
