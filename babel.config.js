module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    // 필요한 경우 추가 플러그인들을 여기에 추가할 수 있습니다
  ],
};