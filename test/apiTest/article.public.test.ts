import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import { validate } from "uuid";

describe("게시물 API 퍼블릭 테스트", () => {
  let firstArticleId: string;

  test("전체 게시글 조회 - GET /articles", async () => {
    const response = await request(app).get("/articles").query({
      page: 1,
      limit: 5,
    });
    expect(response.status).toBe(200);
    // 응답 구조 검증
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
    //게시글 정보 검증
    const firstArticle = response.body[0];
    expect(firstArticle).toHaveProperty("id");
    expect(firstArticle).toHaveProperty("title");
    expect(firstArticle).toHaveProperty("content");
    expect(firstArticle).toHaveProperty("userId");
    expect(validate(firstArticle.userId)).toBe(true);
    expect(firstArticle).toHaveProperty("createdAt");
    expect(new Date(firstArticle.createdAt)).toBeInstanceOf(Date);

    firstArticleId = firstArticle.id;
  });

  test("특정 게시글 조회 - GET /articles/:id", async () => {
    const response = await request(app).get(`/articles/${firstArticleId}`);
    expect(response.status).toBe(200);

    const article = response.body;
    expect(article).not.toBeNull();

    // 게시글 데이터 검증
    expect(article).toHaveProperty("id");
    expect(article).toHaveProperty("title");
    expect(article).toHaveProperty("content");
    expect(article).toHaveProperty("userId");
    expect(validate(article.userId)).toBe(true);
    expect(article).toHaveProperty("createdAt");
    expect(new Date(article.createdAt)).toBeInstanceOf(Date);
  });
});
