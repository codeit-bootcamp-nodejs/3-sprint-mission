// src/services/articleComments.service.js
import { PrismaClient } from '@prisma/client';
import {
  checkCommentOwnership,
  prepareCommentCreateData,
  getCommentIncludeOptions,
  findCommentsCommon
} from '../utils/queryHelpers.js';

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export const createArticleComment = async ({ articlesId, usersId, content }) => {
  const data = prepareCommentCreateData({ parentId: articlesId, usersId, content }, 'article');

  const newComment = await prisma.article_comments.create({
    data: data,
    include: getCommentIncludeOptions('title')
  });
  return newComment;
};

export const findAllArticleComments = async ({ articlesId, cursor, limit }) => {
  return findCommentsCommon('article_comments', articlesId, { cursor, limit }, 'title');
};

export const updateArticleComment = async (commentId, { content, usersId }) => {
  await checkCommentOwnership(commentId, usersId, 'article_comments');

  const updatedComment = await prisma.article_comments.update({
    where: { id: commentId },
    data: { content },
  });
  return updatedComment;
};

export const deleteArticleComment = async (commentId, usersId) => {
  await checkCommentOwnership(commentId, usersId, 'article_comments');

  const deletedComment = await prisma.article_comments.delete({
    where: { id: commentId }
  });
  return deletedComment;
};