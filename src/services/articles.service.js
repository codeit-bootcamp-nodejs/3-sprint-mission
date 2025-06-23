// src/services/articles.service.js (파일 전체, 기존 코드 포함)

import { PrismaClient } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { getPaginationParams, getSearchParams, getSortParams } from '../utils/queryHelpers.js';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export const findAllArticles = async ({ offset, limit, sort, search }) => {
  try {
    const { skip, take } = getPaginationParams({ offset, limit });
    const orderBy = getSortParams({ sort }, 'createdAt');
    const where = getSearchParams(search, ['title', 'content']);

    const articles = await prisma.articles.findMany({
      skip,
      take,
      orderBy,
      where,
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    return articles;
  } catch (error) {
    console.error("Error in findAllarticles service:", error);
    throw error;
  }
};

export const createArticle = async ({ title, content, usersId, imageUrl }) => {
  try {
    const newarticle = await prisma.articles.create({
      data: {
        title,
        content,
        imageUrl,
        user: {
          connect: {
            id: usersId,
          },
        },
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    return newarticle;
  } catch (error) {
      console.error("Error in createarticle service:", error);
      throw error;
  }
};

export const findArticleById = async (articleId) => {
  try {
    const article = await prisma.articles.findUnique({
      where: {
        id: articleId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        article_comments: {
          select: {
            id: true,
            content: true,
            createdAt: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });

    if (!article) {
      throw new PrismaClientKnownRequestError('게시글을 찾을 수 없습니다.', {
        code: 'P2025',
        meta: { modelName: 'article', cause: 'record not found' },
      });
    }

    return article;
  } catch (error) {
    console.error("Error in findarticleById service:", error);
    throw error;
  }
};

export const updateArticle = async (articleId, updateData) => {
  try {
    const updatedarticle = await prisma.articles.update({
      where: {
        id: articleId,
      },
      data: updateData,
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });
    return updatedarticle;
  } catch (error) {
      console.error("Error in updatearticle service:", error);
      throw error;
  }
};

export const deleteArticle = async (articleId) => {
  try {
    const deletedarticle = await prisma.articles.delete({
      where: {
        id: articleId
      }
    });
    return deletedarticle;
  } catch (error) {
      console.error("Error in deletearticle service:", error);
      throw error;
  }
};