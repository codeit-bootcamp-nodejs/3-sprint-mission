import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';
import { HttpError } from "./errors";

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
  userId: string,
  modelName: 'ProductComment' | 'ArticleComment'  // 사용 가능한 모델 제한
): Promise<void> => {
  let comment: { userId: string } | null = null;

  if (modelName === 'ProductComment') {
    comment = await prisma.productComment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });
  } else if (modelName === 'ArticleComment') {
    comment = await prisma.articleComment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });
  }

  if (!comment) {
    throw new Prisma.PrismaClientKnownRequestError('댓글을 찾을 수 없습니다.', {
      code: 'P2025',
      meta: { modelName: modelName, cause: 'record not found' },
      clientVersion: '5.22.0',
    });
  }

  if (comment.userId !== userId) {
    const error = new HttpError('댓글을 수정/삭제할 권한이 없습니다.', 403);
    throw error;
  }
};

export const checkProductOwnership = async (
  productId: string,
  userId: string
): Promise<void> => {
  const product: Prisma.ProductGetPayload<{ select: { userId: true } }> | null =
    await prisma.product.findUnique({
      where: { id: productId },
      select: { userId: true },
    });

  if (!product) {
    throw new Prisma.PrismaClientKnownRequestError('상품을 찾을 수 없습니다.', {
      code: 'P2025',
      meta: { modelName: 'Product', cause: 'record not found' },
      clientVersion: '5.22.0',
    });
  }

  if (product.userId !== userId) {
    const error = new HttpError('상품을 수정하거나 삭제할 권한이 없습니다.', 403);
    throw error;
  }
};

export const checkArticleOwnership = async (
  articleId: string,
  userId: string
): Promise<void> => {
  const article: Prisma.ArticleGetPayload<{ select: { userId: true } }> | null =
    await prisma.article.findUnique({
      where: { id: articleId },
      select: { userId: true },
    });

  if (!article) {
    throw new Prisma.PrismaClientKnownRequestError('게시글을 찾을 수 없습니다.', {
      code: 'P2025',
      meta: { modelName: 'Article', cause: 'record not found' },
      clientVersion: '5.22.0',
    });
  }

  if (article.userId !== userId) {
    const error = new HttpError('게시글을 수정하거나 삭제할 권한이 없습니다.', 403);
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
  const baseData = {
    content: content,
    user: {
      connect: {
        id: userId,
      },
    },
  };

  if (parentModelName === 'product') {
    return {
      ...baseData,
      product: {
        connect: {
          id: parentId,
        },
      },
    };
  } else {
    return {
      ...baseData,
      article: {
        connect: {
          id: parentId,
        },
      },
    };
  }
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
  const baseIncludeOptions = {
    user: {
      select: {
        username: true
      }
    }
  };

  if (parentSelectField === 'name') {
    return {
      ...baseIncludeOptions,
      product: {
        select: {
          name: true
        }
      }
    };
  } else { // 'title'일 경우
    return {
      ...baseIncludeOptions,
      article: {
        select: {
          title: true
        }
      }
    };
  }
}


type CommentModelNameForFind = 'ProductComment' | 'ArticleComment';

// --- findCommentsCommon 함수 오버로드 시그니처 정의 시작 ---
export function findCommentsCommon(
  modelName: 'ProductComment',
  parentId: string,
  queryParams: Options,
  parentSelectField: 'name'
): Promise<{
  comments: Prisma.ProductCommentGetPayload<{ include: Prisma.ProductCommentInclude }>[],
  nextCursor: string | null
}>;

export function findCommentsCommon(
  modelName: 'ArticleComment',
  parentId: string,
  queryParams: Options,
  parentSelectField: 'title'
): Promise<{
  comments: Prisma.ArticleCommentGetPayload<{ include: Prisma.ArticleCommentInclude }>[],
  nextCursor: string | null
}>;
// --- findCommentsCommon 함수 오버로드 시그니처 정의 끝 ---

export async function findCommentsCommon(
  modelName: CommentModelNameForFind,
  parentId: string,
  queryParams: Options,
  parentSelectField: ParentSelectField
): Promise<{
  comments: (
    Prisma.ProductCommentGetPayload<{ include: Prisma.ProductCommentInclude }> |
    Prisma.ArticleCommentGetPayload<{ include: Prisma.ArticleCommentInclude }>
  )[],
  nextCursor: string | null
}> {
  const { parsedLimit, ...findManyOptions } = getCursorPaginationOptions(queryParams);

  let includeOptions:
    Prisma.ProductCommentInclude |
    Prisma.ArticleCommentInclude;

  if (parentSelectField === 'name') {
    includeOptions = getCommentIncludeOptions('name');
  } else {
    includeOptions = getCommentIncludeOptions('title');
  }

  let commentsResult:
    Prisma.ProductCommentGetPayload<{ include: Prisma.ProductCommentInclude }>[] |
    Prisma.ArticleCommentGetPayload<{ include: Prisma.ArticleCommentInclude }>[] = [];

  if (modelName === 'ProductComment') {
    commentsResult = await prisma.productComment.findMany({
      where: {
        productId: parentId
      },
      ...findManyOptions,
      include: includeOptions as Prisma.ProductCommentInclude,
      orderBy: { createdAt: 'desc' },
    });
  } else if (modelName === 'ArticleComment') {
    commentsResult = await prisma.articleComment.findMany({
      where: {
        articleId: parentId
      },
      ...findManyOptions,
      include: includeOptions as Prisma.ArticleCommentInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  const nextCursor = calculateNextCursor(commentsResult as Array<{ id: string }>, parsedLimit);
  return {
    comments: commentsResult as (
      Prisma.ProductCommentGetPayload<{ include: Prisma.ProductCommentInclude }> |
      Prisma.ArticleCommentGetPayload<{ include: Prisma.ArticleCommentInclude }>
    )[], nextCursor
  }
}