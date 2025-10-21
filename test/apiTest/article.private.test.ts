import { beforeAll, describe, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import prisma from "../../src/config/prisma";
import { validate } from "uuid";
import { createTestAccessToken, testUsers, createTestUsers } from "../utils/jwtTestHelper";

describe("인증이 필요한 게시물 API", () => {
  let agent: any;
  let accessToken: string;
  let articleId: string;

  beforeAll(async () => {
    agent = request.agent(app);
    // 테스트 유저들을 데이터베이스에 생성  
    await createTestUsers();
    // 테스트용 JWT 토큰을 직접 생성
    accessToken = createTestAccessToken(testUsers.alice);
  });

  test("1. 게시글 생성", async () => {
    const createArticleData = {
      title: "새로운 게시글",
      content: "게시글 내용입니다.",
    };
    const response = await agent
      .post("/articles")
      .set("Authorization", `Bearer ${accessToken}`)
      .send(createArticleData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(validate(response.body.id)).toBe(true);
    expect(response.body.title).toBe(createArticleData.title);
    expect(response.body.content).toBe(createArticleData.content);
    expect(response.body).toHaveProperty("userId");
    expect(validate(response.body.userId)).toBe(true);
    expect(response.body).toHaveProperty("createdAt");
    expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);

    articleId = response.body.id;
  });

  test("2. 게시글 수정", async () => {
    const updateData = {
      title: "수정된 게시글 제목",
      content: "수정된 게시글 내용",
    };
    const response = await agent
      .patch(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", updateData.title);
    expect(response.body).toHaveProperty("content", updateData.content);
  });

  test("3. 다른 사용자가 작성한 게시글 수정 시도", async () => {
    // 다른 사용자(Bob)의 토큰 생성
    const bobAccessToken = createTestAccessToken(testUsers.bob);
    
    const updateData = {
      title: "비정상적인 수정 시도",
      content: "비정상적인 수정 시도 내용",
    };
    const response = await agent
      .patch(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${bobAccessToken}`) 
      .send(updateData);
    expect(response.status).toBe(403);
    expect(response.body.message).toBe("게시글을(를) 등록한 유저가 아닙니다");
  });

  test("4. 게시글 좋아요 및 싫어요", async () => {
    // 좋아요
    let response = await agent
      .post(`/articles/${articleId}/like`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(204);

    // 싫어요
    response = await agent
      .delete(`/articles/${articleId}/like`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(204);
  });

  test("5. 게시글 삭제", async () => {
    const response = await agent
      .delete(`/articles/${articleId}`)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(response.status).toBe(204);
  });
});
