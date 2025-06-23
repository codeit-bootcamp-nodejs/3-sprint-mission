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

export const createProductComment = async ({ productsId, usersId, content }) => {
  const data = prepareCommentCreateData({ parentId: productsId, usersId, content }, 'Product');

  const newComment = await prisma.product_comments.create({
    data: data,
    include: getCommentIncludeOptions('name')
  });
  return newComment;
};

export const findAllProductComments = async ({ productsId, cursor, limit }) => {
  return findCommentsCommon('product_comments', productsId, { cursor, limit }, 'name');
};

export const updateProductComment = async (commentId, { content, usersId }) => {
  await checkCommentOwnership(commentId, usersId, 'product_comments');

  const updatedComment = await prisma.product_comments.update({
    where: { id: commentId },
    data: { content },
  });
  return updatedComment;
};

export const deleteProductComment = async (commentId, usersId) => {
  await checkCommentOwnership(commentId, usersId, 'product_comments');

  const deletedComment = await prisma.product_comments.delete({
    where: { id: commentId }
  });
  return deletedComment;
};