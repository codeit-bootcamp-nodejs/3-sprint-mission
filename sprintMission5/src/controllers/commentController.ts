import { RequestHandler } from "express";
import { HttpError } from "../types/error";
import CommentService from "../services/commentService";
import { setBoardTypeByBaseUrl } from "../utils/boardTypeSet";
import { checkUser } from "../utils/checkUser";
import { COMMENT_ERROR } from "../constants/commentConstants";

/**
 * 게시글 댓글 목록 조회 요청 핸들러
 * @param req baseUrl에 따라 게시글 ID를 가져오고, 쿼리 파라미터로 cursor와 limit을 받습니다.
 * @param res 댓글 목록을 반환합니다.
 * @param next 에러 발생시 다음 미들웨어로 에러를 전달합니다.
 * 
 * @throws {HttpError} 댓글 목록 조회 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 게시글 ID는 baseUrl에 따라 'productId' 또는 'articleId'로 설정됩니다.
 * 쿼리 파라미터로 cursor와 limit을 받아 댓글 목록을 조회합니다.
 * status 500과 함께 댓글 목록 조회 중 오류가 발생했음을 나타냅니다.
 */

const getCommentList: RequestHandler = async (req, res, next) => {
  const id = { [setBoardTypeByBaseUrl(req.baseUrl)]: req.params.id };
  const { cursor, limit } = req.query;
  const typeCursor = cursor ? String(cursor) : null;
  const parsedLimit = parseInt(limit ? String(limit) : '10');

  try {
    const comments = await CommentService.getCommentList(
      id,
      typeCursor,
      parsedLimit,
    );
    res.json(comments);
  } catch (error) {
    next(new HttpError(COMMENT_ERROR.GET_COMMENT_LIST_ERROR, 500));
  }
};

/**
 * 게시글 댓글 생성 요청 핸들러
 * @param req 댓글 생성에 필요한 데이터와 사용자 정보를 포함합니다.
 * @param res 생성된 댓글 정보를 반환합니다.
 * @param next 에러 발생시 다음 미들웨어로 에러를 전달합니다.
 *
 * @throws {HttpError} 댓글 생성 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 사용자 ID는 토큰에서 가져오며, 댓글 내용은 요청 본문에서 가져옵니다.
 * 게시글 ID는 baseUrl에 따라 'productId' 또는 'articleId'로 설정됩니다.
 * status 201과 함께 생성된 댓글 정보를 반환합니다.
 * status 401은 유저 아이디가 없을 경우 에러 메시지를 반환합니다.
 * status 404은 유저가 존재하지 않을 경우 에러 메시지를 반환합니다.
 * status 400은 baseUrl이 유효하지 않거나 지원하지 않는 경우 에러 메시지를 반환합니다.
 * status 500과 함께 댓글 생성 중 오류가 발생했음을 나타냅니다.
 */
const createComment: RequestHandler = async (req, res, next) => {
  const userId = req.user?.userId;
  const user = await checkUser(userId);
  const data = { content: req.body.content, userId: user.id };
  const id = { [setBoardTypeByBaseUrl(req.baseUrl)]: req.params.id };
  try {
    const comment = await CommentService.createComment(id, data);
    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof HttpError) {
      next(error);
    } else {
      next(new HttpError(COMMENT_ERROR.CREATE_COMMENT_ERROR, 500));
    }
  }
};

/**
 * 게시글 댓글 수정 요청 핸들러
 * @param req 댓글 ID를 URL 파라미터로 받고, 수정할 댓글 내용을 요청 본문으로 받습니다.
 * @param res 수정된 댓글 정보를 반환합니다.
 * @param next 에러 발생시 다음 미들웨어로 에러를 전달합니다.
 *
 * @throws {HttpError} 댓글 수정 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 댓글 ID는 URL 파라미터에서 가져오며, 수정할 댓글 내용은 요청 본문에서 가져옵니다.
 * status 200과 함께 수정된 댓글 정보를 반환합니다.
 * status 404은 댓글이 존재하지 않을 경우 에러 메시지를 반환합니다.
 * status 500과 함께 댓글 수정 중 오류가 발생했음을 나타냅니다.
 */

const patchComment: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const comment = await CommentService.patchComment(id, req.body);
    res.json(comment);
  } catch (error) {
    next(new HttpError(COMMENT_ERROR.PATCH_COMMENT_ERROR, 500));
  }
};

/**
 * 게시글 댓글 삭제 요청 핸들러
 * @param req 댓글 ID를 URL 파라미터로 받습니다.
 * @param res 성공적으로 삭제되었음을 나타냅니다.
 * @param next 에러 발생시 다음 미들웨어로 에러를 전달합니다.
 *
 * @throws {HttpError} 댓글 삭제 중 에러 발생 시, 에러 메시지와 상태 코드를 포함하여 next로 전달합니다.
 * 댓글 ID는 URL 파라미터에서 가져옵니다.
 * status 204와 함께 성공적으로 삭제되었음을 나타냅니다.
 * status 404은 댓글이 존재하지 않을 경우 에러 메시지를 반환합니다.
 * status 500과 함께 댓글 삭제 중 오류가 발생했음을 나타냅니다.
 */
const deleteComment: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    await CommentService.deleteComment(id);
    res.sendStatus(204);
  } catch (error) {
    next(new HttpError(COMMENT_ERROR.DELETE_COMMENT_ERROR, 500));
  }
};

export default {
  getCommentList,
  createComment,
  patchComment,
  deleteComment
}