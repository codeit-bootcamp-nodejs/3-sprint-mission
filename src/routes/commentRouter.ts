import { Router } from "express";
import auth from "../middlewares/auth";
import { validateCreateComment, validatePatchComment } from "../middlewares/validateComment";
import CommentController from "../controllers/commentController";

export const productCommentRouter = Router();
export const freeCommentRouter = Router();

productCommentRouter.route('/product/:id')
  .get(CommentController.getCommentList)
  .post(validateCreateComment, auth.verifyAccessToken, CommentController.createComment);
productCommentRouter.route('/comment/:id')
  .patch(validatePatchComment, auth.verifyAccessToken, auth.authCommentVerifyAuth, CommentController.patchComment)
  .delete(auth.verifyAccessToken, auth.authCommentVerifyAuth, CommentController.deleteComment);

freeCommentRouter.route('/article/:id')
  .get(CommentController.getCommentList)
  .post(validateCreateComment, auth.verifyAccessToken, CommentController.createComment)
freeCommentRouter.route('/comment/:id')
  .patch(validatePatchComment, auth.verifyAccessToken, auth.authCommentVerifyAuth, CommentController.patchComment)
  .delete(auth.verifyAccessToken, auth.authCommentVerifyAuth, CommentController.deleteComment);



