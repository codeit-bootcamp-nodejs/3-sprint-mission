module.exports = {
  apps: [
    {
      name: 'codeit-sprint10',
      script: '.dest/server.js',
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
    }
  ]
};