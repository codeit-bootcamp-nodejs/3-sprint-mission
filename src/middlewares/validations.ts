import { Request, Response, NextFunction } from 'express';
import { assert, Struct } from 'superstruct';
import {
    CreateArticleStruct, PatchArticleStruct,
    CreateProductStruct, PatchProductStruct,
    CreateCommentStruct, PatchCommentStruct,
    CreateUserStruct,
    GetUserStruct
} from '../prisma/structs';

function validateWithStruct<T>(struct: Struct<T, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            assert(req.body, struct);
            next();
        } catch (err: unknown) { // err: any
            // res.status(400).json({ error: err.message });
            res.status(400).json({ error: "Validation Failed" });
        }
    };
}

export default {
    createArticleValidation: validateWithStruct(CreateArticleStruct),
    patchArticleValidation: validateWithStruct(PatchArticleStruct),
    createProductValidation: validateWithStruct(CreateProductStruct),
    patchProductValidation: validateWithStruct(PatchProductStruct),
    createCommentValidation: validateWithStruct(CreateCommentStruct),
    patchCommentValidation: validateWithStruct(PatchCommentStruct),
    createUserValidation: validateWithStruct(CreateUserStruct),
    getUserValidation: validateWithStruct(GetUserStruct),
};

