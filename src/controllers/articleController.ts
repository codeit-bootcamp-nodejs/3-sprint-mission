import type { RequestHandler } from 'express';
import * as articleService from '../services/articleService.js';
import { isTargetLiked } from '../services/likeService.js';
import {
  CreateArticleDto,
  ListArticlesQueryDto,
  UpdateArticleDto
} from '../types/article.js'

/**
 * @function createArticle
 * @description 새 게시글을 작성합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {201} 생성된 게시글 객체 반환
 */
export const createArticle: RequestHandler = async (req, res) => {
  const dto: CreateArticleDto = {
    ...req.body,
    userId: req.user.id,
  };

  const article = await articleService.createArticle(dto);
  res.status(201).json(article);
};

/**
 * @function listArticles
 * @description 게시글 목록을 조회합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 게시글 목록 반환
 */
export const listArticles: RequestHandler = async (req, res) => {
  const dto: ListArticlesQueryDto = {
    offset: Number(req.query.offset) || 0,
    limit: Number(req.query.limit) || 10,
    search: typeof req.query.search === 'string' ? req.query.search : '',
  };

  const articles = await articleService.getArticleList(
    dto.offset,
    dto.limit,
    dto.search
  );
  res.status(200).json(articles);
};

/**
 * @function getArticleById
 * @description ID로 특정 게시글을 조회합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 게시글 반환
 * @throws {404} 게시글을 찾을 수 없는 경우
 */
export const getArticleById: RequestHandler = async (req, res) => {
  const article = await articleService.getArticleById(Number(req.params.id));

  const userId = req.user?.id;
  const isLiked = userId ? await isTargetLiked(userId, article.id, 'article') : false;

  res.status(200).json({ ...article, isLiked });
};

/**
 * @function updateArticle
 * @description 게시글을 수정합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 수정된 게시글 반환
 * @throws {404} 게시글을 찾을 수 없는 경우
 * @throws {403} 수정 권한이 없는 경우
 */
export const updateArticle: RequestHandler = async (req, res) => {
  const dto: UpdateArticleDto = req.body;

  const updated = await articleService.updateArticle(
    Number(req.params.id),
    req.user.id,
    dto
  );

  res.status(200).json(updated);
};

/**
 * @function deleteArticle
 * @description 게시글을 삭제합니다.
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {204} 삭제 성공
 * @throws {404} 게시글을 찾을 수 없는 경우
 * @throws {403} 삭제 권한이 없는 경우
 */
export const deleteArticle: RequestHandler = async (req, res) => {
  await articleService.deleteArticle(Number(req.params.id), req.user.id);
  res.status(204).end();
};