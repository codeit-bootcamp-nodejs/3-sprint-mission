import { Product, User } from '@prisma/client';
import { prisma } from '../config/prismaClient.js';
import { UpdateUserDto } from '../types/user.js';

class UserRepository {
    save = async (email: string, nickname: string, password: string, image: string[]): Promise<User> => {
        const user: User = await prisma.user.create({
            data: {
                email,
                nickname,
                password,
                image,
            }
        })
        return user;
    };

    findByEmail = async (email: string): Promise<User> => {
        const user: User = await prisma.user.findUniqueOrThrow({
            where: { email }
        })

        return user;
    };

    findById = async (id: number): Promise<User> => {
        const user: User = await prisma.user.findUniqueOrThrow({
            where: { id }
        })

        return user;
    };

    update = async (data: UpdateUserDto, id: number): Promise<User> => {
        const updatedUser: User = await prisma.user.update({
            where: {
                id,
            },
            data: data,
        });
        return updatedUser;
    }

    updatePassword = async (password: string, id: number): Promise<User> => {
        const updatedUser: User = await prisma.user.update({
            where: {
                id,
            },
            data: {
                password,
            },
        });
        return updatedUser;
    }

    getProductListById = async (id: number): Promise<Product[]> => {
        const productList = await prisma.user.findUniqueOrThrow({
            where: {
                id,
            },
            select: {
                Product: true
            }
        });
        return productList.Product;
    }
};

export default new UserRepository();