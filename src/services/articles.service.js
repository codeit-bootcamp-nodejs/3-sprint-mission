
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import {
  getPaginationParams,
  getSearchParams,
  getSortParams,
  prisma,
  checkArticleOwnership
} from '../utils/queryHelpers.js';

export const findAllArticles = async ({ offset, limit, sort, search }) => {
  try {
    const { skip, take } = getPaginationParams({ offset, limit });
    const orderBy = getSortParams({ sort }, 'createdAt');
    const where = getSearchParams(search, ['title', 'content']);

    const articles = await prisma.article.findMany({
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
    console.error("Error in findAllArticles service:", error);
    throw error;
  }
};

export const createArticle = async ({ title, content, userId, imageUrl }) => {
  try {
    const newArticle = await prisma.article.create({
      data: {
        title,
        content,
        imageUrl,
        user: {
          connect: {
            id: userId,
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
    return newArticle;
  } catch (error) {
      console.error("Error in createArticle service:", error);
      throw error;
  }
};

export const findArticleById = async (articleId) => {
  try {
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
        articleComments: {
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
        meta: { modelName: 'Article', cause: 'record not found' },
      });
    }

    return article;
  } catch (error) {
    console.error("Error in findArticleById service:", error);
    throw error;
  }
};

export const updateArticle = async (articleId, userId, updateData) => {
  try {
    await checkArticleOwnership(articleId, userId);

    const updatedArticle = await prisma.article.update({
      where: {
        id: articleId,
      },
      data: updateData,
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            username: true
          }
        }
      }
    });
    return updatedArticle;
  } catch (error) {
      console.error("Error in updateArticle service:", error);
      throw error;
  }
};

export const deleteArticle = async (articleId, userId) => {
  try {
    await checkArticleOwnership(articleId, userId);

    const deletedArticle = await prisma.article.delete({
      where: {
        id: articleId
      },
      select: {
        id: true,
        title: true,
        content: true,
        imageUrl: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return deletedArticle;
  } catch (error) {
      console.error("Error in deleteArticle service:", error);
      throw error;
  }
};