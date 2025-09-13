import type { RequestHandler } from 'express';
import * as commentService from '../services/commentService.js';
import {
  CreateCommentDto,
  ListCommentsQueryDto,
  UpdateCommentDto,
} from '../types/comment.js';

/**
 * @function createProductComment
 * @description 상품 댓글을 작성합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res -Express 응답 객체
 * 
 * @returns {201} 생성된 댓글 반환
 */
export const createProductComment: RequestHandler = async (req, res) => {
  const productId = Number(req.params.productId);
  const userId = req.user.id;
  const dto: CreateCommentDto = req.body;

  const comment = await commentService.createProductComment(productId, userId, dto.content);
  res.status(201).json(comment);
};

/**
 * @function getProductComments
 * @description 상품 댓글 목록을 조회합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res -Express 응답 객체
 * 
 * @returns {200} 댓글 목록 반환
 */
export const getProductComments: RequestHandler = async (req, res) => {
  const productId = Number(req.params.productId);
  const dto: ListCommentsQueryDto = {
    cursor: req.query.cursor ? Number(req.query.cursor) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : 10,
  };

  const comments = await commentService.getProductComments(productId, dto);
  res.status(200).json(comments);
};

/**
 * @function createArticleComment
 * @description 게시글 댓글을 작성합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res -Express 응답 객체
 * 
 * @returns {201} 생성된 댓글 반환
 */
export const createArticleComment: RequestHandler = async (req, res) => {
  const articleId = Number(req.params.articleId);
  const userId = req.user.id;
  const dto: CreateCommentDto = req.body;

  const comment = await commentService.createArticleComment(articleId, userId, dto.content);
  res.status(201).json(comment);
};

/**
 * @function getArticleComments
 * @description 게시글 댓글 목록을 조회합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res -Express 응답 객체
 * 
 * @returns {200} 댓글 목록 반환
 */
export const getArticleComments: RequestHandler = async (req, res) => {
  const articleId = Number(req.params.articleId);
  const dto: ListCommentsQueryDto = {
    cursor: req.query.cursor ? Number(req.query.cursor) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : 10,
  };

  const comments = await commentService.getArticleComments(articleId, dto);
  res.status(200).json(comments);
};

/**
 * @function updateComment
 * @description 댓글을 수정합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res -Express 응답 객체
 * 
 * @returns {200} 수정된 댓글 반환
 * @throws {404} 댓글을 찾을 수 없는 경우
 * @throws {403} 수정 권한이 없는 경우
 */
export const updateComment: RequestHandler = async (req, res) => {
  const commentId = Number(req.params.id);
  const userId = req.user.id;
  const dto: UpdateCommentDto = req.body;

  const updated = await commentService.updateComment(commentId, userId, dto.content);
  res.status(200).json(updated);
};

/**
 * @function deleteComment
 * @description 댓글을 삭제합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res -Express 응답 객체
 * 
 * @returns {204} 삭제 성공 (내용 없음)
 * @throws {404} 댓글을 찾을 수 없는 경우
 * @throws {403} 삭제 권한이 없는 경우
 */
export const deleteComment: RequestHandler = async (req, res) => {
  const commentId = Number(req.params.id);
  const userId = req.user.id;

  await commentService.deleteComment(commentId, userId);
  res.status(204).end();
};