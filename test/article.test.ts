import { beforeAll, beforeEach, afterAll, afterEach, describe, test, expect, jest } from '@jest/globals'
import request from 'supertest'
import { app } from '../src/config/app'
import { prisma } from '../src/config/prismaClient'
import { Article, ArticleComment } from '@prisma/client'
import MOCK from './testMock'

beforeEach(async () => {
    // DB 삭제
    await prisma.user.deleteMany();
    await prisma.article.deleteMany();
    await prisma.articleComment.deleteMany();
    // Mock 데이터 생성
    await prisma.user.createMany({
        data: MOCK.users
    })
    await prisma.article.createMany({
        data: MOCK.articles
    })
    await prisma.articleComment.createMany({
        data: MOCK.articleComments
    })
})

afterAll(async () => {
    await prisma.$disconnect();
})

describe('[Article] 비회원 API 통합테스트', () => {
    const route = '/articles'
    describe('/ 경로 테스트', () => {
        test('GET 게시글 리스트', async () => {
            // 테스트 시작
            const res = await request(app).get(route)
            expect(res.status).toBe(200)
            expect(res.body[0].id).toEqual(MOCK.articles[0].id)
        })
    })

    describe('/comment 경로 테스트', () => {
        test('GET 게시글 댓글 리스트', async () => {
            // 테스트 시작
            const res = await request(app).get(route + '/comment')
            expect(res.status).toBe(200)
            expect(res.body.data[0].id).toEqual(MOCK.articleComments[0].id)
        })
    })
})

describe('[Article] 인증 API 통합테스트', () => {
    const route = '/articles'
    describe('/ 경로 테스트', () => {
        test('POST 게시글 등록', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            // 생성 데이터
            const articleDTO = {
                title: "게시글 제목",
                content: "게시글 내용",
            }

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 게시글 생성 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.post(route).set('Authorization', `Bearer ${accessToken}`).send(articleDTO)

            expect(res.status).toBe(201)
            // 자동 생성 값 외에 입력값이 제대로 들어갔는지 검증
            const { id, createdAt, updatedAt, userId, ...article } = res.body as Article
            expect(article).toEqual(articleDTO)
        })
    })

    describe('/:id 경로 테스트', () => {
        test('GET 게시글 조회', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            const articleId = MOCK.articles[0].id;

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 게시글 조회 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.get(route + '/' + articleId).set('Authorization', `Bearer ${accessToken}`)
            expect(res.status).toBe(200)
        })

        test('PATCH 게시글 수정', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터, 수정할 데이터
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            const articleId = MOCK.articles[0].id;
            const patchData = {
                title: "수정된 게시글 제목",
                content: "수정된 게시글 내용",
            }

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 게시글 수정 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.patch(route + '/' + articleId).set('Authorization', `Bearer ${accessToken}`).send(patchData)
            expect(res.status).toBe(200)
            expect(res.body.title).toEqual(patchData.title)
        })

        test('DELETE 게시글 삭제', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터, 수정할 데이터
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            const articleId = MOCK.articles[0].id;

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 게시글 삭제 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.delete(route + '/' + articleId).set('Authorization', `Bearer ${accessToken}`)
            expect(res.status).toBe(204)
        })
    })

    describe('/:id/like 경로 테스트', () => {
        test('POST 게시글 좋아요', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, path파라미터:좋아요할 게시글 아이디
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            const articleId = MOCK.articles[0].id;

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 게시글 좋아요 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.post(route + '/' + articleId + '/like').set('Authorization', `Bearer ${accessToken}`)

            // isLiked값이 true로 변경되었는지 검증
            expect(res.status).toBe(200)
            expect(res.body.isLiked).toBeTruthy()
        })
    })

    describe('/comment 경로 테스트', () => {
        test('POST 게시글 댓글 등록', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보
            const loginData = {
                email: MOCK.users[0].email,
                password: "password1"
            }
            // 생성 데이터
            const articleCommentDTO = {
                content: "댓글 내용",
                id: MOCK.articles[0].id,
            }

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
           
            // 댓글 생성 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.post(route + '/comment').set('Authorization', `Bearer ${accessToken}`).send(articleCommentDTO)
            expect(res.status).toBe(201)
            // 자동 생성 값 외에 입력값이 제대로 들어갔는지 검증
            const { id, createdAt, updatedAt, userId, ...articleComment } = res.body as ArticleComment
            expect(userId).toEqual(MOCK.users[0].id)
            expect(articleComment.articleId).toEqual(articleCommentDTO.id)
            expect(articleComment.content).toEqual(articleCommentDTO.content)
        })
    })

    describe('/comment/:id 경로 테스트', () => {
        test('PATCH 게시글 댓글 수정', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터, 수정할 데이터
            const loginData = {
                email: MOCK.users[1].email,
                password: "password2"
            }
            const articleCommentId = MOCK.articleComments[0].id;
            const patchData = {
                content: "수정된 댓글 내용",
            }

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 댓글 수정 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.patch(route + '/comment/' + articleCommentId).set('Authorization', `Bearer ${accessToken}`).send(patchData)
            expect(res.status).toBe(200)
            expect(res.body.content).toEqual(patchData.content)
        })

        test('DELETE 게시글 댓글 삭제', async () => {
            // 초기 셋팅 필요 - 로그인할 회원 정보, 전달 받은 패스 파라미터, 수정할 데이터
            const loginData = {
                email: MOCK.users[1].email,
                password: "password2"
            }
            const articleCommentId = MOCK.articleComments[0].id;

            const agent = request.agent(app);
            // 로그인 필요       
            const loginRes = await agent.post('/users/login').send(loginData)
            const { accessToken } = loginRes.body;
            // 댓글 삭제 요청
            // 로그인시 전달받은 액세스 토큰을 Bearer Token에다가 설정해주어야 함
            const res = await agent.delete(route + '/comment/' + articleCommentId).set('Authorization', `Bearer ${accessToken}`)
            expect(res.status).toBe(204)
        })
    })
})