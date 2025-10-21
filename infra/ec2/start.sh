#!/bin/bash
set -e

# 프로젝트 루트 이동
cd /home/ec2-user/3-sprint-mission

echo "최신 코드 가져오기"
git pull origin main

echo "의존성 설치"
npm install --production

echo "Prisma 클라이언트 재생성..."
npx prisma generate

echo "데이터베이스 마이그레이션"
npx prisma migrate deploy

echo "타입스크립트 빌드"
npm run build

# 빌드 확인
if [ ! -d "dist" ]; then
  echo "dist 폴더가 없습니다. 빌드를 먼저 진행하세요."
  exit 1
fi

echo "PM2로 앱 실행"
mkdir -p logs
npx pm2 start infra/ec2/ecosystem.config.js --env production

# PM2 프로세스 저장 & 재부팅 자동 실행
npx pm2 save
npx pm2 startup -u ec2-user --hp /home/ec2-user

# 실행 상태 확인
npx pm2 list