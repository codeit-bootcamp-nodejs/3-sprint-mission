import * as struct from 'superstruct'
import isUuid from 'is-uuid'
import isEmail from 'is-email'

const Email = struct.define<string>('Email', (value) => {
    if (typeof value !== 'string') return false;
    return isEmail(value);
});

const Uuid = struct.define<string>('Uuid', (value) => {
    if (typeof value !== 'string') return false;
    return isUuid.v4(value);
});

export const CreateProductStruct = struct.object({
    name: struct.size(struct.string(), 1, 50),
    description: struct.size(struct.string(), 0, 500),
    price: struct.min(struct.integer(), 0),
    tags: struct.size(struct.array(struct.string()), 0, 5), // 태그는 최대 5개까지
})

export const PatchProductStruct = struct.partial(CreateProductStruct)


export const CreateArticleStruct = struct.object({
    title: struct.size(struct.string(), 1, 50),
    content: struct.size(struct.string(), 1, 500),
})

export const PatchArticleStruct = struct.partial(CreateArticleStruct)

export const CreateCommentStruct = struct.object({
    id : Uuid,
    content: struct.size(struct.string(), 1, 500),
})

export const PatchCommentStruct = struct.partial(CreateCommentStruct)

export const CreateUserStruct = struct.object({
    email: Email,
    nickname: struct.size(struct.string(), 3, 50),
    password: struct.size(struct.string(), 8, 50), //8자 이상 50자 미만
})

export const GetUserStruct = struct.object({
    email: Email,
    password: struct.size(struct.string(), 8, 50), //8자 이상 50자 미만
})
