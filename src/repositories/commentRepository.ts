import prisma from '../config/prisma';
import {
  BoardTypeDto,
  CommentDto,
  CreateCommentDto,
  PatchCommentDto
} from '../types/comment';
import { HttpError } from '../types/error';

const CommentService = {
  async getCommentList(id: BoardTypeDto, cursor: string | null, limit: number = 10): Promise<CommentDto[]> {
    return await prisma.comment.findMany({
      take: limit,
      ...(cursor && {
        cursor: { id: cursor }, skip: 1,
      }),
      where: {
        ...id
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
      }
    })
  },

  async createComment(id: BoardTypeDto, data: CreateCommentDto): Promise<CommentDto> {
    return await prisma.comment.create({
      data: {
        content: data.content,
        userId: data.userId,
        ...id,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
      }
    })
  },

  async getComment(id: string): Promise<CommentDto> {
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
      }
    });
    if (!comment) {
      throw new HttpError('존재하지 않는 댓글입니다.', 404);
    }
    return comment;
  },

  async patchComment(id: string, data: PatchCommentDto): Promise<CommentDto> {
    return await prisma.comment.update({
      where: { id },
      data: {
        content: data.content,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
      }
    })
  },

  async deleteComment(id: string): Promise<void> {
    await prisma.comment.delete({
      where: { id },
    })
  },
}

export default CommentService;