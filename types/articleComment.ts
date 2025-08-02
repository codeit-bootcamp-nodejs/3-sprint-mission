interface FindAllCommentsArgs {
  articleId: string;
  cursor?: string;
  limit?: string;
}

interface UpdateCommentArgs {
  content?: string;
  userId: string;
}

interface CreateCommentArgs {
  articleId: string;
  content: string;
  userId: string;
}

export { CreateCommentArgs, UpdateCommentArgs, FindAllCommentsArgs }