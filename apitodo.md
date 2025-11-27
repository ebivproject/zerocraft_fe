# API 연동 작업 목록

백엔드 주소(`NEXT_PUBLIC_API_URL`)만 설정하면 작동하도록 하기 위한 작업 목록입니다.

---

## 작업 상태

- [x] 1. API 엔드포인트 수정 (`src/constants/api.ts`) ✅
- [x] 2. Auth API 함수 추가 (`src/lib/api/auth.ts`) ✅
- [x] 3. Google OAuth 콜백 페이지 생성 (`src/app/(auth)/callback/page.tsx`) ✅
- [x] 4. 로그인 페이지 수정 (`src/app/(auth)/login/page.tsx`) ✅
- [x] 5. 마이페이지 API 함수 추가 (`src/lib/api/mypage.ts`) ✅
- [x] 6. 이용권/결제 API 함수 추가 (`src/lib/api/credits.ts`) ✅
- [x] 7. 찜하기 API 함수 추가 (`src/lib/api/favorites.ts`) ✅
- [x] 8. 사업계획서 API 함수 보완 (`src/lib/api/businessPlan.ts`) ✅
- [x] 9. API index 내보내기 수정 (`src/lib/api/index.ts`) ✅
- [x] 10. AuthStore 수정 (`src/store/authStore.ts`) ✅
- [x] 11. 홈페이지 지원사업 API 연동 (`src/app/page.tsx`) ✅
- [x] 12. 마이페이지 API 연동 (`src/app/(main)/mypage/page.tsx`) ✅
- [x] 13. Wizard 페이지 백엔드 저장 연동 (`src/app/(main)/project/wizard/page.tsx`) ✅

---

## 상세 작업 내용

### 1. API 엔드포인트 수정

- 파일: `src/constants/api.ts`
- 내용: apireq.md 명세에 맞게 엔드포인트 경로 추가/수정

### 2. Auth API 함수 추가

- 파일: `src/lib/api/auth.ts`
- 내용: Google OAuth 관련 함수 추가 (getGoogleLoginUrl, handleGoogleCallback)

### 3. Google OAuth 콜백 페이지 생성

- 파일: `src/app/(auth)/callback/page.tsx` (신규)
- 내용: Google OAuth 인증 후 토큰 처리 페이지

### 4. 로그인 페이지 수정

- 파일: `src/app/(auth)/login/page.tsx`
- 내용: Mock 로그인 → 실제 Google OAuth 연동

### 5. 마이페이지 API 함수 추가

- 파일: `src/lib/api/mypage.ts` (신규)
- 내용: 마이페이지 통합 데이터 조회 API

### 6. 이용권/결제 API 함수 추가

- 파일: `src/lib/api/credits.ts` (신규)
- 내용: 이용권 잔액 조회, 결제 요청/확인 API

### 7. 찜하기 API 함수 추가

- 파일: `src/lib/api/favorites.ts` (신규)
- 내용: 찜한 지원사업 CRUD API

### 8. 사업계획서 API 함수 보완

- 파일: `src/lib/api/businessPlan.ts`
- 내용: 백엔드 저장/조회/다운로드 API 추가

### 9. API index 내보내기 수정

- 파일: `src/lib/api/index.ts`
- 내용: 새로 생성한 API 모듈 export 추가

### 10. AuthStore 수정

- 파일: `src/store/authStore.ts`
- 내용: API 연동하여 credits 동기화, 로그인 시 서버 데이터 사용

### 11. 홈페이지 지원사업 API 연동

- 파일: `src/app/page.tsx`
- 내용: MOCK_GRANTS → grantsApi.getGrants() 호출로 변경

### 12. 마이페이지 API 연동

- 파일: `src/app/(main)/mypage/page.tsx`
- 내용: MOCK_PROJECTS, MOCK_FAVORITES → API 호출로 변경

### 13. Wizard 페이지 백엔드 저장 연동

- 파일: `src/app/(main)/project/wizard/page.tsx`
- 내용: 사업계획서 완료 시 백엔드에 저장

---

## 환경 변수

```env
# .env.local
NEXT_PUBLIC_API_URL=http://your-backend-url.com
gemini_api_key=your_gemini_api_key
```
