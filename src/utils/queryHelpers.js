import { PrismaClient } from '@prisma/client';

const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export const getPaginationParams = (query) => {
  const skip = parseInt(query.offset) || 0;
  const take = parseInt(query.limit) || 10;
  return { skip, take };
};

export const getSortParams = (query, defaultSortField = 'createdAt') => {
  const { sort } = query;
  const order = sort === 'recent' ? 'desc' : 'asc';

  return {
    [defaultSortField]: order,
  };
};

export const getSearchParams = (search, fields) => {
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

export const getCursorPaginationOptions = ({ cursor, limit }) => {
  const parsedLimit = parseInt(limit, 10) || 10
  const options = {
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

export const calculateNextCursor = (items, parsedLimit) => {
  if (items.length === parsedLimit) {
    return items[items.length - 1].id;
  }
  return null;
};

export const checkCommentOwnership = async (commentId, usersId, modelName) => {
  const model = prisma[modelName];
  if (!model) {
    const error = new Error(`Invalid model name provided: ${modelName}`);
    error.statusCode = 500;
    throw error;
  }

  const comment = await model.findUnique({ where: { id: commentId } });

  if (!comment) {
    const error = new Error('댓글을 찾을 수 없습니다.');
    error.statusCode = 404;
    throw error;
  }

  if (comment.usersId !== usersId) {
    const error = new Error('댓글을 수정/삭제할 권한이 없습니다.');
    error.statusCode = 403;
    throw error;
  }

  return comment;
};

export const prepareCommentCreateData = ({ parentId, usersId, content }, parentModelName) => {
  const data = {
    content: content,
    [parentModelName === 'Product' ? 'product' : 'article']: {
      connect: {
        id: parentId,
      },
    },
  };

  if (usersId) {
    data.user = {
      connect: {
        id: usersId,
      },
    };
  }
  return data;
};

export const getCommentIncludeOptions = (parentSelectField) => ({
  user: {
    select: {
      username: true
    }
  },
  [parentSelectField === 'name' ? 'product' : 'article']: {
    select: {
      [parentSelectField]: true
    }
  }
});

export const findCommentsCommon = async (modelName, parentId, queryParams, parentSelectField) => {
  const model = prisma[modelName];
  const { parsedLimit, ...findManyOptions } = getCursorPaginationOptions(queryParams);

  const comments = await model.findMany({
    where: {
      [parentSelectField === 'name' ? 'productsId' : 'articlesId']: parentId
    },
    ...findManyOptions,
    include: getCommentIncludeOptions(parentSelectField),
    orderBy: { createdAt: 'desc' },
  });

  const nextCursor = calculateNextCursor(comments, parsedLimit);
  return { comments, nextCursor };
};

export function asyncHandler(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res, next);
    } catch (e) {
      next(e);
    }
  };
}