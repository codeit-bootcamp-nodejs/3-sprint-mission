import { HttpError } from '../types/error';
/**
 *  baseUrl에 따라 게시판 타입을 판별하여 연결할 키를 반환합니다.
 * 예: '/product-comments' -> 'productId', '/freeBoard-comments' -> 'articleId'
 * @param baseUrl 
 * @returns 'productId' | articleId
 * 
 * @throws {HttpError} baseUrl이 유효하지 않은 문자열일 경우 (status 400)
 * @throws {HttpError} 지원하지 않는 baseUrl일 경우 (status 400)
 */

export function setBoardTypeByBaseUrl(baseUrl: string): string {
  if (!baseUrl || typeof baseUrl !== 'string') {
    throw new HttpError('유효하지 않은 baseUrl입니다', 400);
  }

  const map = {
    '/product-comments': 'productId',
    '/freeBoard-comments': 'articleId',
  } as const;

  type BoardBaseUrl = keyof typeof map;
  const trimmed = baseUrl.trim() as BoardBaseUrl;

  if (!map.hasOwnProperty(trimmed)) {
    throw new HttpError(`지원하지 않는 baseUrl: ${trimmed}`, 400);
  }

  return map[trimmed];
}

