import { beforeAll, beforeEach, afterAll, afterEach, describe, test, expect, jest } from '@jest/globals'
import request from 'supertest'
import { app } from '../src/config/app'
import { prisma } from '../src/config/prismaClient'
import MOCK from './testMock'
import { Product, ProductComment } from '@prisma/client'

beforeEach(async () => {
    // DB 삭제
    await prisma.user.deleteMany();
    await prisma.product.deleteMany();
    await prisma.productComment.deleteMany();
    // Mock 데이터 생성
    await prisma.user.createMany({
        data: MOCK.users
    })
    await prisma.product.createMany({
        data: MOCK.products
    })
    await prisma.productComment.createMany({
        data: MOCK.productComments
    })
})

afterAll(async () => {
    await prisma.$disconnect();
})

describe('[Product] 비회원 API 통합테스트', () => {
    const route = '/products'
    describe('/ 경로 테스트', () => {
        test('GET 상품 리스트', async () => {
            // 테스트 시작
            const res = await request(app).get(route)
            expect(res.status).toBe(200)
            expect(res.body[0].id).toEqual(MOCK.products[0].id)
        })
    })

    describe('/comment 경로 테스트', () => {
        test('GET 상품 댓글 리스트', async () => {
            // 테스트 시작
            const res = await request(app).get(route + '/comment')
            expect(res.status).toBe(200)
            expect(res.body.data[0].id).toEqual(MOCK.productComments[0].id)
        })
    })
})

describe('[Product] 인증 API 통합테스트', () => {
    const route = '/products'
    describe('/ 경로 테스트', () => {
        test('POST 상품 등록', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            // 생성 데이터
            const productDTO = {
                name: "상품 이름",
                description: "상품 설명",
                price: 500,
                tags: ['테스트 상품 생성']
            }

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 상품 생성 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.post(route).set('Authorization', `Bearer ${accessToken}`).send(productDTO)

            expect(res.status).toBe(201)
            // 자동 생성 값 외에 입력값이 제대로 들어갔는지 검증
            const { id, createdAt, updatedAt, userId, ...product } = res.body as Product
            expect(product).toEqual(productDTO)
        })
    })

    describe('/:id 경로 테스트', () => {
        test('GET 상품 조회', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            const productId = MOCK.products[0].id;

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 상품 조회 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.get(route + '/' + productId).set('Authorization', `Bearer ${accessToken}`)
            expect(res.status).toBe(200)
        })

        test('PATCH 상품 수정', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터, 수정할 데이터
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            const productId = MOCK.products[0].id;
            const patchData = {
                name: "수정된 상품 이름",
                description: "수정된 상품 설명",
            }

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 상품 수정 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.patch(route + '/' + productId).set('Authorization', `Bearer ${accessToken}`).send(patchData)
            expect(res.status).toBe(200)
            expect(res.body.name).toEqual(patchData.name)
        })

        test('DELETE 상품 삭제', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터, 수정할 데이터
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            const productId = MOCK.products[0].id;

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 상품 삭제 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.delete(route + '/' + productId).set('Authorization', `Bearer ${accessToken}`)
            expect(res.status).toBe(204)
        })
    })

    describe('/:id/like 경로 테스트', () => {
        test('POST 상품 좋아요', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, path파라미터:좋아요할 상품 아이디
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            const productId = MOCK.products[0].id;

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 상품 좋아요 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.post(route + '/' + productId + '/like').set('Authorization', `Bearer ${accessToken}`)

            // isLiked값이 true로 변경되었는지 검증
            expect(res.status).toBe(200)
            expect(res.body.isLiked).toBeTruthy()
        })
    })

    describe('/comment 경로 테스트', () => {
        test('POST 상품 댓글 등록', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            // 생성 데이터
            const productCommentDTO = {
                content: "댓글 내용",
                id: MOCK.products[0].id,
            }

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 댓글 생성 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.post(route + '/comment').set('Authorization', `Bearer ${accessToken}`).send(productCommentDTO)
            expect(res.status).toBe(201)
            // 자동 생성 값 외에 입력값이 제대로 들어갔는지 검증
            const { id, createdAt, updatedAt, userId, ...productComment } = res.body as ProductComment
            expect(userId).toEqual(MOCK.users[0].id)
            expect(productComment.productId).toEqual(productCommentDTO.id)
            expect(productComment.content).toEqual(productCommentDTO.content)
        })
    })

    describe('/comment/:id 경로 테스트', () => {
        test('PATCH 상품 댓글 수정', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터, 수정할 데이터
            const loginData = {
                email: MOCK.users[1].email,
                password: "password2"
            }
            const productCommentId = MOCK.productComments[0].id;
            const patchData = {
                content: "수정된 댓글 내용",
            }

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 댓글 수정 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.patch(route + '/comment/' + productCommentId).set('Authorization', `Bearer ${accessToken}`).send(patchData)
            expect(res.status).toBe(200)
            expect(res.body.content).toEqual(patchData.content)
        })

        test('DELETE 상품 댓글 삭제', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터, 수정할 데이터
            const loginData = {
                email: MOCK.users[1].email,
                password: "password2"
            }
            const productCommentId = MOCK.productComments[0].id;

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 댓글 삭제 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.delete(route + '/comment/' + productCommentId).set('Authorization', `Bearer ${accessToken}`)
            expect(res.status).toBe(204)
        })
    })

    describe('/liked 경로 테스트', () => {
        test('GET 좋아요 상품 리스트 조회', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 상품 좋아요 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const productId1 = MOCK.products[0].id
            const productId2 = MOCK.products[1].id
            await agent.post(route + '/' + productId1 + '/like').set('Authorization', `Bearer ${accessToken}`)
            await agent.post(route + '/' + productId2 + '/like').set('Authorization', `Bearer ${accessToken}`)

            // 상품 좋아요 조회 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.get(route + '/liked').set('Authorization', `Bearer ${accessToken}`)
            expect(res.status).toBe(200)
            // 좋아요 누른 상품들이 제대로 반환되었는지 검증
            const likedProduct1 = res.body.find((p: Product) => p.id === productId1)
            expect(likedProduct1).toBeDefined()
            const likedProduct2 = res.body.find((p: Product) => p.id === productId2)
            expect(likedProduct2).toBeDefined()
        })
    })
})