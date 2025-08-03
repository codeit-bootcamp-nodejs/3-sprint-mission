import * as struct from 'superstruct'

export const createArticle = struct.object({
    title: struct.size(struct.string(), 1, 50),
    content: struct.optional(struct.size(struct.string(), 0, 2000)),
})

export const patchArticle = struct.partial(createArticle)
