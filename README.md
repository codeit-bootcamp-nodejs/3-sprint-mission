# 스프린트 미션 1

## Product, ElectornicProduct, Article 클래스

각 클래스는 아래와 같은 프로퍼티와 메소드를 가집니다

- Product
  1. name : string
  2. description : string
  3. price : number
  4. tag : array
  5. images : array
  6. favoritcount : number
  7. favorite() : method
     
- ElectornicProduct
  1. name : string
  2. description : string
  3. price : number
  4. tag : array
  5. images : array
  6. favoritcount : number
  7. favorite() : method
  8. manufacturer : string
 
- Article
  1. title : string
  2. content : string
  3. writer : string
  4. likeCount : number
  5. createdAt : Date 객체
  6. like() : method
 
  ## ProductService.js와 ArticleService.js

  panda market에서 제공하는 api를 활용한 메소드 모음입니다.

# 스프린트 미션 3

## 중고마켓, 자유게시판, 댓글 관련 API 작성 및 배포 미션

### 중고마켓 API
- 상품 등록
- 상품 상세조회
- 상품 수정
- 상품 삭제
- 상품 목록 조회

### 자유게시판 API
- 게시글 등록 
- 게시글 상세조회
- 게시글 수정
- 게시글 삭제
- 게시글 목록 조회

### 댓글 API : 중고마켓 댓글, 자유게시판 댓글 API가 구분되어 있습니다.
- 댓글 등록
- 댓글 수정
- 댓글 삭제
- 댓글 목록 조회

### 이미지 업로드 API
- jpg, jpeg, png, gif, webp 확장자 유효.
- 5MB까지 업로드 가능
- 단일 파일

### 유효성 검증
- 상품, 게시글, 댓글 : supersturct 모듈을 사용하여 입력값의 유효값을 검증하였습니다.
- 이미지 업로드 : multer 모듈의 filefilter와 limits속성을 사용하여 유효값을 검증하였습니다.

### 예외 처리
- 비동기 함수 처리 : express5 버전부터는 자동으로 잡아주기에 별도 함수를 작성하지 않았습니다
- 전역 예외 처리 : errorHandler라는 에러 핸들러 미들웨어를 구현하여 모든 미들웨어의 마지막에서 예외상황을 처리할 수 있도록 하였습니다. 400, 404, 500 등 알맞은 상태코드를 반환합니다.

### 라우트 중복 제거
- expressRoute() 함수를 사용하여 중고마켓과 자유게시판 관련 API들을 분리하였습니다.
- route() 함수를 통해 중복되는 경로를 제거하였습니다.

### DB
- 테이블 : 상품, 게시글, 상품 댓글, 게시글 댓글
- 관계 : 
    * 상품-상품 댓글 = 1:N
    * 게시글-게시글 댓글 = 1:N
- 관계를 맺고 있는 컬럼이 지워지면 관련된 컬림이 지워지도록 onDelete 옵션을 설정하였습니다
- 데이터베이스 시딩 코드를 작성하였습니다.

### 배포
- .env로 환경변수를 관리하였습니다 : DB, Port
- CORS를 설정하여 모든 도메인과 포트에서 연결할 수 있도록 설정하였습니다.
- render.com으로 배포하였습니다. 아래 url로 request를 보내 테스트 하실수 있습니다.
- https://three-sprint-mission-qlvt.onrender.com

### 멘토에게
- Route, Controller, Service로 분리해보았는데 잘 되었는지 궁금합니다.
- middlewares나 services에 들어가는게 알맞은 디렉토리로 구분되었는지 궁금합니다.

# 스프린트 미션 4

# 요구사항

## 유저 권한 인증 및 인가 구현 미션

### 인증
- User 스키마를 작성해 주세요.
    * id, email, nickname, image, password, createdAt, updatedAt 필드를 가집니다.
- 회원가입 API를 만들어 주세요.
    * email, nickname, password 를 입력하여 회원가입을 진행합니다.
    * password는 해싱해 저장합니다.
- 토큰 기반 인증: 로그인에 성공하면 Access Token을 발급

### 상품 기능 인가
- 로그인한 유저만 상품을 등록
- 상품을 등록한 유저만 해당 상품의 정보를 수정하거나 삭제

### 게시글 기능 인가
- 로그인한 유저만 게시글을 등록
- 게시글을 등록한 유저만 해당 게시글을 수정하거나 삭제

### 댓글 기능 인가
- 로그인한 유저만 상품에 댓글을 등록
- 로그인한 유저만 게시글에 댓글을 등록
- 댓글을 등록한 유저만 해당 댓글을 수정하거나 삭제

### 유저 정보
- 유저가 자신의 정보를 조회
- 유저가 자신의 정보를 수정
- 유저가 자신의 비밀번호를 변경
- 유저가 자신이 등록한 상품의 목록을 조회
- 유저의 비밀번호는 리스폰스로 노출하지 않습니다.

## 심화

### 인증
- 토큰 기반 인증: Refresh Token으로 토큰을 갱신
    * Refresh Token은 쿠키를 통해 전달

### 좋아요 기능
- 로그인한 유저는 상품에 '좋아요'와 '좋아요 취소'를 할 수 있습니다.
- 로그인한 유저는 게시글에 '좋아요'와 '좋아요 취소'를 할 수 있습니다.
- 상품 또는 게시글을 조회할 때, 유저가 '좋아요'를 누른 항목인지 확인할 수 있도록 isLiked와 같은 불린형 필드를 리스폰스 객체에 포함시켜 리스폰스해 주세요.
- 유저가 '좋아요'를 표시한 상품의 목록을 조회하는 기능을 구현합니다.

### 멘토에게
- 중복되는 부분이 있는 것 같으나 어떤 식으로 리팩토링을 하면 될 지 피드백을 받고 싶습니다.
- 심화 요구 사항을 구현하면서 토큰의 id값을 사용해야 하기에, 비회원일 경우 조회가 불가능하게 바뀌었습니다. 이 부분을 비회원도 조회하도록 하려면 어떤 식으로 로직을 작성하면 될지 피드백을 받고 싶습니다.
- 시딩 작업까지 수정해주어야 하기에 현재는 schema가 optional한 상태입니다, 다만 mock 데이터를 작성한다면 새로 추가해준 필드들도 필수 값으로 지정 가능할 것 같습니다.