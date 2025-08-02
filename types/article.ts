interface findAllArticlesArg {
  offset?: string;
  limit?: string;
  sort?: string;
  search?: string;
}

interface createArticleArg {
  title: string
  content: string
  userId: string
  imageUrl?: string | null
}

export { createArticleArg, findAllArticlesArg }