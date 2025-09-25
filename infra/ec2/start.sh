# 에러 발생 시 중단
set -e

export NODE_ENV=production
export PORT=${PORT:-3000}

npx tsc
npx pm2 start /infra/ec2/ecosystem.config.js --env production
