## 요구사항

### 기본

#### 스프린트 미션 5

###### 프로젝트 세팅

- [x] tsconfig.json 파일을 생성하고, 필요한 옵션을 설정해 주세요. (예: outDir).
- [x] 필요한 npm script를 설정해 주세요. (예: 빌드 및 개발 서버 실행 명령어)

###### 타입스크립트 마이그레이션

- [x] 기존 Express.js 프로젝트를 타입스크립트 프로젝트로 마이그레이션 해주세요.
- [x] 필요한 타입 패키지를 설치해 주세요.
- [ ] any 타입의 사용은 최소화해주세요.
- [ ] 복잡한 객체 구조나 배열 구조를 가진 변수에 인터페이스 또는 타입 별칭을 사용하세요.
- [ ] 필요한 경우, 타입 별칭 또는 유틸리티 타입을 사용해 타입 복잡성을 줄여주세요.
- [x] 필요한 경우, declare를 사용하여 타입을 오버라이드하거나 확장합니다. (예: req.user)

###### 타입스크립트 마이그레이션

- [x] ts-node 를 사용해 .ts 코드를 바로 실행할 수 있는 npm script를 만들어 주세요. (예: npm run dev)
- [x] nodemon을 사용해 .ts 코드가 변경될 때마다 서버가 다시 실행되는 npm script를 만들어 주세요. (예: npm run dev)

##### 심화 요구 사항

- [ ] Controller, Service, Repository로 나누어 코드를 리팩토링해 주세요.
- [ ] 필요하다면, 계층 사이에서 데이터를 주고 받을 때 DTO를 활용해 주세요.

#### 스프린트 미션 4

###### 인증
- [x] User 스키마를 작성해 주세요(id, email, nickname, image, password, createdAt, updatedAt 필드를 가집니다.)
- [x] 회원가입 API를 만들어 주세요.(email, nickname, password 를 입력하여 회원가입을 진행합니다. password는 해싱해 저장합니다.) POST
- [x] 토큰 기반 인증: 로그인에 성공하면 Access Token을 발급하는 기능을 구현합니다. (npm i jsonwebtoken)

###### 상품 기능 인가(토큰: npm i express-jwt) 테스트X..
- [x] 로그인한 유저만 상품을 등록할 수 있습니다.
- [x] 상품을 등록한 유저만 해당 상품의 정보를 수정하거나 삭제할 수 있습니다.

###### 게시글 기능 인가(토큰) 테스트X..
- [x] 로그인한 유저만 게시글을 등록할 수 있습니다.
- [x] 게시글을 등록한 유저만 해당 게시글을 수정하거나 삭제할 수 있습니다.

###### 댓글 기능 인가(토큰) 테스트X..
- [x] 로그인한 유저만 상품에 댓글을 등록할 수 있습니다.
- [x] 로그인한 유저만 게시글에 댓글을 등록할 수 있습니다.
- [ ] 댓글을 등록한 유저만 해당 댓글을 수정하거나 삭제할 수 있습니다. (getComment 새로 작성해야함)

###### 유저 정보
- [x] 유저가 자신의 정보를 조회하는 기능을 구현합니다. GET + 토큰 / prisma.user.update
- [x] 유저가 자신의 정보를 수정할 수 있는 기능을 구현합니다. PATCH + 토큰 / prisma.user.update
- [x] 유저가 자신의 비밀번호를 변경할 수 있는 기능을 구현합니다. PUT || PATCH + 토큰
- [ ] 유저가 자신이 등록한 상품의 목록을 조회하는 기능을 구현합니다. GET + 토큰
- [x] 유저의 비밀번호는 리스폰스로 노출하지 않습니다.


### 심화

###### 인증
- [ ] 토큰 기반 인증: Refresh Token으로 토큰을 갱신하는 기능을 구현합니다.

###### 좋아요 기능
- [ ] 로그인한 유저는 상품에 '좋아요'와 '좋아요 취소'를 할 수 있습니다.
- [ ] 로그인한 유저는 게시글에 '좋아요'와 '좋아요 취소'를 할 수 있습니다.
- [ ] 상품 또는 게시글을 조회할 때, 유저가 '좋아요'를 누른 항목인지 확인할 수 있도록 isLiked와 같은 불린형 필드를 리스폰스 객체에 포함시켜 리스폰스해 주세요.
- [ ] 유저가 '좋아요'를 표시한 상품의 목록을 조회하는 기능을 구현합니다.

## 스프린트 3

- [x] PostgreSQL를 이용해 주세요.
- [x] 데이터 모델 간의 관계를 고려하여 onDelete를 설정해 주세요.
- [x] 데이터베이스 시딩 코드를 작성해 주세요.
- [x] 각 API에 적절한 에러 처리를 해 주세요.
- [x] 각 API 응답에 적절한 상태 코드를 리턴하도록 해 주세요.
- [x] Article 스키마를 작성해 주세요
- [x] id, title, content, createdAt, updatedAt 필드를 가집니다.
- [x] 게시글 등록 API를 만들어 주세요.
- [x] title, content를 입력해 게시글을 등록합니다.
- [x] 게시글 상세 조회 API를 만들어 주세요.
- [x] id, title, content, createdAt를 조회합니다.
- [x] 게시글 수정 API를 만들어 주세요.
- [x] 게시글 삭제 API를 만들어 주세요.
- [x] 게시글 목록 조회 API를 만들어 주세요.
- [x] id, title, content, createdAt를 조회합니다.
- [x] offset 방식의 페이지네이션 기능을 포함해 주세요.
- [x] 최신순(recent)으로 정렬할 수 있습니다.
- [x] title, content에 포함된 단어로 검색할 수 있습니다.
- [x] 댓글 등록 API를 만들어 주세요.
- [x] content를 입력하여 댓글을 등록합니다.
- [x] 중고마켓, 자유게시판 댓글 등록 API를 따로 만들어 주세요.
- [x] 댓글 수정 API를 만들어 주세요.
- [x] PATCH 메서드를 사용해 주세요.
- [x] 댓글 삭제 API를 만들어 주세요.
- [x] 댓글 목록 조회 API를 만들어 주세요.
- [x] id, content, createdAt 를 조회합니다.
- [x] cursor 방식의 페이지네이션 기능을 포함해 주세요.
- [x] 중고마켓, 자유게시판 댓글 목록 조회 API를 따로 만들어 주세요.
- [x] 상품 등록 시 필요한 필드(이름, 설명, 가격 등)의 유효성을 검증하는 미들웨어를 구현합니다.

- [x] 게시물 등록 시 필요한 필드(제목, 내용 등)의 유효성 검증하는 미들웨어를 구현합니다.

- [x] multer 미들웨어를 사용하여 이미지 업로드 API를 구현해주세요.

- [ ] 업로드된 이미지는 서버에 저장하고, 해당 이미지의 경로를 response 객체에 포함해 반환합니다.

- [ ] 모든 예외 상황을 처리할 수 있는 에러 핸들러 미들웨어를 구현합니다.
- [ ] 서버 오류(500), 사용자 입력 오류(400 시리즈), 리소스 찾을 수 없음(404) 등 상황에 맞는 상태값을 반환합니다.
- [x] 중복되는 라우트 경로(예: /users에 대한 get 및 post 요청)를 app.route()로 통합해 중복을 제거합니다.
- [x] express.Router()를 활용하여 중고마켓/자유게시판 관련 라우트를 별도의 모듈로 구분합니다.

- [x] .env 파일에 환경 변수를 설정해 주세요.
- [x] CORS를 설정해 주세요.
- [ ] render.com으로 배포해 주세요.

- [x] Product 클래스와 ElectronicProduct 클래스 생성
- [x] favorite 메소드
- [x] Article 클래스 생성
- [x] getArticleList, getArticle, patchArticle, deleteArticle 함수
- [x] fetch 혹은 axios 이용, 에러 메세지 출력
- [x] .then() 메소드 이용, .catch() 이용
- [x] getProductList(), getProduct(), createProduct, patchProduct(), deleteProduct() 함수
- [x] async / await 비동기 처리, try/catch 오류 처리
- [x] products 배열 / 인스턴스 생성
- [x] ProductService.js ArticleService.js 파일 분리

### 심화
- [ ] Article 클래스에 createdAt 프로퍼티 생성

## 주요 변경사항
- 
- 

## 스크린샷
![image](이미지url)

## 멘토에게
- 3-sprint-mission\repository\userRepository.js에 있는

- const save = (user) => {
  return prisma.user.create({
    data: {
      email: user.email,
      nickname: user.nickname,
      password: user.password,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  })
}
- 에서 nickname: user.nickname이 user.name으로 쓰이면 오류가 난다는 것까진 알겠는데 왜 그런지 이유를 모르겠습니다.

