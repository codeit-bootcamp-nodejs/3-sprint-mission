import { RequestHandler } from "express";
import ArticleService from "../services/articleService";
import { checkUser } from "../utils/checkUser";
import { ARTICLE_ERROR } from "../constants/articleConstants";
import { PaginationQueryDto } from "../types/common";
import { HttpError } from "../types/error";


const getArticleList: RequestHandler = async (req, res, next) => {
  try {
    const { offset, limit, orderBy } = req.query as PaginationQueryDto;
    const parsedOffset = parseInt(offset ? offset : '0');
    const parsedLimit = parseInt(limit ? limit : '10');
    const typeOrderBy = (orderBy === 'recent') ? 'desc' : 'asc';
    const articles = await ArticleService.getArticleList(
      parsedOffset,
      parsedLimit,
      typeOrderBy,
    );
    res.json(articles);
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
    } else {
      next(new HttpError(ARTICLE_ERROR.GET_ARTICLE_LIST_ERROR, 500));
    }
  }
};

const getArticle: RequestHandler = async (req, res, next) => {
  const articleId = req.params.id;
  try {
    const article = await ArticleService.getArticle(articleId);
    res.json(article);
  } catch (error) {
    next(new HttpError(ARTICLE_ERROR.GET_ARTICLE_ERROR, 404));
  }
};

const createArticle: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  await checkUser(userId);
  const data = { ...req.body, userId };
  try {
    const article = await ArticleService.createArticle(data);
    res.status(201).json(article);
  } catch (error) {
    next(new HttpError(ARTICLE_ERROR.CREATE_ARTICLE_ERROR, 500));
  }
};

const patchArticle: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const article = await ArticleService.patchArticle(id, req.body);
    res.json(article);
  } catch (error) {
    next(new HttpError(ARTICLE_ERROR.PATCH_ARTICLE_ERROR, 500));
  }
};

const deleteArticle: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    await ArticleService.deleteArticle(id);
    res.sendStatus(204);
  } catch (error) {
    next(new HttpError(ARTICLE_ERROR.DELETE_ARTICLE_ERROR, 404));
  }
};

const likeArticle: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const user = await checkUser(userId);
  const articleId = req.params.id;
  try {
    await ArticleService.likeArticle(user.id, articleId);
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
    } else {
      next(new HttpError('게시글 좋아요 중 오류가 발생했습니다.', 500));
    }
  }
};

const unlikeArticle: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const user =await checkUser(userId);
  const articleId = req.params.id;
  try {
    await ArticleService.unlikeArticle(user.id, articleId);
    res.sendStatus(204);
  } catch (error) {
    next(new HttpError('게시글 좋아요 취소 중 오류가 발생했습니다.', 500));
  }
};

const getArticleWithLike: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const user = await checkUser(userId);
  const articleId = req.params.id;
  try {
    const article = await ArticleService.getArticleWithLike(user.id, articleId);
    res.json(article);
  } catch (error) {
    next(new HttpError('게시글을 찾을 수 없습니다.', 404));
  }
};

export default {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
  getArticleWithLike
}