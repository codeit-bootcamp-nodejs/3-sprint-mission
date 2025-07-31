import { Request, Response, NextFunction } from "express"

function asyncHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await handler(req, res, next);
    } catch (e: unknown) {
      next(e);
    }
  };
}

export default asyncHandler;