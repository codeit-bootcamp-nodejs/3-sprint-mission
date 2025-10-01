import * as productService from '../../src/services/productService.js';
import * as productRepo from '../../src/repositories/productRepository.js';
import * as likeRepo from '../../src/repositories/likeRepository.js';
import * as notificationService from '../../src/notifications/notificationService.js';
import { CustomError } from '../../src/utils/CustomError.js';

jest.mock('../../src/repositories/productRepository.js', () => ({
  findMany: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));
jest.mock('../../src/repositories/likeRepository.js', () => ({
  countLike: jest.fn(),
  createLike: jest.fn(),
  deleteLike: jest.fn(),
  findUserLikedProducts: jest.fn(),
  findUserLikedArticles: jest.fn(),
  findUsersByProduct: jest.fn(),
}));

describe('[productService] 유닛 (Mock + Spy)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  test('조회 400 (잘못된 ID)', async () => {
    await expect(productService.getProductById(0 as any)).rejects.toThrow(
      CustomError
    );
    try {
      await productService.getProductById(0 as any);
    } catch (e: any) {
      expect(e).toBeInstanceOf(CustomError);
      expect(e.status).toBe(400);
      expect(e.message).toMatch(/올바르지/);
    }
  });

  test('조회 404 (미존재)', async () => {
    (productRepo.findById as jest.Mock).mockResolvedValue(null);
    await expect(productService.getProductById(999)).rejects.toThrow(
      /찾을 수 없습니다/
    );
    try {
      await productService.getProductById(999);
    } catch (e: any) {
      expect(e.status).toBe(404);
    }
  });

  test('조회 200 (정상)', async () => {
    const entity = {
      id: 1,
      name: '폰',
      description: 'x',
      price: 1000,
      tags: [],
      imageUrl: null,
      createdAt: new Date(),
      userId: 10,
    };
    (productRepo.findById as jest.Mock).mockResolvedValue(entity);
    const res = await productService.getProductById(1);
    expect(res).toEqual(entity);
    expect(productRepo.findById).toHaveBeenCalledWith(1);
  });

  test('수정 403 (권한 없음)', async () => {
    (productRepo.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 10,
      price: 1000,
    });
    await expect(
      productService.updateProduct(1, 20, { name: 'x' })
    ).rejects.toThrow(/수정 권한/);
    try {
      await productService.updateProduct(1, 20, { name: 'x' });
    } catch (e: any) {
      expect(e.status).toBe(403);
    }
  });

  test('수정 200 (가격 변경 없음 → 알림 미발송)', async () => {
    (productRepo.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 1,
      price: 1000,
    });
    (productRepo.update as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 1,
      price: 1000,
    });

    const spy = jest
      .spyOn(notificationService, 'createPriceChange')
      .mockResolvedValue({} as any);

    await productService.updateProduct(1, 1, { name: 'same price' });

    expect(likeRepo.findUsersByProduct).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  test('수정 200 (가격 변경됨 → 찜 유저 알림 생성)', async () => {
    (productRepo.findById as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 1,
      price: 1000,
    });
    (productRepo.update as jest.Mock).mockResolvedValue({
      id: 1,
      userId: 1,
      price: 900,
    });
    (likeRepo.findUsersByProduct as jest.Mock).mockResolvedValue([
      { userId: 2 },
      { userId: 3 },
    ]);

    const spy = jest
      .spyOn(notificationService, 'createPriceChange')
      .mockResolvedValue({} as any);

    await productService.updateProduct(1, 1, { price: 900 });

    expect(likeRepo.findUsersByProduct).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, {
      recipientUserId: 2,
      productId: 1,
      oldPrice: 1000,
      newPrice: 900,
    });
    expect(spy).toHaveBeenNthCalledWith(2, {
      recipientUserId: 3,
      productId: 1,
      oldPrice: 1000,
      newPrice: 900,
    });
  });

  test('삭제 403 (권한 없음)', async () => {
    (productRepo.findById as jest.Mock).mockResolvedValue({ id: 1, userId: 2 });
    await expect(productService.deleteProduct(1, 1)).rejects.toThrow(
      /삭제 권한/
    );
    try {
      await productService.deleteProduct(1, 1);
    } catch (e: any) {
      expect(e.status).toBe(403);
    }
    expect(productRepo.remove).not.toHaveBeenCalled();
  });

  test('삭제 204 (정상)', async () => {
    (productRepo.findById as jest.Mock).mockResolvedValue({ id: 1, userId: 1 });
    (productRepo.remove as jest.Mock).mockResolvedValue({ id: 1 });
    await productService.deleteProduct(1, 1);
    expect(productRepo.remove).toHaveBeenCalledWith(1);
  });
});
