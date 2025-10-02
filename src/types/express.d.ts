<<<<<<< HEAD
import Express from 'express';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
=======
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
>>>>>>> 5f4e30cff6d46ac41181e8d8ff79f9f78f919e5b
