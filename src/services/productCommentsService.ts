import {
  checkCommentOwnership,
  prepareCommentCreateData,
  getCommentIncludeOptions,
  findCommentsCommon,
} from '../utils/queryHelpers';
import prisma from '../lib/prisma';
import { updateProductCommentArg, findAllProductCommentsArg, createProductCommentArg } from '../../types/productComment'

export const createProductComment = async ({ productId, userId, content }: createProductCommentArg) => {
  try {
    const data = prepareCommentCreateData({ parentId: productId, userId, content }, 'product');

    const newComment = await prisma.productComment.create({
      data: data,
      include: getCommentIncludeOptions('name')
    });
    return newComment;
  } catch (error) {
    throw error;
  }
};

export const findAllProductComments = async ({ productId, cursor, limit }: findAllProductCommentsArg) => {
  try {
    return findCommentsCommon('ProductComment', productId, { cursor, limit }, 'name');
  } catch (error) {
    throw error;
  }
};

export const updateProductComment = async (commentId: string, { content, userId }: updateProductCommentArg) => {
  try {
    await checkCommentOwnership(commentId, userId, 'ProductComment');
    const updatedComment = await prisma.productComment.update({
      where: { id: commentId },
      data: { content },
      select: {
        id: true,
        content: true,
        userId: true,
        productId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return updatedComment;
  } catch (error) {
    throw error;
  }
};

export const deleteProductComment = async (commentId: string, userId: string) => {
  try {
    await checkCommentOwnership(commentId, userId, 'ProductComment');
    const deletedComment = await prisma.productComment.delete({
      where: { id: commentId },
      select: {
        id: true,
        content: true,
        userId: true,
        productId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return deletedComment;
  } catch (error) {
    throw error;
  }
};