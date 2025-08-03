/**
 * HTTP 상태 코드를 포함한 커스텀 에러 클래스
 * @param message 에러메세지 설정
 * @status 에러 상태 설정
 */
export class HttpError extends Error {
  constructor(message: string, public readonly status: number = 500) {
    super(message);
    this.name = 'HttpError';
  }
}

