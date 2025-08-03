import * as struct from 'superstruct';

export const createComment = struct.object({
    content: struct.size(struct.string(), 1, 300),
});

export const patchComment = struct.partial(createComment);