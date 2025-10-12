module.exports = {
  apps: [
    {
      name: 'my-app',
      script: 'dist/src/main.js',
      watch: true,
      instances: 1,
      env: {
        NODE_ENV: 'development',                  // 그냥 env 사용
        PORT: process.env.PORT || 3000,
        HOST_URL: process.env.HOST_URL || 'http://localhost:3000',
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};