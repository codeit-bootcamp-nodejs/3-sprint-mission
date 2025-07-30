import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { promises } from 'dns';

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

interface PagenationQuery {
  offset?: string;
  limit?: string;
}

export const getPaginationParams = (query: PagenationQuery) => {
  const skip = parseInt(query.offset || '0', 10);
  const take = parseInt(query.limit || '10', 10)
  return { skip, take };
};

interface SortParamsQuery {
  sort?: string
}

export const getSortParams = (query: SortParamsQuery, defaultSortField = 'createdAt') => {
  const { sort } = query;
  const order = sort === 'recent' ? 'desc' : 'asc';
  return {
    [defaultSortField]: order,
  };
};

export const getSearchParams = (search?: string, fields?: string[]) => {
  if (!search || !fields || fields.length === 0) {
    return {};
  }
  return {
    OR: fields.map(field => ({
      [field]: {
        contains: search,
        mode: 'insensitive',
      },
    })),
  };
};

interface Options {
  cursor?: string;
  limit?: string;
}

interface CursorPaginationReturnOptions {
  take: number;
  cursor?: { id: string };
  skip?: number;
}

export const getCursorPaginationOptions = ({ cursor, limit }: Options) => {
  const parsedLimit = parseInt(limit || '10', 10)
  const options: CursorPaginationReturnOptions = {
    take: parsedLimit,
  };

  if (cursor) {
    options.cursor = {
      id: cursor,
    };
    options.skip = 1;
  }
  return { ...options, parsedLimit };
};

export const calculateNextCursor = <T extends { id: string }>(items: T[], parsedLimit: number): string | null => {
  if (items.length === parsedLimit) {
    return items[items.length - 1].id;
  }
  return null;
};

export const checkCommentOwnership = async (
  commentId: string,
  usersId: string,
  modelName: Prisma.ModelName
): Promise<void> => {
  const model: any = prisma[modelName];

  if (!model) {
    const error = new Error(`Invalid model name provided: ${modelName}`);
    (error as any).statusCode = 500;
    throw error;
  }

  const comment = await model.findUnique({
    where: { id: commentId },
    select: { id: true, userId: true }, // 필요한 필드만 선택
  }) as (
      Prisma.ProductCommentGetPayload<{ select: { id: true, userId: true } }> |
      Prisma.ArticleCommentGetPayload<{ select: { id: true, userId: true } }> |
      null
    );

  if (!comment) {
    throw new PrismaClientKnownRequestError('댓글을 찾을 수 없습니다.', {
      code: 'P2025',
      meta: { modelName: modelName, cause: 'record not found' },
      clientVersion: '5.22.0',
    });
  }

  if (comment.userId !== usersId) {
    const error = new Error('댓글을 수정/삭제할 권한이 없습니다.');
    (error as any).statusCode = 403;
    throw error;
  }
};

export const checkProductOwnership = async (
  productId: string,
  userId: string
): Promise<void> => {
  const product: Prisma.ProductGetPayload<{ select: { userId: true } }> =
    await prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true },
    });

  if (!product) {
    throw new PrismaClientKnownRequestError('상품을 찾을 수 없습니다.', {
      code: 'P2025',
      meta: { modelName: 'Product', cause: 'record not found' },
      clientVersion: '5.22.0',
    });
  }

  if (product.userId !== userId) {
    const error = new Error('상품을 수정하거나 삭제할 권한이 없습니다.');
    (error as any).statusCode = 403;
    throw error;
  }
};

export const checkArticleOwnership = async (
  articleId: string,
  userId: string
): Promise<void> => {
  const article: Prisma.ArticleGetPayload<{ select: { userId: true } }> =
    await prisma.article.findUnique({
      where: { id: articleId },
      select: { userId: true },
    });

  if (!article) {
    throw new PrismaClientKnownRequestError('게시글을 찾을 수 없습니다.', {
      code: 'P2025',
      meta: { modelName: 'Article', cause: 'record not found' },
      clientVersion: '5.22.0',
    });
  }

  if (article.userId !== userId) {
    const error = new Error('게시글을 수정하거나 삭제할 권한이 없습니다.');
    (error as any).statusCode = 403;
    throw error;
  }
};

interface CommentCreateArgs {
  parentId: string;
  userId: string;
  content: string;
}

type ParentModelName = 'product' | 'article'

// --- 함수 오버로드 시그니처 정의 시작 ---

// 1. parentModelName이 'product'일 때의 시그니처
export function prepareCommentCreateData(
  args: CommentCreateArgs,
  parentModelName: 'product'
): Prisma.ProductCommentCreateInput;

// 2. parentModelName이 'article'일 때의 시그니처
export function prepareCommentCreateData(
  args: CommentCreateArgs,
  parentModelName: 'article'
): Prisma.ArticleCommentCreateInput;

// 3. 실제 함수 구현 (implementation signature)
export function prepareCommentCreateData(
  { parentId, userId, content }: CommentCreateArgs,
  parentModelName: ParentModelName
): Prisma.ProductCommentCreateInput | Prisma.ArticleCommentCreateInput {
  const data: any = {
    content: content,
    user: {
      connect: {
        id: userId,
      },
    },
  };

  if (parentModelName === 'product') {
    (data as Prisma.ProductCommentCreateInput).product = {
      connect: {
        id: parentId,
      },
    };
  } else {
    (data as Prisma.ArticleCommentCreateInput).article = {
      connect: {
        id: parentId,
      },
    };
  }
  return data;
}

type ParentSelectField = 'name' | 'title'

export function getCommentIncludeOptions(
  parentSelectField: 'name'
): Prisma.ProductCommentInclude;

export function getCommentIncludeOptions(
  parentSelectField: 'title'
): Prisma.ArticleCommentInclude;

export function getCommentIncludeOptions(
  parentSelectField: ParentSelectField
): Prisma.ProductCommentInclude | Prisma.ArticleCommentInclude { // 포괄적인 반환 타입
  const includeOptions: any = {
    user: {
      select: {
        username: true
      }
    }
  };

  if (parentSelectField === 'name') {
    (includeOptions as Prisma.ProductCommentInclude).product = {
      select: {
        name: true
      }
    };
  } else { // 'title'일 경우
    (includeOptions as Prisma.ArticleCommentInclude).article = {
      select: {
        title: true
      }
    };
  }
  return includeOptions;
}

// 1. ProductComment를 조회할 때 (parentSelectField가 'name'일 경우)
export function findCommentsCommon(
  modelName: 'ProductComment',
  parentId: string,
  queryParams: Options,
  parentSelectField: 'name'
): Promise<{
  comments: Prisma.ProductCommentGetPayload<{ include: Prisma.ProductCommentInclude }>[],
  nextCursor: string | null
}>;

// 2. ArticleComment를 조회할 때 (parentSelectField가 'title'일 경우)
export function findCommentsCommon(
  modelName: 'ArticleComment',
  parentId: string,
  queryParams: Options,
  parentSelectField: 'title'
): Promise<{
  comments: Prisma.ArticleCommentGetPayload<{ include: Prisma.ArticleCommentInclude }>[],
  nextCursor: string | null
}>;

// --- 함수 오버로드 시그니처 정의 시작 ---

// 1. ProductComment를 조회할 때 (parentSelectField가 'name'일 경우)
export function findCommentsCommon(
  modelName: 'ProductComment',
  parentId: string,
  queryParams: Options,
  parentSelectField: 'name'
): Promise<{
  comments: Prisma.ProductCommentGetPayload<{ include: Prisma.ProductCommentInclude }>[],
  nextCursor: string | null
}>;

// 2. ArticleComment를 조회할 때 (parentSelectField가 'title'일 경우)
export function findCommentsCommon(
  modelName: 'ArticleComment',
  parentId: string,
  queryParams: Options,
  parentSelectField: 'title'
): Promise<{
  comments: Prisma.ArticleCommentGetPayload<{ include: Prisma.ArticleCommentInclude }>[],
  nextCursor: string | null
}>;

// --- 함수 오버로드 시그니처 정의 끝 ---

// 3. 실제 함수 구현 (implementation signature)
export async function findCommentsCommon(
  modelName: Prisma.ModelName,
  parentId: string,
  queryParams: Options,
  parentSelectField: ParentSelectField
): Promise<{
  comments: (Prisma.ProductCommentGetPayload<{ include: Prisma.ProductCommentInclude }> | Prisma.ArticleCommentGetPayload<{ include: Prisma.ArticleCommentInclude }>)[],
  nextCursor: string | null
}> {
  const model: any = (prisma as any)[modelName];
  const { parsedLimit, ...findManyOptions } = getCursorPaginationOptions(queryParams);

  let includeOptions: Prisma.ProductCommentInclude | Prisma.ArticleCommentInclude;

  if (parentSelectField === 'name') {
    includeOptions = getCommentIncludeOptions('name');
  } else {
    includeOptions = getCommentIncludeOptions('title');
  }

  const comments: (Prisma.ProductCommentGetPayload<{ include: Prisma.ProductCommentInclude }> | Prisma.ArticleCommentGetPayload<{ include: Prisma.ArticleCommentInclude }>)[] =
    await model.findMany({
      where: {
        [parentSelectField === 'name' ? 'productId' : 'articleId']: parentId
      },
      ...findManyOptions,
      include: includeOptions,
      orderBy: { createdAt: 'desc' },
    });

  const nextCursor = calculateNextCursor(comments, parsedLimit);
  return { comments, nextCursor };
}