import {
  checkCommentOwnership,
  prepareCommentCreateData,
  getCommentIncludeOptions,
  findCommentsCommon,
} from '../utils/queryHelpers.js';
import prisma from '../lib/prisma';
import { CreateCommentArgs, UpdateCommentArgs, FindAllCommentsArgs } from '../../types/articleComment'

export const createArticleComment = async ({ articleId, userId, content }: CreateCommentArgs) => {
  const data = prepareCommentCreateData({ parentId: articleId, userId, content }, 'article');
  const newComment = await prisma.articleComment.create({
    data: data,
    include: getCommentIncludeOptions('title')
  });
  return newComment;
};

export const findAllArticleComments = async ({ articleId, cursor, limit }: FindAllCommentsArgs) => {
  return findCommentsCommon('ArticleComment', articleId, { cursor, limit }, 'title');
};

export const updateArticleComment = async (commentId: string, { content, userId }: UpdateCommentArgs) => {
  await checkCommentOwnership(commentId, userId, 'ArticleComment');
  const updatedComment = await prisma.articleComment.update({
    where: { id: commentId },
    data: { content },
    select: {
      id: true,
      content: true,
      userId: true,
      articleId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return updatedComment;
};

export const deleteArticleComment = async (commentId: string, userId: string) => {
  await checkCommentOwnership(commentId, userId, 'ArticleComment');
  const deletedComment = await prisma.articleComment.delete({
    where: { id: commentId },
    select: {
      id: true,
      content: true,
      userId: true,
      articleId: true,
    },
  });
  return deletedComment;
};