import { PrismaClient } from '@prisma/client';
import { assert, create, number } from 'superstruct';
import { Comment } from '../structs'
import { errorHandler } from '../handler/errorHandler';
const prisma = new PrismaClient();

const getProductCommentList = async (data: {productId: string, cursor: string | number, limit: number}) => {
  try {
    const { productId, cursor, limit } = data
    const take = Number(limit);

    let comments;
    if (cursor) {
      // cursor 있을 때
      comments = await prisma.comment.findMany({
        where: { productId },
        select: { id: true, content: true, createdAt: true },
        orderBy: { id: 'asc' },
        take,
        cursor: { id: Number(cursor) },
        skip: 1
      });
    } else {
      // cursor 없을 때
      comments = await prisma.comment.findMany({
        where: { productId },
        select: { id: true, content: true, createdAt: true },
        orderBy: { id: 'asc' },
        take
      });
    }

    return comments
  } catch (error) {
    errorHandler
  }
};

const getArticleCommentList = async (articleId: string, cursor: string | number, limit: number = 10) => {
  try {
    const id = articleId;
    const take = Number(limit);

    let comments;
    if (cursor) {
      // cursor 있을 때
      comments = await prisma.comment.findMany({
        where: { articleId },
        select: { id: true, content: true, createdAt: true },
        orderBy: { id: 'asc' },
        take,
        cursor: { id: Number(cursor) },
        skip: 1
      });
    } else {
      // cursor 없을 때
      comments = await prisma.comment.findMany({
        where: { articleId },
        select: { id: true, content: true, createdAt: true },
        orderBy: { id: 'asc' },
        take
      });
    }

    return comments
  } catch (error) {
    errorHandler
  }
};

const getComment = async (userId: number, cursor: string | number, limit: number = 10) => {
  try {
    const id = Number(userId);
    const take = Number(limit);

    let comments;
    if (cursor) {
      // cursor 있을 때
      comments = await prisma.comment.findMany({
        where: { id },
        select: { id: true, content: true, createdAt: true },
        orderBy: { id: 'asc' },
        take,
        cursor: { id: Number(cursor) },
        skip: 1
      });
    } else {
      // cursor 없을 때
      comments = await prisma.comment.findMany({
        where: { id },
        select: { id: true, content: true, createdAt: true },
        orderBy: { id: 'asc' },
        take
      });
    }

    const comment = await prisma.comment.findUnique({
      where: { id }
    })

    return comments
  } catch (error) {
    errorHandler
  }
}

const postProductComment = async (id: number, productId: string, userId: number, content: string) => {
  try {
    assert(content, Comment);
    const comment = await prisma.comment.create({
      data: {
        content,
        product: { connect: { id: productId } },
        User: { connect: { id: userId } }
      }
    });

    return comment
  } catch (error) {
    errorHandler
  }
}

const postArticleComment = async (id: number, articleId: string, userId: number, content: string) => {
  try {
    assert(content, Comment);
    const comment = await prisma.comment.create({
      data: {
        content,
        article: { connect: { id: articleId } },
        User: { connect: { id: userId } }
      }
    });

    return comment
  } catch (error) {
    errorHandler
  }
}

const patchComment = async (id: number, content: string) => {
  try {
    assert(content, Comment);
    const comment = await prisma.comment.update({
      where: {
        id: Number(id)
      },
      data: {
        content
      }
    });

    return comment
  } catch (error) {
    errorHandler
  }
}

const deleteComment = async (id: number, content: string) => {
  try {
    const comment = await prisma.comment.delete({
      where: {
        id: Number(id)
      }
    });

    console.log(`댓글 삭제 완료`)
  } catch (error) {
    errorHandler
  }
}

export default {
  getProductCommentList,
  getArticleCommentList,
  getComment,
  patchComment,
  deleteComment,
  postArticleComment,
  postProductComment
}