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