import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/config/prisma";

describe("인증이 필요하지 않은 상품 API", () => {
  test("전체 상품 조회 - GET /products", async () => {
    const response = await request(app).get("/products").query({
      page: 1,
      limit: 5,
      offset: 5,
    });
    expect(response.status).toBe(200);
    // 응답 구조 검증
    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("meta");
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    // 메타 정보 검증
    expect(response.body.meta).toHaveProperty("total");
    expect(response.body.meta).toHaveProperty("pages");
    expect(response.body.meta).toHaveProperty("offset");
    expect(response.body.meta).toHaveProperty("limit");
    expect(response.body.meta.total).toBeGreaterThan(0);

    // 상품 데이터 검증
    const firstProduct = response.body.data[0];
    expect(firstProduct).toHaveProperty("id");
    expect(firstProduct).toHaveProperty("name");
    expect(firstProduct).toHaveProperty("price");
    expect(firstProduct).toHaveProperty("createdAt");
  });

  test("특정 상품 조회 - GET /products/:id", async () => {
    const productList = await prisma.product.findMany();
    const productId = productList[0].id;
    const response = await request(app).get(`/products/${productId}`);
    expect(response.status).toBe(200);

    const product = response.body;
    expect(product).not.toBeNull();

    // 상품 데이터 검증
    expect(product).toHaveProperty("id");
    expect(product).toHaveProperty("name");
    expect(product).toHaveProperty("price");
    expect(product).toHaveProperty("description");
    expect(product).toHaveProperty("createdAt");
    expect(product).toHaveProperty("userId");
  });

  test("존재하지 않는 상품 조회 - GET /products/:id", async () => {
    const response = await request(app).get(
      "/products/c6738e3f-2e0b-4896-960b-ebd4d3cc5896"
    );
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("존재하지 않는 상품입니다.");
  });
});
