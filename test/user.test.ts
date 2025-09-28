import { beforeEach, afterAll, describe, test, expect, jest } from '@jest/globals'
import request from 'supertest'
import { app } from '../src/config/app'
import { prisma } from '../src/config/prismaClient'
import { hashPassword } from '../src/utils/passwordHash'

beforeEach(async () => {
	await prisma.user.deleteMany();
})

afterAll(async () => {
	await prisma.$disconnect();
})

describe('[User] 통합테스트', () => {
	const route = '/users'
	test('회원가입 테스트', async () => {
		const signUpDTO = {
			email: 'signIn@gmail.com',
			nickname: '회원가입',
			password: 'password',
		}
		const res = await request(app).post(route + '/sign-up').send(signUpDTO)
		expect(res.status).toBe(201);
		expect(res.body.email).toEqual('signIn@gmail.com')
		expect(res.body.nickname).toEqual('회원가입')
	})

	test('로그인 테스트', async () => {
		// 초기 데이터 셋팅
		await prisma.user.create({
			data: {
				email: 'login@gmail.com',
				nickname: '로그인',
				password: hashPassword('password'),
				image: [],
			}
		})
		// 테스트 시작
		const agent = request.agent(app)
		const res = await agent.post(route + '/login').send({
			email: 'login@gmail.com',
			password: 'password',
		})
		expect(res.status).toBe(200)
		expect(res.body).toHaveProperty('accessToken')
	})
})