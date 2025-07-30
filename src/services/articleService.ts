import { CustomError } from '../utils/CustomError.js';
import type { CreateArticleDto, UpdateArticleDto, PublicArticle } from '../types/article.js';
import {
  findMany,
  findById,
  create,
  update,
  remove
} from '../repositories/articleRepository.js';

export const getArticleList = async (
  offset = 0,
  limit = 10,
  search = ''
): Promise<Pick<PublicArticle, 'id' | 'title' | 'content' | 'createdAt'>[]> => {
  return findMany(offset, limit, search);
};

export const getArticleById = async (id: number): Promise<PublicArticle> => {
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('게시글 ID가 올바르지 않습니다.', 400);

  const article = await findById(id);
  if (!article) throw new CustomError('게시글을 찾을 수 없습니다.', 404);
  return article;
};

export const createArticle = (data: CreateArticleDto) => create(data);

export const updateArticle = async (
  id: number,
  userId: number,
  data: UpdateArticleDto
): Promise<PublicArticle> => {
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('게시글 ID가 올바르지 않습니다.', 400);

  const article = await findById(id);
  if (!article) throw new CustomError('게시글을 찾을 수 없습니다.', 404);
  if (article.userId !== userId) throw new CustomError('해당 게시글 수정 권한이 없습니다.', 403);

  return update(id, data);
};

export const deleteArticle = async (id: number, userId: number): Promise<void> => {
  if (!Number.isInteger(id) || id <= 0) throw new CustomError('게시글 ID가 올바르지 않습니다.', 400);

  const article = await findById(id);
  if (!article) throw new CustomError('게시글을 찾을 수 없습니다.', 404);
  if (article.userId !== userId) throw new CustomError('해당 게시글 삭제 권한이 없습니다.', 403);

  await remove(id);
};