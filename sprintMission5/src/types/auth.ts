export interface loginTokenDto {
  accessToken: string;
  refreshToken: string;
}

export interface UserEmailDto {
  id: string;
  email: string;
  password: string;
  nickname: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ResourceWithUserId = {
  userId: string;
  [key: string]: any;
};

export type GetResourceFn = (resourceId: string) => Promise<ResourceWithUserId | null>;

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}