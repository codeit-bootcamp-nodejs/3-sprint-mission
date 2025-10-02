import dotenv from 'dotenv'

// NODE_ENV=test 이면 .env.test, 아니면 기본 .env 불러오기
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'development'}` })

import { PrismaClient } from '@prisma/client'

export const prismaClient = new PrismaClient()
