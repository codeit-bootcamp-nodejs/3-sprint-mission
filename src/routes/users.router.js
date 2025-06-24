
import express from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import {
  createUser,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser
} from '../services/users.service.js';
import {
  validate,
  createUserSchema,
  getByIdSchema,
  updateUserSchema
} from '../middlewares/validation.middleware.js';

const userrouter = express.Router();

userrouter.route('/')
  .post(
    validate(createUserSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { username, email, address } = req.body;
      const newUser = await createUser(username, email, address);

      res.status(201).json({
        message: '회원가입이 성공적으로 완료되었습니다.',
        user: newUser,
      });
    }))
  .get(
    asyncHandler(async (req, res, next) => {
      const users = await findAllUsers();
      res.status(200).json({
        message: '검색하신 회원목록입니다.',
        data: users,
      });
    })
  );

userrouter.route('/:id')
  .get(
    validate(getByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const user = await findUserById(id);
      res.status(200).json({
        message: '검색하신 회원입니다.',
        data: user,
      });
    })
  )
  .patch(
    validate(getByIdSchema, 'params'),
    validate(updateUserSchema, 'body'),
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      const updateData = req.body;

      const updatedUser = await updateUser(id, updateData);

      res.status(200).json({
        message: '회원 정보가 성공적으로 업데이트되었습니다.',
        data: updatedUser,
      });
    })
  )
  .delete(
    validate(getByIdSchema, 'params'),
    asyncHandler(async (req, res, next) => {
      const { id } = req.params;
      await deleteUser(id);
      res.status(204).end();
    })
  );

export default userrouter;