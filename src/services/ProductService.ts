import { Prisma, PrismaClient } from '@prisma/client';
import { assert, create } from 'superstruct';
import { Product } from '../structs'
import { RequestHandler } from 'express';
import { errorHandler } from '../handler/errorHandler';
import { Page } from '../dto/page.dto';
const prisma = new PrismaClient();

const getProductList = async (data: Page) => {
  try {
    const { page = 1, pageSize = 10, keyword = '' } = data;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where = {
      OR: [
        { name: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: keyword, mode: Prisma.QueryMode.insensitive } }
      ]
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true
        },
        skip,
        take
      }),
      prisma.product.count({ where })
    ]);
    return { products, total }
  } catch (error) {
    errorHandler
  }
};

const getProductListByUserId = async (userId: number) => {
  try {
    const page = 1
    const pageSize = 10
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const where = {
      userId: userId
    };
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { userId: userId },
        select: {
          id: true,
          name: true,
          price: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.product.count({ where })
    ]);
    return { products, total }
  } catch (error) {
    errorHandler
  }
};

const getProduct: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: {
          select: { tag: true } // 만약 태그 포함 조회 원할 경우
        },
        createdAt: true,
        userId: true,
      }
    });

    if (!product) {
      return res.status(404).json({ error: '해당 상품을 찾을 수 없습니다.' });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

const postProduct: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, Product);

    const { name, description, price, tags, quantity } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags: {
          connectOrCreate: tags?.map(tag => ({
            where: { tag: tag },
            create: { tag: tag }
          })), // Tag 모델 연결 시
        },
        quantity
      },
    });

    res.status(201).json(product);
  } catch (error) {
    // if (error?.name === 'StructError') {
    //   return res.status(400).json({ error: '해당 상품을 등록할 수 없습니다.' });
    // }
    next(error);
  }
}

const patchProduct: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, Product);

    const { id } = req.params;
    const { name, description, price, tags, quantity } = req.body;

    const product = await prisma.product.update({
      where: {
        id: id
      },
      data: {
        name,
        description,
        price,
        tags: {
          connectOrCreate: tags?.map(tag => ({
            where: { tag: tag },
            create: { tag: tag }
          })), // Tag 모델 연결 시
        },
        quantity
      }
    });

    res.status(200).json(product);
  } catch (error) {
    // if (error?.name === 'StructError') {
    //   return res.status(400).json({ error: '해당 상품을 등록할 수 없습니다.' });
    // }
    next(error);
  }
}

const deleteProduct: RequestHandler = async (req, res, next) => {
  try {

    const { id } = req.params;

    const product = await prisma.product.delete({
      where: {
        id: id
      }
    });

    res.status(204).json(product);
  } catch (error) {
    // if (error?.name === 'StructError') {
    //   return res.status(400).json({ error: error.message });
    // }
    next(error);
  }
}

export default {
  getProductList,
  getProductListByUserId,
  getProduct,
  postProduct,
  patchProduct,
  deleteProduct,
}