const sampleData = {
  products: [
    {
      id: 'a39a8fac-208d-4534-a841-35e2c33e9969',
      name: '노트북',
      description: '최신형 노트북입니다.',
      price: 1200000,
      tags: ['전자기기', '노트북'],
    },
    {
      id: '7ab5c949-ad58-4850-bbb3-ab571d57ab1b',
      name: '책상',
      description: '튼튼한 책상입니다.',
      price: 50000,
      tags: ['가구'],
    },
    {
      id: '28a30bd7-8861-4a69-9ef6-f8d5d019f5db',
      name: '의자',
      description: '편안한 의자입니다.',
      price: 30000,
      tags: ['가구', '의자'],
    },
  ],
  articles: [
    {
      id: '849c2109-ab70-480f-8c52-e6f0b7cae430',
      title: '첫 번째 게시글',
      content: '안녕하세요, 첫 글입니다!',
    },
    {
      id: '1be5c574-adde-47f7-99c9-b7026be29208',
      title: '두 번째 게시글',
      content: '테스트용 게시글입니다.',
    },
    {
      id: 'd660c4f5-9744-4aab-85f0-d8cd84ca5324',
      title: '세 번째 게시글',
      content: '더 많은 예시 데이터를 추가해봅니다.',
    },
  ],
  productComments: [
    {
      content: '최신형 노트북!',
      productId: 'a39a8fac-208d-4534-a841-35e2c33e9969',
    },
    {
      content: '배그 잘 돌아가나요?',
      productId: 'a39a8fac-208d-4534-a841-35e2c33e9969',
    },
    {
      content: '허먼밀러 쓰는중인데 이걸로 바꿔도 괜찮겠네요',
      productId: '28a30bd7-8861-4a69-9ef6-f8d5d019f5db',
    },
  ],
  articleComments: [
    {
      content: '반가워요!',
      articleId: '849c2109-ab70-480f-8c52-e6f0b7cae430',
    },
    {
      content: '테스트 댓글',
      articleId: '849c2109-ab70-480f-8c52-e6f0b7cae430',
    },
    {
      content: '시딩 귀찮아요',
      articleId: 'd660c4f5-9744-4aab-85f0-d8cd84ca5324',
    },
  ],
};

export default sampleData;