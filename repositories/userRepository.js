import { prisma } from '../config/prismaClient.js';

class UserRepository {
    save = async (email, nickname, password, image) => {
        const user = await prisma.user.create({
            data: {
                email,
                nickname,
                password,
                image,
            }
        })
        return user;
    };

    findByEmail = async (email) => {
        const user = await prisma.user.findUnique({
            where: { email }
        })

        return user;
    };

    findById = async (id) => {
        const user = await prisma.user.findUnique({
            where: { id }
        })

        return user;
    };

    update = async (data, id) => {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: data,
        });
        return updatedUser;
    }

    updatePassword = async (password, id) => {
        const updatedUser = await prisma.user.update({
            where: {
                id,
            },
            data: {
                password,
            },
        });
        return updatedUser;
    }

    getProductListById = async (id) => {
        const productList = await prisma.user.findMany({
            where: {
                id,
            },
            select: {
                Product: true
            }
        });
        return productList;
    }
};

export default new UserRepository();