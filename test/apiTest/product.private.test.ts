import { beforeAll, describe, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import { validate } from "uuid";
import { createTestAccessToken, testUsers, createTestUsers } from "../utils/jwtTestHelper";

describe("인증이 필요한 상품 API", () => {
  let agent: any;
  let accessToken: string;
  let productId: string;

  beforeAll(async () => {
    agent = request.agent(app);
    // 테스트 유저들을 데이터베이스에 생성
    await createTestUsers();
    // 테스트용 JWT 토큰을 직접 생성
    accessToken = createTestAccessToken(testUsers.alice);
  });

  test("1. 상품 생성", async () => {
    const createProductData = {
      name: "G5 삼성 모니터",
      price: 150,
      description: "아주좋은 상품입니다",
      tags: ["삼성", "게이밍 모니터"],
    };

    const createResponse = await agent
      .post("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(createProductData);

    const { status: createStatus, body: createBody } = createResponse;
    expect(createStatus).toBe(201);
    expect(createBody).toHaveProperty("id");
    expect(validate(createBody.id)).toBe(true);
    expect(createBody.name).toBe(createProductData.name);
    expect(createBody.price).toBe(createProductData.price);
    expect(createBody.description).toBe(createProductData.description);
    expect(createBody.tags).toEqual(
      expect.arrayContaining(createProductData.tags)
    );
    expect(createBody).toHaveProperty("createdAt");
    expect(createBody).toHaveProperty("updatedAt");
    expect(createBody).toHaveProperty("userId");
    expect(validate(createBody.userId)).toBe(true);

    productId = createBody.id;
  });

  test("2. 상품 수정", async () => {
    const updateProductData = {
      name: "게이밍 LG 모니터",
      price: 300,
      description: "업데이트된 아주좋은 상품입니다",
      tags: ["LG", "게이밍 모니터"],
    };

    const updateResponse = await agent
      .patch(`/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updateProductData);

    const { status: updateStatus, body: updateBody } = updateResponse;
    expect(updateStatus).toBe(200);
    expect(updateBody).toHaveProperty("id");
    expect(updateBody.id).toBe(productId);
    expect(validate(updateBody.id)).toBe(true);
    expect(updateBody.name).toBe(updateProductData.name);
    expect(updateBody.price).toBe(updateProductData.price);
    expect(updateBody.description).toBe(updateProductData.description);
    expect(updateBody.tags).toEqual(
      expect.arrayContaining(updateProductData.tags)
    );
    expect(updateBody).toHaveProperty("createdAt");
    expect(updateBody).toHaveProperty("userId");
    expect(validate(updateBody.userId)).toBe(true);
  });

  test("3. 상품 생성 토큰 없을시 오류", async () => {
    const productData = {
      name: "G5 삼성 모니터",
      price: 150,
      description: "아주좋은 상품입니다",
      tags: ["삼성", "게이밍 모니터"],
    };
    const response = await agent.post("/products").send(productData);

    const { status } = response;
    expect(status).toBe(401);
    expect(response.body.message).toBe("로그인한 유저만 가능합니다");
  });

  test("4. 상품 좋아요 및 좋아요 취소", async () => {
    const newProductData = {
      name: "테스트 좋아요 상품",
      price: 100,
      description: "좋아요 테스트용 상품입니다",
      tags: ["테스트", "좋아요"],
    };

    const createResponse = await agent
      .post("/products")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(newProductData);

    expect(createResponse.status).toBe(201);
    const testProductId = createResponse.body.id;

    const productLikeResponse = await agent
      .post(`/products/${testProductId}/like`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(productLikeResponse.status).toBe(204);

    const productUnlikeResponse = await agent
      .delete(`/products/${testProductId}/like`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(productUnlikeResponse.status).toBe(204);
  });

  test("5. 좋아요 상품만 조회하기", async () => {
    const likedProductsResponse = await agent
      .get("/users/me/liked-products") 
      .set("Authorization", `Bearer ${accessToken}`);

    expect(likedProductsResponse.status).toBe(200);
    expect(Array.isArray(likedProductsResponse.body)).toBe(true);
    expect(likedProductsResponse.body.length).toBeGreaterThanOrEqual(0);
  });

  test("6. 내가 등록한 상품만 조회하기", async () => {
    const myProductsResponse = await agent
      .get("/users/me/products") // 올바른 경로 사용
      .set("Authorization", `Bearer ${accessToken}`);

    expect(myProductsResponse.status).toBe(200);
    expect(myProductsResponse.body.products.length).toBeGreaterThanOrEqual(0);
  });

  test("7. 상품 삭제", async () => {
    const deleteResponse = await agent
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${accessToken}`);

    expect(deleteResponse.status).toBe(204);

    const getResponse = await agent.get(`/products/${productId}`);
    expect(getResponse.status).toBe(404);
  });
});
