import { createUser, getUser, createToken, refreshingToken, getUserById, updateUser, updateUserPassword, getUsersProductList } from '../services/userServices.js'

const userController = {
    postUser: async (req, res, next) => {
        const userBody = {
            email: req.body.email,
            nickname: req.body.nickname,
            password: req.body.password,
            image: req.body.image
        }
        const user = await createUser(userBody);
        res.status(201).json(user)
    },

    getUser: async (req, res, next) => {
        const { email, password } = req.body
        try {
            const user = await getUser(email, password);
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

    getUserWithToken: async (req, res, next) => {
        const userId = req.user.userId
        try {
            const user = await getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            throw error
        }
    },

    patchUser: async (req, res) => {
        const id = req.user.userId;
        const userBody = {
            nickname: req.body.nickname,
            image: req.body.image
        }
        const user = await updateUser(userBody, id);
        res.json(user)
    },

    patchUserPassword: async (req, res) => {
        const id = req.user.userId;
        const userBody = {
            currentPassword: req.body.currentPassword,
            newPassword: req.body.newPassword,
        }
        const message = await updateUserPassword(userBody, id);
        res.json(message)
    },

    getUsersProductList: async (req, res) => {
        const id = req.user.userId;
        const productList = await getUsersProductList(id);
        res.json(productList)
    },

    refreshAccessToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies
            const { userId } = req.auth
            const accessToken = await refreshingToken(userId, refreshToken)
            res.json({ accessToken })
        } catch (error) {
            next(error)
        }
    },
}

export default userController