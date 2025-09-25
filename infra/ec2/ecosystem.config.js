module.exports = {
  apps: [
    {
      name: "panda-market-api",
      script: "dist/app.js",
      node_args: ["--enable-source-maps"],
      instances: 1, // 단일 인스턴스
      exec_mode: "fork",
      watch: false,
      autorestart: true,
      max_memory_restart: "300M", // 가벼운 백엔드 서비스이므로 300MB 제한
      env: {
        NODE_ENV: "development",
        PORT: process.env.PORT || 3000,
      },
      env_production: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000,
      },
    },
  ],
}
