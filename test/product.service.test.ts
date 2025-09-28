import { beforeAll, describe, test, expect } from "@jest/globals";
import prisma from "../src/config/prisma";
import productService from "../src/services/productService";
import productRepository from "../src/repositories/productRepository";

jest.mock("../src/repositories/productRepository");

describe("상품 서비스 테스트", () => {
  let userId: string;

  beforeAll(async () => {
    const user = await prisma.user.findMany();
    userId = user[0].id;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("상품 생성 - mock 활용", async () => {
    (productRepository.createProduct as jest.Mock).mockResolvedValue({
      name: "G5 삼성 모니터",
      description: "아주좋은 상품입니다",
      price: 150,
      tags: ["삼성", "게이밍 모니터"],
      userId,
    });
    const product = await productService.createProduct({
      name: "G5 삼성 모니터",
      price: 150,
      description: "아주좋은 상품입니다",
      tags: ["삼성", "게이밍 모니터"],
      userId,
    });
    expect(product).toEqual({
      name: "G5 삼성 모니터",
      description: "아주좋은 상품입니다",
      price: 150,
      tags: ["삼성", "게이밍 모니터"],
      userId,
    });
    expect(productRepository.createProduct).toHaveBeenCalledTimes(1);
    expect(productRepository.createProduct).toHaveBeenCalledWith({
      name: "G5 삼성 모니터",
      price: 150,
      description: "아주좋은 상품입니다",
      tags: ["삼성", "게이밍 모니터"],
      userId,
    });
  });

  test("상품 생성 - spy 활용", async () => {
    const spy = jest.spyOn(productRepository, "createProduct");

    await productService.createProduct({
      name: "G5 삼성 모니터",
      price: 150,
      description: "아주좋은 상품입니다",
      tags: ["삼성", "게이밍 모니터"],
      userId,
    });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({
      name: "G5 삼성 모니터",
      price: 150,
      description: "아주좋은 상품입니다",
      tags: ["삼성", "게이밍 모니터"],
      userId,
    });
  });

  test("상품 리스트 조회- mock 활용", async () => {
    (productRepository.getProductList as jest.Mock).mockResolvedValue({
      data: [
        {
          name: "G5 삼성 모니터",
          description: "아주좋은 상품입니다",
          price: 150,
          tags: ["삼성", "게이밍 모니터"],
          userId,
        },
        {
          name: "LG 모니터",
          description: "LG 최고",
          price: 200,
          tags: ["LG", "모니터"],
          userId,
        },
      ],
      meta: { total: 2, pages: 1, offset: 0, limit: 10 },
    });
    const products = await productService.getProductList();
    expect(products).toEqual({
      data: [
        {
          name: "G5 삼성 모니터",
          description: "아주좋은 상품입니다",
          price: 150,
          tags: ["삼성", "게이밍 모니터"],
          userId,
        },
        {
          name: "LG 모니터",
          description: "LG 최고",
          price: 200,
          tags: ["LG", "모니터"],
          userId,
        },
      ],
      meta: { total: 2, pages: 1, offset: 0, limit: 10 },
    });
    expect(productRepository.getProductList).toHaveBeenCalledTimes(1);
    expect(productRepository.getProductList).toHaveBeenCalledWith(
      0,
      10,
      "desc",
      ""
    );
  });

  test("상품 리스트 조회 - spy 활용", async () => {
    const spy = jest.spyOn(productRepository, "getProductList");
    const response = await productService.getProductList();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(0, 10, "desc", "");
  });

  test("상품 상세 조회 - mock 활용", async () => {
    (productRepository.getProduct as jest.Mock).mockResolvedValue({
      id: "test-id",
      name: "G5 삼성 모니터",
      description: "아주좋은 상품입니다",
      price: 150,
      tags: ["삼성", "게이밍 모니터"],
      userId,
    });
    const product = await productService.getProduct("test-id");
    expect(product).toEqual({
      id: "test-id",
      name: "G5 삼성 모니터",
      description: "아주좋은 상품입니다",
      price: 150,
      tags: ["삼성", "게이밍 모니터"],
      userId,
    });
    expect(productRepository.getProduct).toHaveBeenCalledTimes(1);
    expect(productRepository.getProduct).toHaveBeenCalledWith("test-id");
  });

  test("상품 상세 조회 - spy 활용", async () => {
    const spy = jest.spyOn(productRepository, "getProduct");
    await productService.getProduct("test-id");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("test-id");
  });

  test("상품 수정", async () => {
    (productRepository.getProduct as jest.Mock).mockResolvedValue({
      id: "test-id",
      name: "G5 삼성 모니터",
      description: "아주좋은 상품입니다",
      price: 150,
      tags: ["삼성", "게이밍 모니터"],
      userId,
    });
    (productRepository.patchProduct as jest.Mock).mockResolvedValue({
      id: "test-id",
      name: "LG 모니터",
      description: "LG 최고",
      price: 150,
      tags: ["LG", "모니터"],
      userId,
    });
    const product = await productService.patchProduct("test-id", {
      name: "LG 모니터",
      description: "LG 최고",
      price: 150,
      tags: ["LG", "모니터"],
    });
    expect(product).toEqual({
      id: "test-id",
      name: "LG 모니터",
      description: "LG 최고",
      price: 150,
      tags: ["LG", "모니터"],
      userId,
    });
    expect(productRepository.getProduct).toHaveBeenCalledTimes(1);
    expect(productRepository.getProduct).toHaveBeenCalledWith("test-id");
    expect(productRepository.patchProduct).toHaveBeenCalledTimes(1);
    expect(productRepository.patchProduct).toHaveBeenCalledWith("test-id", {
      name: "LG 모니터",
      description: "LG 최고",
      price: 150,
      tags: ["LG", "모니터"],
    });
  });

  test("상품 수정 - spy 활용", async () => {
    const getSpy = jest.spyOn(productRepository, "getProduct");
    const patchSpy = jest.spyOn(productRepository, "patchProduct");
    await productService.patchProduct("test-id", {
      name: "LG 모니터",
      description: "LG 최고",
      price: 150,
      tags: ["LG", "모니터"],
    });
    expect(getSpy).toHaveBeenCalledTimes(1);
    expect(getSpy).toHaveBeenCalledWith("test-id");
    expect(patchSpy).toHaveBeenCalledTimes(1);
    expect(patchSpy).toHaveBeenCalledWith("test-id", {
      name: "LG 모니터",
      description: "LG 최고",
      price: 150,
      tags: ["LG", "모니터"],
    });
  });

  test("상품 삭제 - mock 활용", async () => {
    (productRepository.deleteProduct as jest.Mock).mockResolvedValue(true);
    const result = await productService.deleteProduct("test-id");
    expect(result).toBe(true);
    expect(productRepository.deleteProduct).toHaveBeenCalledTimes(1);
    expect(productRepository.deleteProduct).toHaveBeenCalledWith("test-id");
  });

  test("상품 삭제 - spy 활용", async () => {
    const spy = jest.spyOn(productRepository, "deleteProduct");
    await productService.deleteProduct("test-id");
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith("test-id");
  });
});
