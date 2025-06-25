import * as dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import productRouter from './routes/product.js';
import articleRouter from './routes/article.js';
import { PrismaClient, Prisma } from '@prisma/client';
import { assert, create } from 'superstruct';
import {
  Product,
  Article
} from './structs.js'

dotenv.config() //env 파일에 정의된 환경변수를 불러와 사용할 수 있게 해주는 명령어

const prisma = new PrismaClient();
const app = express()

app.use(cors())
app.use(express.json())
app.use('/products', productRouter)
app.use('/articles', articleRouter)


app.listen(3000, () => console.log('Server is listening on port 3000'))