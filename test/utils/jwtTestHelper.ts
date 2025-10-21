import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export interface TestUser {
  id: string;
  email: string;
  nickname: string;
  password: string;
}

// 테스트 유저들을 데이터베이스에 생성
export const createTestUsers = async () => {
  try {
    const saltRounds = 10;
    
    // 기존 테스트 유저들 먼저 삭제
    const testEmails = Object.values(testUsers).map(user => user.email);
    await prisma.user.deleteMany({
      where: {
        email: {
          in: testEmails
        }
      }
    });
    
    for (const user of Object.values(testUsers)) {
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      
      const createdUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          password: hashedPassword
        }
      });
      
      console.log(`유저 생성됨:`, createdUser.id, createdUser.email);
    }
    
    console.log('테스트 유저 생성 완료');
    
  } catch (error) {
    console.error('테스트 유저 생성 중 오류:', error);
  }
};

/**
 * 테스트용 JWT 액세스 토큰을 생성합니다
 */
export function createTestAccessToken(user: TestUser): string {
  const secret = process.env.JWT_ACCESS_SECRET;
  console.log('JWT_ACCESS_SECRET:', secret);
  console.log('사용자 ID:', user.id);
  
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET이 설정되지 않았습니다.');
  }
  
  // authService.ts와 동일한 페이로드 구조 사용
  const payload = { userId: user.id };
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  console.log('생성된 토큰:', token);
  
  // 토큰이 올바르게 디코드되는지 확인
  try {
    const decoded = jwt.verify(token, secret);
    console.log('디코드된 토큰:', decoded);
  } catch (err) {
    console.error('토큰 디코드 오류:', err);
  }
  
  return token;
}

/**
 * 테스트용 JWT 리프레시 토큰을 생성합니다
 */
export function createTestRefreshToken(user: TestUser): string {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET이 설정되지 않았습니다.');
  }
  
  const payload = { userId: user.id };
  return jwt.sign(payload, secret, { expiresIn: '2w' });
}

/**
 * 테스트용 유저 데이터
 */
export const testUsers = {
  alice: {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'alice@test.com',
    nickname: 'Alice',
    password: 'testpassword123'
  },
  bob: {
    id: '550e8400-e29b-41d4-a716-446655440002', 
    email: 'bob@test.com',
    nickname: 'Bob',
    password: 'testpassword123'
  },
  charlie: {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'charlie@test.com', 
    nickname: 'Charlie',
    password: 'testpassword123'
  }
};