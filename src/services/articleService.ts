import prisma, { Prisma } from '../config/prisma';
import {
  ArticleDto,
  CreateArticleDto,
  PatchArticleDto,
  ArticleWithLikeDto
} from '../types/article';
import { HttpError } from '../types/error';

const ArticleService = {
  async getArticleList(offset = 0, limit = 10, orderBy: 'asc' | 'desc' = 'desc'): Promise<ArticleDto[]> {
    return await prisma.article.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: orderBy,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        userId: true,
      }
    })
  },

  async getArticle(id: string): Promise<ArticleDto> {
    const data = await prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        userId: true,
      }
    });

    if (!data) {
      throw new HttpError('존재하지 않는 게시글입니다.', 404);
    }

    return data;
  },


  async createArticle(data: CreateArticleDto): Promise<ArticleDto> {
    return await prisma.article.create({
      data: {
        title: data.title,
        content: data.content || null,
        user: {
          connect: { id: data.userId }
        }
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        userId: true,
      }
    })
  },

  async patchArticle(id: string, data: PatchArticleDto): Promise<ArticleDto> {
    return await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content || null,
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        userId: true,
      }
    })
  },

  async deleteArticle(id: string): Promise<boolean> {
    await prisma.article.delete({
      where: { id },
    });
    return true;
  },

  async likeArticle(userId: string, articleId: string): Promise<void> {
    try {
      await prisma.articleLike.create({
        data: {
          userId,
          articleId,
        },
      })
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2002') {
        throw new HttpError('이미 좋아요를 누른 게시글입니다.', 409);
      }
    }
  },

  async unlikeArticle(userId: string, articleId: string): Promise<void> {
    await prisma.articleLike.delete({
      where: {
        userId_articleId: { userId, articleId },
      },
    })
  },

  async getArticleWithLike(userId: string, articleId: string): Promise<ArticleWithLikeDto> {
    const data = await this.getArticle(articleId);

    if (!data) {
      throw new HttpError('존재하지 않는 게시글입니다.', 404);
    }

    const isLiked = await prisma.articleLike.findUnique({
      where: {
        userId_articleId: { userId, articleId },
      },
    });

    return { ...data, isLiked: !!isLiked };
  }
}

export default ArticleService;