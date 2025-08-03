import * as struct from 'superstruct'

export const createProduct = struct.object({
    name: struct.size(struct.string(), 1, 20),
    description: struct.optional(struct.size(struct.string(), 0, 300)),
    price: struct.refine(struct.number(), 'minMax', value => value >= 10 && value <= 100000000),
    tags: struct.optional(struct.array(struct.size(struct.string(), 1, 20))),
})

export const patchProduct = struct.partial(createProduct);