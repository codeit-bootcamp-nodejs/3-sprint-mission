import { PrismaClient } from '@prisma/client';
import { assert, create } from 'superstruct';
import { Product } from '../structs'
const prisma = new PrismaClient();

export const getProductList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, keyword = '' } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where = {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
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
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.product.count({ where })
    ]);

    res.status(200).json({
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      products
    });
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

export const getProductListByAuthorId = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, keyword = '' } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where = {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } }
      ]
    };
    const { id: authorId } = req.params;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { id: authorId },
        // select: {
        //   id: true,
        //   name: true,
        //   price: true,
        //   createdAt: true
        // },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.product.count({ where })
    ]);

    res.status(200).json({
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      products
    });
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

export const getProduct = async (req, res, next) => {
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
        createdAt: true
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

export const postProduct = async (req, res, next) => {
  try {
    assert(req.body, Product);

    const { name, description, price, tags, quantity } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        tags: {
          connectOrCreate: tags.map(tag => ({
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

export const patchProduct = async (req, res, next) => {
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
          connectOrCreate: tags.map(tag => ({
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

export const deleteProduct = async (req, res, next) => {
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