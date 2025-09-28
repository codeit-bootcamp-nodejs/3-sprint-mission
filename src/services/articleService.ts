import ArticleRepo from '../repositories/articleRepository';
import { ArticleDto,
  CreateArticleDto,
  PatchArticleDto,
  ArticleWithLikeDto
} from '../types/article';

const getArticleList = async (offset = 0, limit = 10, orderBy: 'asc' | 'desc' = 'desc'): Promise<ArticleDto[]> => {
  return ArticleRepo.getArticleList(offset, limit, orderBy);
};

const getArticle = async (id: string): Promise<ArticleDto> => {
  return ArticleRepo.getArticle(id);
};

const createArticle = async (data: CreateArticleDto): Promise<ArticleDto> => {
  return ArticleRepo.createArticle(data);
}

const patchArticle = async (id: string, data: PatchArticleDto): Promise<ArticleDto> => {
  return ArticleRepo.patchArticle(id, data);
};

const deleteArticle = async (id: string): Promise<boolean> => {
  await ArticleRepo.deleteArticle(id);
  return true;
};

const likeArticle = async (userId: string, articleId: string): Promise<void> => {
  await ArticleRepo.likeArticle(userId, articleId);
};

const unlikeArticle = async (userId: string, articleId: string): Promise<void> => {
  await ArticleRepo.unlikeArticle(userId, articleId);
};

const getArticleWithLike = async (userId: string, articleId: string): Promise<ArticleWithLikeDto> => {
  return ArticleRepo.getArticleWithLike(userId, articleId);
}

export default {
  getArticleList,
  getArticle,
  createArticle,
  patchArticle,
  deleteArticle,
  likeArticle,
  unlikeArticle,
  getArticleWithLike,
}