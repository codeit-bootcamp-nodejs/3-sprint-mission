//등록 수정 삭제 목록 조회

import { PrismaClient } from '@prisma/client';
import { assert, create } from 'superstruct';
import { Comment } from '../structs.js'
const prisma = new PrismaClient();

export const getProductCommentList = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    const { cursor, limit = 10 } = req.query;
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
        orderBy: { id: 'desc' },
        take
      });
    }

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const getArticleCommentList = async (req, res, next) => {
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
        orderBy: { id: 'desc' },
        take
      });
    }

    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const postProductComment = async (req, res, next) => {
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
    if (error?.title === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 등록할 수 없습니다.' });
    }
    next(error);
  }
}

export const postArticleComment = async (req, res, next) => {
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
    if (error?.title === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 등록할 수 없습니다.' });
    }
    next(error);
  }
}

export const patchProductComment = async (req, res, next) => {
  try {
    assert(req.body, Comment);

    const { id: productId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.update({
      where: {
        id: productId
      },
      data: {
        content
      }
    });

    res.status(200).json(comment);
  } catch (error) {
    if (error?.title === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 수정할 수 없습니다.' });
    }
    next(error);
  }
}

export const patchArticleComment = async (req, res, next) => {
  try {
    assert(req.body, Comment);

    const { id: articleId } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.update({
      where: {
        id: articleId
      },
      data: {
        content
      }
    });

    res.status(200).json(comment);
  } catch (error) {
    if (error?.title === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 수정할 수 없습니다.' });
    }
    next(error);
  }
}

export const deleteProductComment = async (req, res, next) => {
  try {

    const { id: productId } = req.params;

    const comment = await prisma.comment.delete({
      where: {
        id: productId
      }
    });

    res.status(204).json(comment);
  } catch (error) {
    if (error?.title === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 삭제할 수 없습니다.' });
    }
    next(error);
  }
}

export const deleteArticleComment = async (req, res, next) => {
  try {

    const { id: articleId } = req.params;

    const comment = await prisma.comment.delete({
      where: {
        id: articleId
      }
    });

    res.status(204).json(comment);
  } catch (error) {
    if (error?.title === 'StructError') {
      return res.status(400).json({ error: '해당 댓글을 삭제할 수 없습니다.' });
    }
    next(error);
  }
}