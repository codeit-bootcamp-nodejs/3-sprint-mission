import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../../src/app";
import { validate } from "uuid";

describe("회원가입,로그인 테스트", () => {

  test("1. 회원가입", async () => {
    const response = await request(app).post("/users").send({
      email: "youngwook@test.com",
      nickname: "영욱",
      password: "password1234",
    });
    console.log("회원가입 응답:", response.body);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(validate(response.body.id)).toBe(true);
    expect(response.body.email).toBe("youngwook@test.com");
    expect(response.body.nickname).toBe("영욱");
    expect(response.body).not.toHaveProperty("password");
    expect(new Date(response.body.createdAt)).toBeInstanceOf(Date);
  });

  test("2. 로그인", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "youngwook@test.com",
      password: "password1234",
    });

    expect(response.status).toBe(200);
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")]));
    expect(response.body).toHaveProperty("accessToken");
  });

  test("3. 잘못된 비밀번호로 로그인 시도", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "youngwook@test.com",
      password: "wrongpassword",
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe("사용자 정보가 일치하지 않습니다.");
  });
});
