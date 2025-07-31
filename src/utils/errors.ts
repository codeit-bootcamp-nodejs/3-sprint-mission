export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class ValidationError extends HttpError {
  details: Array<{
    type: string;
    expected: string;
    message: string;
  }>;

  constructor(
    message: string = '유효성 검사 오류',
    details: Array<{ type: string; expected: string; message: string }> = []
  ) {
    super(message, 400);
    this.name = 'ValidationError';
    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}