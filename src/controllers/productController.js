import * as productService from '../services/productService.js';
import { isTargetLiked } from '../services/likeService.js';

export const createProducts = async (req, res, next) => {
  try {
    const product = await productService.createProduct({
      ...req.body,
      userId: req.user.id,
    });
    return res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const listProducts = async (req, res, next) => {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || '';

    const products = await productService.getProductList(offset, limit, search);
    return res.status(200).json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await productService.getProductById(Number(req.params.id));
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const userId = req.user?.id;
    const isLiked = userId ? await isTargetLiked(userId, product.id, 'product') : false;

    return res.status(200).json({ ...product, isLiked });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const updated = await productService.updateProduct(id, userId, req.body);
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const userId = req.user.id;

    const deleted = await productService.deleteProduct(id, userId);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};