//등록 수정 삭제 목록 조회

import { PrismaClient } from '@prisma/client';
import { assert, create, number } from 'superstruct';
import { Comment } from '../structs'
import { RequestHandler } from 'express';
import commentService from '../services/commentService';

export const getProductCommentList: RequestHandler = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const { cursor, limit = 10 } = req.query;
    const data = { productId, cursor, limit }
    const comments = commentService.getProductCommentList(data)
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const getArticleCommentList: RequestHandler = async (req, res, next) => {
  try {
    const { id: articleId } = req.params;
    const { cursor, limit = 10 } = req.query;
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

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const getComment: RequestHandler = async (req, res, next) => {
  try {
    const id: number = Number(req.params.id);

    const comment = await prisma.comment.findUnique({
      where: { id }
    })

    res.status(200).json(comment)
  } catch (error) {
    next(error);
  }
}

export const postProductComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, Comment);

    const { id: productId } = req.params
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        product: { connect: { id: productId } }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof Error && error?.name === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 등록할 수 없습니다.' });
    }
    next(error);
  }
}

export const postArticleComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, Comment);

    const { id: articleId } = req.params
    const { content } = req.body;

    const comment = await prisma.comment.create({
      data: {
        content,
        article: { connect: { id: articleId } }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof Error && error?.name === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 등록할 수 없습니다.' });
    }
    next(error);
  }
}

export const patchProductComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, Comment);

    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.update({
      where: {
        id: Number(commentId)
      },
      data: {
        content
      }
    });

    res.status(200).json(comment);
  } catch (error) {
    if (error instanceof Error && error?.name === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 수정할 수 없습니다.' });
    }
    next(error);
  }
}

export const patchArticleComment: RequestHandler = async (req, res, next) => {
  try {
    assert(req.body, Comment);

    const { commentId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.update({
      where: {
        id: Number(commentId)
      },
      data: {
        content
      }
    });

    res.status(200).json(comment);
  } catch (error) {
    if (error instanceof Error && error?.name === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 수정할 수 없습니다.' });
    }
    next(error);
  }
}

export const deleteProductComment: RequestHandler = async (req, res, next) => {
  try {

    const { commentId } = req.params;

    const comment = await prisma.comment.delete({
      where: {
        id: Number(commentId)
      }
    });

    res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error?.name === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 삭제할 수 없습니다.' });
    }
    next(error);
  }
}

export const deleteArticleComment: RequestHandler = async (req, res, next) => {
  try {

    const { commentId } = req.params;

    const comment = await prisma.comment.delete({
      where: {
        id: Number(commentId)
      }
    });

    res.status(204).end();
  } catch (error) {
    if (error instanceof Error && error?.name === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 삭제할 수 없습니다.' });
    }
    next(error);
  }
}