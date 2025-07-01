import { assert } from 'superstruct';
import { CreateArticleStruct, PatchArticleStruct, CreateProductStruct, PatchProductStruct, CreateCommentStruct, PatchCommentStruct } from '../prisma/structs.js'

function createArticleValidation(req, res, next){
    assert(req.body, CreateArticleStruct);
    next();
}

function patchArticleValidation(req, res, next){
    assert(req.body, PatchArticleStruct);
    next();
}

function createProductValidation(req, res, next){
    assert(req.body, CreateProductStruct);
    next();
}

function patchProductValidation(req, res, next){
    assert(req.body, PatchProductStruct);
    next();
}

function createCommentValidation(req, res, next){
    assert(req.body, CreateCommentStruct);
    next();
}

function patchCommentValidation(req, res, next){
    assert(req.body, PatchCommentStruct);
    next();
}

export default {
    createArticleValidation, patchArticleValidation, 
    createProductValidation, patchProductValidation, 
    createCommentValidation, patchCommentValidation
}