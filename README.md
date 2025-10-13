## 미션 목표
- Github Actions로 테스트, 배포 자동화
- Docker 이미지 만들기

## 요구사항

### Github Actions 활용
- [x] 브랜치에 pull request가 발생하면 테스트를 실행하는 액션을 구현해 주세요.
- [x] `main` 브랜치에 push가 발생하면 AWS 배포를 진행하는 액션을 구현해 주세요.
- [x] 개인 Github 리포지터리에서 Actions 동작을 확인해 보세요.

### AWS S3 적용
- [x] AWS S3 버킷을 생성하고, 퍼블릭 액세스를 허용해 주세요.
- [x] 일반 사용자가 S3 업로드된 파일에 접근할 수 있도록 S3 버킷 정책을 설정해 주세요.
- [x] 데이터베이스는 Postgres 이미지를 사용해 연결하도록 구현해 주세요.
- [x] 실행된 Express 서버 컨테이너는 호스트 머신에서 3000번 포트로 접근 가능하도록 구현해 주세요.

### Docker 이미지 만들기
다음을 만족하는 Dockerfile과 docker-compose.yaml을 작성해 주세요.

- [x] Express 서버를 실행하는 Dockerfile을 작성해 주세요.
- [x] Express 서버가 파일 업로드를 처리하는 폴더는 Docker의 Volume을 활용하도록 구현해 주세요.
- [x] 프로덕션 환경에서는 Prisma에 프로젝트 데이터베이스와 연결하도록 합니다.

---

## 멘토에게
- 기본 요구사항은 모두 충족하였으며, 추가 구현한 내용을 아래에 기재합니다.

### 헬스체크
- `docker-compose.yaml` 내에서 Postgres 컨테이너의 상태를 `pg_isready`로 주기적으로 확인하도록 설정했습니다.  
- 애플리케이션 컨테이너는 DB 서비스가 정상 상태(`healthy`)일 때만 기동되도록 의존성을 설정했습니다.

### Volume 구성 강화
- 업로드 파일을 컨테이너 외부에서도 보존할 수 있도록 `/app/uploads` 경로를 호스트와 Volume으로 연결했습니다.  
- 애플리케이션 실행 시 업로드 폴더가 자동 생성되도록 Dockerfile 내에 디렉터리 생성 및 권한 설정을 추가했습니다.

### Prisma 마이그레이션 자동화
- 배포 시 Prisma 마이그레이션이 자동으로 반영되도록 Dockerfile의 CMD 단계에 `migrate deploy` 명령어를 포함했습니다.

### 보안 및 권한 관리
- 컨테이너 내에서 애플리케이션이 root 권한으로 실행되지 않도록 `USER app`을 설정했습니다.  
- 이미지 빌드 시 불필요한 파일 및 비공개 설정이 포함되지 않도록 `.dockerignore`를 구성했습니다.

### upload 미들웨어
- `.env`의 실행 환경 설정에 따라 로컬 스토리지 또는 AWS S3 중 하나를 선택하여 파일 업로드를 처리하도록 수정했습니다.
- 이에 따라 `.env.example`에 `UPLOAD_STRATEGY` 항목을 추가했습니다.