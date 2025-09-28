import { beforeEach, expect, describe, jest } from '@jest/globals';
import productRepository from '../src/repositories/productRepository';
import * as productService from '../src/services/productServices';
import { Product } from '@prisma/client';
import MOCK from './testMock';
import { CreateProductDto, UpdateProductDto } from '../src/types/product';

// Mock productRepository module
jest.mock('../src/repositories/productRepository', () => ({
	create: jest.fn(), // mock
	update: jest.fn(), // mock
	delete: jest.fn(), // mock
	getById: jest.fn(), // mock
	getList: jest.fn(), // mock
	getLikedList: jest.fn(), // spyOn
	checkLikeProduct: jest.fn(), // spyOn
	likeProduct: jest.fn(), // spyOn
	unlikeProduct: jest.fn(), // spyOn
	findLikedUsersByProductId: jest.fn(), // spyOn
	getByIdWithLiked: jest.fn() // spyOn
}));

beforeEach(() => {
	jest.clearAllMocks();
	jest.restoreAllMocks();
})

describe('[Product] Unit 테스트 - Mock', () => {
	test('createProduct - create가 호출되어야 함', async () => {
		const { id, ...mockProductDTO } = MOCK.products[0]

		const mockCreatedProduct = {
			...(MOCK.products[0]),
			createdAt: new Date(),
			updatedAt: new Date()
		};

		(productRepository.create as jest.Mock<(productDTO: CreateProductDto) => Promise<Product>>).mockResolvedValue(mockCreatedProduct)
		const result = await productService.createProduct(mockProductDTO)
		expect(result).toEqual(mockCreatedProduct);
		expect(productRepository.create).toHaveBeenCalledTimes(1);
		expect(productRepository.create).toHaveBeenCalledWith(mockProductDTO);
	})

	test('updateProduct - getById와 update가 호출되어야 함', async () => {
		const { id, ...mockProductDTO } = MOCK.products[0];

		const mockUpdatedProduct = {
			...(MOCK.products[0]),
			createdAt: new Date(),
			updatedAt: new Date()
		};

		const mockOldProduct = {
			...(MOCK.products[1]),
			createdAt: new Date(),
			updatedAt: new Date()
		};

		(productRepository.update as jest.Mock<(productDTO: UpdateProductDto) => Promise<Product>>).mockResolvedValue(mockUpdatedProduct);
		(productRepository.getById as jest.Mock<(id: string) => Promise<Product>>).mockResolvedValue(mockOldProduct)
		const result = await productService.updateProduct(mockProductDTO, id);
		expect(result).toEqual(mockUpdatedProduct);
		expect(productRepository.getById).toHaveBeenCalledWith(id);
		expect(productRepository.update).toHaveBeenCalledTimes(1);
		expect(productRepository.update).toHaveBeenCalledWith(mockProductDTO, id);
	})

	test('deleteProduct - delete가 호출되어야 함', async () => {
		const { id } = MOCK.products[0];

		(productRepository.delete as jest.Mock<(id: string) => Promise<void>>).mockResolvedValue()
		await productService.deleteProduct(id)
		expect(productRepository.delete).toHaveBeenCalledTimes(1);
		expect(productRepository.delete).toHaveBeenCalledWith(id);
	})

	test('findProducts - getList가 호출되어야 함', async () => {
		const mockProducts = [
			{
				id: MOCK.products[0].id,
				createdAt: new Date(),
				name: MOCK.products[0].name,
				price: MOCK.products[0].price,
			},
			{
				id: MOCK.products[1].id,
				createdAt: new Date(),
				name: MOCK.products[1].name,
				price: MOCK.products[1].price,
			}
		]

		const searchParams = {
			page: '1',
			limit: '10',
			order: 'desc',
			keyword: 'keyword'
		};

		(productRepository.getList as jest.Mock<(page: number, limit: number, order: string, keyword: string) => Promise<{id: string, name: string, price: number, createdAt: Date}[]>>).mockResolvedValue(mockProducts)
		const result = await productService.findProducts(searchParams.page, searchParams.limit, searchParams.order, searchParams.keyword)
		expect(result).toEqual(mockProducts);
		expect(productRepository.getList).toHaveBeenCalledTimes(1);
		expect(productRepository.getList).toHaveBeenCalledWith(parseInt(searchParams.page), parseInt(searchParams.limit), searchParams.order, searchParams.keyword);
	})
})

describe('[Product] Unit 테스트 - Spy', () => {
	test('updateLikeProduct - checkLikeProduct, likeProduct가 호출되어야 함', async () => {
		const { id } = MOCK.products[0];
		const userId = MOCK.users[0].id;

		const mockProduct = {
			...(MOCK.products[0]),
			createdAt: new Date(),
			updatedAt: new Date()
		};

		const checkLikeSpy = jest.spyOn(productRepository, 'checkLikeProduct').mockResolvedValue(false);
		const likeSpy = jest.spyOn(productRepository, 'likeProduct').mockResolvedValue(mockProduct);

		const result = await productService.updateLikeProduct(id, userId);

		expect(checkLikeSpy).toHaveBeenCalledWith(id, userId);
		expect(likeSpy).toHaveBeenCalledWith(id, userId);
		expect(result).toEqual({ ...mockProduct, isLiked: true });
	})

	test('updateLikeProduct - checkLikeProduct, unlikeProduct가 호출되어야 함', async () => {
		const { id } = MOCK.products[0];
		const userId = MOCK.users[0].id;

		const mockProduct = {
			...(MOCK.products[0]),
			createdAt: new Date(),
			updatedAt: new Date()
		};

		const checkLikeSpy = jest.spyOn(productRepository, 'checkLikeProduct').mockResolvedValue(true);
		const unlikeSpy = jest.spyOn(productRepository, 'unlikeProduct').mockResolvedValue(mockProduct);

		const result = await productService.updateLikeProduct(id, userId);

		expect(checkLikeSpy).toHaveBeenCalledWith(id, userId);
		expect(unlikeSpy).toHaveBeenCalledWith(id, userId);
		expect(result).toEqual({ ...mockProduct, isLiked: false });
	})

	test('findLikedProducts - getLikedList가 호출되어야 함', async () => {
		const userId = MOCK.users[0].id;
		const mockProducts = [
			{
				id: MOCK.products[0].id,
				createdAt: new Date(),
				name: MOCK.products[0].name,
				price: MOCK.products[0].price,
			},
			{
				id: MOCK.products[1].id,
				createdAt: new Date(),
				name: MOCK.products[1].name,
				price: MOCK.products[1].price,
			}
		]

		const searchParams = {
			page: 1,
			limit: 10,
			order: 'desc',
		};

		const getLikedListSpy = jest.spyOn(productRepository, 'getLikedList').mockResolvedValue(mockProducts);
		const result = await productService.findLikedProducts(searchParams.page, searchParams.limit, searchParams.order, userId);
		expect(result).toEqual(mockProducts);
		expect(getLikedListSpy).toHaveBeenCalledTimes(1);
		expect(getLikedListSpy).toHaveBeenCalledWith(searchParams.page, searchParams.limit, searchParams.order, userId);
	})

	test('findProductById - getByIdWithLiked가 호출되어야 함', async () => {
		const { id } = MOCK.products[0];
		const userId = MOCK.users[0].id;

		const mockProduct = {
			...(MOCK.products[0]),
			likedUser: [],
			createdAt: new Date(),
			updatedAt: new Date()
		};

		const getByIdWithLikedSpy = jest.spyOn(productRepository, 'getByIdWithLiked').mockResolvedValue(mockProduct);
		const result = await productService.findProductById(id, userId);

		const { likedUser, ...productDetails } = mockProduct;
		expect(result).toEqual({ ...productDetails, isLiked: false });
		expect(getByIdWithLikedSpy).toHaveBeenCalledTimes(1);
		expect(getByIdWithLikedSpy).toHaveBeenCalledWith(id, userId);
	})
})
