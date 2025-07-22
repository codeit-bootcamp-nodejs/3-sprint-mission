import { PrismaClient } from '@prisma/client';
import { assert, create } from 'superstruct';
import { Article } from '../structs.js'
const prisma = new PrismaClient();

export const getArticleList = async (req, res, next) => {
  try {
    const { page = 1, pageSize = 10, keyword = '' } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const where = {
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } }
      ]
    };

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        select: {
          id: true,
          title: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.article.count({ where })
    ]);

    res.status(200).json({
      page: Number(page),
      pageSize: Number(pageSize),
      total,
      articles
    });
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

export const getArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true
      }
    });

    if (!article) {
      return res.status(404).json({ error: '해당 게시글을 찾을 수 없습니다.' });
    }

    res.status(200).json(article);
  } catch (error) {
    next(error); // 에러 핸들러로 전달
  }
};

export const postArticle = async (req, res, next) => {
  try {
    assert(req.body, Article);

    const { title, content = [] } = req.body;

    const article = await prisma.article.create({
      data: {
        title,
        content
        }
    });

    res.status(201).json(article);
  } catch (error) {
    if (error?.name === 'StructError') {
      return res.status(400).json({ error: '해당 게시글을 등록할 수 없습니다.' });
    }
    next(error);
  }
}

export const patchArticle = async (req, res, next) => {
  try {
    assert(req.body, Article);

    const { id } = req.params;
    const { title, content = [] } = req.body;

    const article = await prisma.article.update({
      where: {
        id: id
      },
      data: {
        title,
        content
      }
    });

    res.status(200).json(article);
  } catch (error) {
    if (error?.title === 'StructError') {
      return res.status(400).json({ error: '해당 게시글을 등록할 수 없습니다.' });
    }
    next(error);
  }
}

export const deleteArticle = async (req, res, next) => {
  try {

    const { id } = req.params;

    const article = await prisma.article.delete({
      where: {
        id: id
      }
    });

    res.status(204).json(article);
  } catch (error) {
    if (error?.title === 'StructError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
}