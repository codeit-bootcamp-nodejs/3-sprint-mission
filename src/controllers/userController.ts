import { Request, Response, NextFunction } from 'express';
import { createUser, getUser, createToken, refreshingToken, getUserById, updateUser, updateUserPassword, getUsersProductList } from '../services/userServices.js'
import { ChangePasswordDto, CreateUserDto, filteredUser, UpdateUserDto } from '../../types/user.js';
import { Product } from '@prisma/client';
import { Message } from '../../types/express.js';

const userController = {
    postUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userBody: CreateUserDto = {
            email: req.body.email,
            nickname: req.body.nickname,
            password: req.body.password,
            image: req.body.image
        }
        const user: filteredUser = await createUser(userBody);
        res.status(201).json(user)
    },

    getUser: async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body
        try {
            const user: filteredUser = await getUser(email, password);
            const accessToken = createToken(user);
            const refreshToken = createToken(user, 'refresh')
            // 로그인시 DB에 새로운 refresh 토큰으로 업데이트
            await updateUser({ refreshToken }, user.id)

            // refresh 토큰은 쿠키로 전달
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, // JavaScript에서 접근 불가, 오직 HTTP(S) 프로토콜을 통해서만 쿠키를 전송할 수 있도록 제한
                sameSite: 'none', // 다른 도메인에서 쿠키 전송 허용
                secure: true // HTTPS 연결에서만 쿠키가 전송
            })

            return res.status(200).json({ accessToken })
        } catch (error) {
            throw error
        }
    },

    getUserWithToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId: number = req.user!.userId
        try {
            const user: filteredUser = await getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            throw error
        }
    },

    patchUser: async (req: Request, res: Response): Promise<void> => {
        const id: number = req.user!.userId;
        const userBody: UpdateUserDto = {
            nickname: req.body.nickname,
            image: req.body.image
        }
        const user: filteredUser = await updateUser(userBody, id);
        res.json(user)
    },

    patchUserPassword: async (req: Request, res: Response): Promise<void> => {
        const id: number = req.user!.userId;
        const userBody: ChangePasswordDto = {
            currentPassword: req.body.currentPassword,
            newPassword: req.body.newPassword,
        }
        const message: Message = await updateUserPassword(userBody, id);
        res.json(message)
    },

    getUsersProductList: async (req: Request, res: Response): Promise<void> => {
        if (!req.user) { // 유저 정의 안되어있을때 에러처리 or 비회원 기능
            throw new Error()
        }
        const id: number = req.user.userId;
        const productList: Product[] = await getUsersProductList(id);
        res.json(productList)
    },

    refreshAccessToken: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = req.cookies // 이 부분 질문? 구조 분해시 any로 될 수 밖에 없는것 같은데 타입을 명시하는 방법이 있는지
            const userId: number = req.auth!.userId // verifyRefreshToken으로 검사를 먼저 하니 무조건 있음
            const accessToken = await refreshingToken(userId, refreshToken)
            res.json({ accessToken })
        } catch (error) {
            next(error)
        }
    },
}

export default userController