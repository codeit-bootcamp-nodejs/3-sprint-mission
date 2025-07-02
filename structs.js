//데이터 유효성 검사
import * as s from 'superstruct';

export const Product = s.object({
  name: s.size(s.string(),1,30),
  description: s.string(),
  price: s.min(s.number(),0),
  tags: s.optional(s.array(s.string())),
  quantity: s.number()
})

export const Article = s.object({
  title: s.size(s.string(),1,30),
  content: s.string(),
})

export const Comment = s.object({
  content: s.size(s.string(), 1, 500)
})