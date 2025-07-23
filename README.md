# Serverless Web App Frontend

React + TypeScript + Vite 기반의 서버리스 웹 애플리케이션 프론트엔드

## 🚀 배포 아키텍처

- **S3**: 정적 웹사이트 호스팅
- **CloudFront**: CDN 및 HTTPS 제공
- **GitHub Actions**: CI/CD 파이프라인
- **환경 분리**: Development / Production

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 로컬 개발 서버 실행
npm run dev

# 빌드
npm run build

# 테스트
npm run test
```

## 🔧 AWS 인프라 설정

### 1. AWS 인프라 생성
```bash
npm run setup-aws
```

### 2. GitHub Secrets 설정

Repository Settings → Secrets and variables → Actions에서 다음 secrets 추가:

#### AWS 자격증명
- `AWS_ACCESS_KEY_ID`: AWS Access Key
- `AWS_SECRET_ACCESS_KEY`: AWS Secret Key  
- `AWS_REGION`: us-east-1

#### S3 버킷
- `S3_BUCKET_DEV`: serverless-web-app-frontend-dev
- `S3_BUCKET_PROD`: serverless-web-app-frontend-prod

#### CloudFront
- `CLOUDFRONT_DISTRIBUTION_ID_DEV`: 개발 환경 Distribution ID
- `CLOUDFRONT_DISTRIBUTION_ID_PROD`: 프로덕션 환경 Distribution ID

#### 환경변수
- `VITE_API_BASE_URL`: 백엔드 API URL
- `VITE_AWS_REGION`: us-east-1
- `VITE_USER_POOL_ID`: Cognito User Pool ID
- `VITE_USER_POOL_CLIENT_ID`: Cognito User Pool Client ID

## 🚀 배포 프로세스

### 자동 배포
- `develop` 브랜치 → Development 환경
- `main` 브랜치 → Production 환경

### 배포 단계
1. 코드 체크아웃
2. Node.js 설정
3. 의존성 설치
4. 테스트 실행
5. 애플리케이션 빌드
6. S3에 업로드
7. CloudFront 캐시 무효화

## 🌐 접속 URL

배포 완료 후 CloudFront URL로 접속 가능:
- Development: `https://[dev-distribution-id].cloudfront.net`
- Production: `https://[prod-distribution-id].cloudfront.net`

## 📁 프로젝트 구조

```
frontend/
├── .github/workflows/    # GitHub Actions
├── src/
│   ├── components/      # React 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── services/       # API 서비스
│   ├── store/          # 상태 관리 (Zustand)
│   └── types/          # TypeScript 타입
├── scripts/            # 배포 스크립트
└── dist/              # 빌드 결과물
```

## 🔄 개발 워크플로우

1. `develop` 브랜치에서 개발
2. Pull Request 생성 시 자동 테스트
3. `develop` 브랜치 머지 시 개발 환경 자동 배포
4. `main` 브랜치 머지 시 프로덕션 환경 자동 배포

## 🛠 트러블슈팅

### CloudFront 캐시 이슈
```bash
# 수동으로 캐시 무효화
aws cloudfront create-invalidation --distribution-id [DISTRIBUTION_ID] --paths "/*"
```

### 환경변수 확인
빌드 시 환경변수가 제대로 주입되는지 확인:
```bash
npm run build
# dist/assets/index-*.js 파일에서 환경변수 값 확인
```