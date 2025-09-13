import type { RequestHandler } from 'express';
import {
  likeTarget,
  unlikeTarget,
  getUserLikedProducts,
  getUserLikedArticles,
} from '../services/likeService.js';
import type { LikeTargetType } from '../types/like.js';

/**
 * @function postProductLike
 * @description 상품 좋아요 등록
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {201} 좋아요 등록 성공
 * @throws {400} 대상 ID가 유효하지 않거나 이미 좋아요를 누른 경우
 */
export const postProductLike: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  await likeTarget(req.user.id, id, 'product');
  res.status(201).json({ message: '좋아요가 등록되었습니다.' });
};

/**
 * @function deleteProductLike
 * @description 상품 좋아요 취소
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 좋아요 취소 성공
 * @throws {400} 대상 ID가 유효하지 않은 경우
 * @throws {404} 좋아요가 존재하지 않는 경우
 */
export const deleteProductLike: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  await unlikeTarget(req.user.id, id, 'product');
  res.status(200).json({ message: '좋아요가 취소되었습니다.' });
};

/**
 * @function postArticleLike
 * @description 게시글 좋아요 등록
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {201} 좋아요 등록 성공
 * @throws {400} 대상 ID가 유효하지 않거나 이미 좋아요를 누른 경우
 */
export const postArticleLike: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  await likeTarget(req.user.id, id, 'article');
  res.status(201).json({ message: '좋아요가 등록되었습니다.' });
};

/**
 * @function deleteArticleLike
 * @description 게시글 좋아요 취소
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 좋아요 취소 성공
 * @throws {400} 대상 ID가 유효하지 않은 경우
 * @throws {404} 좋아요가 존재하지 않는 경우
 */
export const deleteArticleLike: RequestHandler = async (req, res) => {
  const id = Number(req.params.id);
  await unlikeTarget(req.user.id, id, 'article');
  res.status(200).json({ message: '좋아요가 취소되었습니다.' });
};

/**
 * @function getLikedProducts
 * @description 사용자가 좋아요한 상품 목록 조회
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 좋아요한 상품 목록 반환
 */
export const getLikedProducts: RequestHandler = async (req, res) => {
  const products = await getUserLikedProducts(req.user.id);
  res.status(200).json(products);
};

/**
 * @function getLikedArticles
 * @description 사용자가 좋아요한 게시글 목록 조회
 * 
 * @param {Object} req - Express 요청 객체
 * @param {Object} res - Express 응답 객체
 * 
 * @returns {200} 좋아요한 게시글 목록 반환
 */
export const getLikedArticles: RequestHandler = async (req, res) => {
  const articles = await getUserLikedArticles(req.user.id);
  res.status(200).json(articles);
};