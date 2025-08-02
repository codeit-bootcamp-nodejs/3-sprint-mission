interface createProductCommentArg {
  productId: string;
  userId: string;
  content: string;
}

interface findAllProductCommentsArg {
  productId: string;
  cursor?: string;
  limit?: string;
}

interface updateProductCommentArg {
  content: string;
  userId: string;
}

export { updateProductCommentArg, findAllProductCommentsArg, createProductCommentArg }