import { assert } from 'superstruct';
import {
    CreateArticleStruct, PatchArticleStruct,
    CreateProductStruct, PatchProductStruct,
    CreateCommentStruct, PatchCommentStruct,
    CreateUserStruct,
    GetUserStruct
} from '../prisma/structs.js'

function validateWithStruct(struct) {
    return function (req, res, next) {
        try {
            assert(req.body, struct);
            next();
        } catch (err) {
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

