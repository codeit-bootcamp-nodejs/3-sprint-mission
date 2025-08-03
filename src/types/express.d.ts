import Express from 'express'

declare global {
	namespace Express {
		interface Request {
      user?: {
        id: number;
        name: string;
      };
			valid?: boolean;
		}
	}
}