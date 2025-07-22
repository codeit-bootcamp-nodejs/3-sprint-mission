import pandaApiClient from '../utils/pandaApiClient.js';
import handleAxiosError from '../utils/handleAxiosError.js';
import validateArticle from '../utils/validateArticle.js';
import { Article } from '../models/Article.js';

/**
 * 게시글 리스트를 조회합니다.
 * @param {number} page - 페이지 번호
 * @param {number} pageSize - 페이지당 항목 수
 * @param {string} keyword - 검색 키워드
 * @returns {Promise<Article[]>} 게시글 배열
 */
const getArticleList = (page, pageSize, keyword) => {
  return pandaApiClient.get('/articles', {
    params: {
      page,
      pageSize,
      keyword
    }
  })
    .then(res => {
      const articleList = res.data?.list || [];
      return articleList
        .filter(validateArticle)
        .map(i => new Article(i));
    })
    .catch(e => handleAxiosError(e, getArticleList.name));
};

/**
 * 단일 게시글을 조회합니다.
 * 
 * 게시글이 없거나 에러가 나면 null을 반환합니다.
 * → handleAxiosError 참조. (fail-safe API)
 * @param {number} i - 게시글 ID
 * @returns {Promise<Object|null>} 게시글 데이터 또는 null
 */
const getArticle = (i) => {
  return pandaApiClient.get(`/articles/${i}`)
    .then(res => {
      const data = res.data;
      if (!validateArticle(data)) return null;
      return data; // return new Article(data)
    })
    .catch(e => handleAxiosError(e, getArticle.name));
};

/**
 * 게시글을 생성합니다.
 * @param {Object} article - 게시글 정보
 * @param {string} article.title - 제목
 * @param {string} article.content - 내용
 * @param {string} article.image - 이미지 URL
 * @returns {Promise<Object|null>} 생성된 게시글 데이터
 */
const createArticle = ({ title, content, image }) => {
  return pandaApiClient.post('/articles', {
    title,
    content,
    image
  })
    .then(res => res.data)
    .catch(e => handleAxiosError(e, createArticle.name));
};

/**
 * 게시글 내용을 수정합니다.
 * @param {number} i - 게시글 ID
 * @param {Object} body - 수정할 항목이 담긴 객체
 * @returns {Promise<Object|null>} 수정된 게시글 데이터
 */
const patchArticle = (i, body) => {
  return pandaApiClient.patch(`/articles/${i}`, body)
    .then(res => res.data)
    .catch(e => handleAxiosError(e, patchArticle.name));
};

/**
 * 게시글을 삭제합니다.
 * @param {number} i - 게시글 ID
 * @returns {Promise<Object|null>} 삭제 결과
 */
const deleteArticle = (i) => {
  return pandaApiClient.delete(`/articles/${i}`)
    .then(res => res.data)
    .catch(e => handleAxiosError(e, deleteArticle.name));
};


export { getArticleList, getArticle, createArticle, patchArticle, deleteArticle };