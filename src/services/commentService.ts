import CommentRepo from '../repositories/commentRepository';
import {
  BoardTypeDto,
  CommentDto,
  CreateCommentDto,
  PatchCommentDto
} from '../types/comment';

const getCommentList = async (id: BoardTypeDto, cursor: string | null, limit: number = 10): Promise<CommentDto[]> => {
  return CommentRepo.getCommentList(id, cursor, limit);
}

const createComment = async (id: BoardTypeDto, data: CreateCommentDto): Promise<CommentDto> => {
  return CommentRepo.createComment(id, data);
};

const getComment = async (id: string): Promise<CommentDto> => {
  return CommentRepo.getComment(id);
};

const patchComment = async (id: string, data: PatchCommentDto): Promise<CommentDto> => {
  return CommentRepo.patchComment(id, data);
};

const deleteComment = async (id: string): Promise<void> => {
  await CommentRepo.deleteComment(id);
};

export default {
  getCommentList,
  createComment,
  getComment,
  patchComment,
  deleteComment
};