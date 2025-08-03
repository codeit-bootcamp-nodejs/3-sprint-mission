import { Request, Response, NextFunction } from 'express';
import {
  findAllArticles,
  createArticle,
  findArticleById,
  updateArticle,
  deleteArticle,
  toggleArticleLike,
} from '../services/articleService';
import { PaginationAndSearchRequest } from '../../types/pagenation';
import { ArticleParamsRequest, CreateArticleData, UpdateArticleData } from '../../types/article';

// 게시글 목록 조회
export const getAllArticles = async (
  req: PaginationAndSearchRequest,
  res: Response,
  next: NextFunction
) => {
  const articles = await findAllArticles(req.query);
  res.status(200).json({
    message: '조회하신 게시글 목록입니다.',
    data: articles,
  });
};

// 게시글 생성
export const createArticleController = async (
  req: Request<{}, {}, CreateArticleData>,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.userId;
  const { title, content } = req.body;
  const imageUrl = req.file ? `/uploads/articles/${req.file.filename}` : null;

  const newArticle = await createArticle({ title, content, userId, imageUrl });

  res.status(201).json({
    message: '게시글 등록 완료',
    data: newArticle,
  });
};

// 특정 게시글 조회
export const getArticleById = async (
  req: ArticleParamsRequest,
  res: Response,
  next: NextFunction
) => {
  const { articleId } = req.params;
  const currentUserId = req.user?.userId;
  const article = await findArticleById(articleId, currentUserId);

  res.status(200).json({
    message: '조회하신 게시글입니다',
    data: article,
  });
};

// 게시글 수정
export const updateArticleController = async (
  req: ArticleParamsRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.userId;
  const { articleId } = req.params;
  const updateData = req.body as UpdateArticleData;

  if (req.file) {
    updateData.imageUrl = `/uploads/articles/${req.file.filename}`;
  }

  const patchArticle = await updateArticle(articleId, userId, updateData);

  res.status(200).json({
    message: '수정하신 게시글입니다',
    data: patchArticle,
  });
};

// 게시글 삭제
export const deleteArticleController = async (
  req: ArticleParamsRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user!.userId;
  const { articleId } = req.params;

  await deleteArticle(articleId, userId);

  res.status(204).end();
};

// 좋아요 토글
export const toggleArticleLikeController = async (
  req: ArticleParamsRequest,
  res: Response,
  next: NextFunction
) => {
  const { articleId } = req.params;
  const loggedInUserId = req.user!.userId;
  const result = await toggleArticleLike(loggedInUserId, articleId);

  res.status(200).json(result);
};