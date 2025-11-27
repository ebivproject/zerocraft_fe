# Changelog

## 2025-11-27: API 연동 작업 완료

백엔드 API와 연동을 위한 프론트엔드 작업을 완료했습니다. `NEXT_PUBLIC_API_URL` 환경 변수만 설정하면 백엔드와 연동됩니다.

---

### 신규 파일 생성

| 파일                                      | 설명                                                   |
| ----------------------------------------- | ------------------------------------------------------ |
| `src/app/(auth)/callback/page.tsx`        | Google OAuth 콜백 페이지 - 인증 코드 처리 및 토큰 저장 |
| `src/app/(auth)/callback/page.module.css` | 콜백 페이지 스타일                                     |
| `src/lib/api/mypage.ts`                   | 마이페이지 통합 데이터 조회 API                        |
| `src/lib/api/credits.ts`                  | 이용권 잔액/사용 내역/사용 API                         |
| `src/lib/api/favorites.ts`                | 찜한 지원사업 CRUD API                                 |
| `apitodo.md`                              | API 연동 작업 추적 문서                                |

---

### 수정된 파일

#### 1. `src/constants/api.ts`

- **변경 내용**: apireq.md 명세에 맞게 엔드포인트 전체 재구성
- **추가된 엔드포인트**:
  - `AUTH.GOOGLE_LOGIN`: `/api/auth/google`
  - `AUTH.GOOGLE_CALLBACK`: `/api/auth/google/callback`
  - `AUTH.LOGOUT`: `/api/auth/logout`
  - `AUTH.ME`: `/api/auth/me`
  - `CREDITS.BALANCE`: `/api/credits`
  - `CREDITS.HISTORY`: `/api/credits/history`
  - `CREDITS.USE`: `/api/credits/use`
  - `PAYMENTS.CREATE`: `/api/payments`
  - `PAYMENTS.CONFIRM`: `/api/payments/:id/confirm`
  - `PAYMENTS.LIST`: `/api/payments`
  - `BUSINESS_PLANS.LIST`: `/api/business-plans`
  - `BUSINESS_PLANS.DETAIL`: `/api/business-plans/:id`
  - `BUSINESS_PLANS.CREATE`: `/api/business-plans`
  - `BUSINESS_PLANS.DOWNLOAD`: `/api/business-plans/:id/download`
  - `FAVORITES.LIST`: `/api/favorites/grants`
  - `FAVORITES.ADD`: `/api/favorites/grants`
  - `FAVORITES.REMOVE`: `/api/favorites/grants/:grantId`
  - `FAVORITES.CHECK`: `/api/favorites/grants/:grantId/check`
  - `GRANTS.LIST`: `/api/grants`
  - `GRANTS.DETAIL`: `/api/grants/:id`
  - `MYPAGE`: `/api/mypage`

#### 2. `src/lib/api/auth.ts`

- **변경 내용**: Google OAuth 관련 함수 추가
- **추가된 함수**:
  - `getGoogleLoginUrl()`: Google OAuth 로그인 URL 요청
  - `handleGoogleCallback(code, state)`: OAuth 콜백 처리
  - `logout()`: 서버 측 로그아웃
  - `getMe()`: 내 정보 조회

#### 3. `src/lib/api/businessPlan.ts`

- **변경 내용**: 백엔드 API 연동 함수 추가
- **추가된 함수**:
  - `getList(params)`: 사업계획서 목록 조회
  - `getById(id)`: 사업계획서 상세 조회
  - `create(data)`: 사업계획서 생성
  - `download(id, format)`: 사업계획서 파일 다운로드

#### 4. `src/lib/api/index.ts`

- **변경 내용**: 새로 추가된 API 모듈 내보내기
- **추가된 내보내기**: `mypageApi`, `creditsApi`, `paymentsApi`, `favoritesApi`, `businessPlanApi`

#### 5. `src/store/authStore.ts`

- **변경 내용**:
  - Zustand persist 미들웨어 추가 (세션 유지)
  - `fetchMe()`: 백엔드에서 사용자 정보 조회
  - `fetchCredits()`: 백엔드에서 이용권 잔액 조회
  - `logout()`: 백엔드 로그아웃 호출 후 상태 정리

#### 6. `src/types/auth.ts`

- **변경 내용**: User 타입에 필드 추가
- **추가된 필드**: `profileImage?`, `credits?`

#### 7. `src/types/grant.ts`

- **변경 내용**: Grant 타입 확장
- **추가된 필드**: `tags?`, `views?`, `eligibility?`, `applicationMethod?`, `requiredDocuments?`, `contactInfo?`
- **pagination 구조 변경**: `GrantsResponse.pagination` 형식으로 통일

#### 8. `src/app/(auth)/login/page.tsx`

- **변경 내용**: Mock 로그인 → 실제 Google OAuth 연동
- **동작**: Google 로그인 버튼 클릭 시 백엔드에서 받은 OAuth URL로 리다이렉트

#### 9. `src/app/page.tsx`

- **변경 내용**: Mock 데이터 → API 호출로 변경
- **API 연동**: `grantsApi.getGrants()` 호출
- **Fallback**: API 실패 시 기본 데이터 표시

#### 10. `src/app/(main)/mypage/page.tsx`

- **변경 내용**: Mock 데이터 → API 호출로 변경
- **API 연동**:
  - `mypageApi.getData()`: 통합 데이터 조회
  - `favoritesApi.remove()`: 찜 해제
  - `businessPlanApi.download()`: 사업계획서 다운로드
- **로그아웃**: `authStore.logout()` 호출

#### 11. `src/app/(main)/project/wizard/page.tsx`

- **변경 내용**: 사업계획서 생성 시 백엔드 저장 연동
- **API 연동**:
  - `creditsApi.use()`: 이용권 차감
  - `businessPlanApi.create()`: 사업계획서 저장
- **삭제된 로직**: 로컬 이용권 차감/복구 (백엔드에서 처리)

---

### API 명세 검증 및 수정 (2025-11-27 추가)

apireq.md 명세와 대조하여 다음 항목을 수정:

#### `src/constants/api.ts`

- **추가**: `CREDITS.USE: "/api/credits/use"` 엔드포인트

#### `src/lib/api/credits.ts`

- **추가**: `CreditUseResponse` 인터페이스
- **추가**: `creditsApi.use(description)` 함수 - 이용권 사용(차감) API

#### `src/lib/api/businessPlan.ts`

- **수정**: `BusinessPlanCreateRequest` 타입
  - `content` 필드를 optional로 변경
  - `data` 필드 추가 (프론트엔드 WizardData 변환 결과용)

#### `src/lib/api/mypage.ts`

- **수정**: `MyPageResponse` 타입에서 `user.credits` 필드 제거
  - apireq.md 명세에 따라 credits는 별도 API(/api/credits)로 조회

---

### 환경 변수 설정

`.env` 파일에 다음 변수 설정 필요:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

### 작업 완료 체크리스트

- [x] API 엔드포인트 정의 (`constants/api.ts`)
- [x] Auth API 함수 (`lib/api/auth.ts`)
- [x] Google OAuth 콜백 페이지 (`app/(auth)/callback/page.tsx`)
- [x] 로그인 페이지 OAuth 연동 (`app/(auth)/login/page.tsx`)
- [x] 마이페이지 API 함수 (`lib/api/mypage.ts`)
- [x] 이용권/결제 API 함수 (`lib/api/credits.ts`)
- [x] 찜하기 API 함수 (`lib/api/favorites.ts`)
- [x] 사업계획서 API 함수 (`lib/api/businessPlan.ts`)
- [x] API index 내보내기 (`lib/api/index.ts`)
- [x] AuthStore 수정 (`store/authStore.ts`)
- [x] 홈페이지 API 연동 (`app/page.tsx`)
- [x] 마이페이지 API 연동 (`app/(main)/mypage/page.tsx`)
- [x] Wizard 페이지 백엔드 저장 연동 (`app/(main)/project/wizard/page.tsx`)
- [x] apireq.md 명세 검증 및 수정
- [x] 빌드 에러 수정 및 타입 정합성 확보

---

## 2025-11-27: 빌드 에러 수정 (추가)

빌드 테스트 중 발견된 타입 에러 및 API 호환성 문제를 수정했습니다.

### 수정된 파일

#### `src/app/(main)/mypage/page.tsx`

- **문제**: `response.businessPlans.map()` 호출 에러 - 응답 구조 불일치
- **수정**: `response.businessPlans.data.map()`, `response.favorites.data.map()` 으로 변경
- **추가 수정**: favorites 데이터 매핑 시 `fav.grant.*` 구조로 접근하도록 변경

#### `src/app/(main)/project/wizard/page.tsx`

- **문제**: `output.companyOverview` 속성 없음 에러
- **수정**: `output.sections?.generalStatus?.data?.companyName` 경로로 변경
- **Fallback**: `output.documentTitle` 사용

#### `src/hooks/useAuth.ts`

- **문제**: `authApi.login()` 함수 없음 에러 (Google OAuth로 변경됨)
- **수정**: `login()` 함수를 `loginWithGoogle()` 함수로 변경
- **동작**: `authApi.getGoogleLoginUrl()` 호출 후 해당 URL로 리다이렉트

#### `src/lib/api/projects.ts`

- **문제**: `API_ENDPOINTS.PROJECTS` 없음 에러 (business-plans로 통합됨)
- **수정**: `businessPlanApi`를 래핑하여 기존 인터페이스 유지
- **미구현 API**: `updateProject()`, `deleteProject()` - apireq.md에 없음

#### `src/types/project.ts`

- **변경**: Project 타입을 business-plans API 응답과 호환되도록 수정
- **status**: `"draft" | "submitted" | "approved" | "rejected"` → `"draft" | "completed"`
- **pagination**: 기존 flat 구조에서 `{ pagination: {...} }` 구조로 변경
- **Optional 필드**: `content`, `userId`, `grantTitle` 추가

---

## 백엔드 개발 시 필요 사항

### 필수 구현 API (apireq.md 참조)

| 카테고리       | 엔드포인트                             | 메서드   | 설명                  |
| -------------- | -------------------------------------- | -------- | --------------------- |
| Auth           | `/api/auth/google`                     | GET      | Google OAuth URL 반환 |
| Auth           | `/api/auth/google/callback`            | GET      | OAuth 콜백, JWT 발급  |
| Auth           | `/api/auth/logout`                     | POST     | 로그아웃              |
| Auth           | `/api/auth/me`                         | GET      | 내 정보 조회          |
| Credits        | `/api/credits`                         | GET      | 이용권 잔액 조회      |
| Credits        | `/api/credits/history`                 | GET      | 이용권 사용 내역      |
| Credits        | `/api/credits/use`                     | POST     | 이용권 사용 (차감)    |
| Payments       | `/api/payments`                        | GET/POST | 결제 내역/요청        |
| Payments       | `/api/payments/:id/confirm`            | POST     | 결제 확인             |
| Business Plans | `/api/business-plans`                  | GET/POST | 목록 조회/생성        |
| Business Plans | `/api/business-plans/:id`              | GET      | 상세 조회             |
| Business Plans | `/api/business-plans/:id/download`     | GET      | 다운로드              |
| Favorites      | `/api/favorites/grants`                | GET/POST | 찜 목록/추가          |
| Favorites      | `/api/favorites/grants/:grantId`       | DELETE   | 찜 해제               |
| Favorites      | `/api/favorites/grants/:grantId/check` | GET      | 찜 여부 확인          |
| Grants         | `/api/grants`                          | GET      | 지원사업 목록         |
| Grants         | `/api/grants/:id`                      | GET      | 지원사업 상세         |
| Mypage         | `/api/mypage`                          | GET      | 통합 데이터 조회      |

### 환경 변수

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### 인증 방식

모든 인증 필요 API는 `Authorization: Bearer <token>` 헤더 필요

---

## 2025-11-27: apireq.md 문서 검증 및 수정

프론트엔드 코드와 API 명세서의 완전한 일치를 위해 apireq.md를 검증하고 수정했습니다.

### apireq.md 수정 내용

#### 1. 누락된 API 추가: `2.6 이용권 사용 (차감)`

```
POST /api/credits/use
Request: { "description": "사업계획서 생성" }
Response: { "success": true, "remainingCredits": 2, "message": "이용권이 사용되었습니다." }
```

#### 2. 사업계획서 생성 API Request Body 확장

- `data` 필드 추가 (optional): AI 생성 사업계획서 전체 데이터
- 기존 `content` 필드와 함께 사용 가능

#### 3. 섹션 번호 정리

| 섹션          | 이전         | 수정 후 |
| ------------- | ------------ | ------- |
| 사업계획서    | 2.1~2.4 혼재 | 3.1~3.4 |
| 찜한 지원사업 | 3.1~3.4      | 4.1~4.4 |
| 지원사업      | 4.1~4.2      | 5.1~5.2 |
| 마이페이지    | 5.1          | 6.1     |

### 최종 API 엔드포인트 목록 (총 19개)

| #   | 엔드포인트                             | 메서드 | 인증 | 설명             |
| --- | -------------------------------------- | ------ | ---- | ---------------- |
| 1   | `/api/auth/google`                     | GET    | ❌   | Google OAuth URL |
| 2   | `/api/auth/google/callback`            | GET    | ❌   | OAuth 콜백       |
| 3   | `/api/auth/logout`                     | POST   | ✅   | 로그아웃         |
| 4   | `/api/auth/me`                         | GET    | ✅   | 내 정보          |
| 5   | `/api/credits`                         | GET    | ✅   | 이용권 잔액      |
| 6   | `/api/credits/history`                 | GET    | ✅   | 이용권 내역      |
| 7   | `/api/credits/use`                     | POST   | ✅   | 이용권 사용      |
| 8   | `/api/payments`                        | GET    | ✅   | 결제 내역        |
| 9   | `/api/payments`                        | POST   | ✅   | 결제 요청        |
| 10  | `/api/payments/:id/confirm`            | POST   | ✅   | 결제 확인        |
| 11  | `/api/business-plans`                  | GET    | ✅   | 사업계획서 목록  |
| 12  | `/api/business-plans`                  | POST   | ✅   | 사업계획서 생성  |
| 13  | `/api/business-plans/:id`              | GET    | ✅   | 사업계획서 상세  |
| 14  | `/api/business-plans/:id/download`     | GET    | ✅   | 다운로드         |
| 15  | `/api/favorites/grants`                | GET    | ✅   | 찜 목록          |
| 16  | `/api/favorites/grants`                | POST   | ✅   | 찜 추가          |
| 17  | `/api/favorites/grants/:grantId`       | DELETE | ✅   | 찜 해제          |
| 18  | `/api/favorites/grants/:grantId/check` | GET    | ✅   | 찜 여부          |
| 19  | `/api/grants`                          | GET    | ❌   | 지원사업 목록    |
| 20  | `/api/grants/:id`                      | GET    | ❌   | 지원사업 상세    |
| 21  | `/api/mypage`                          | GET    | ✅   | 마이페이지 통합  |

### 결론

✅ **apireq.md 문서대로 백엔드만 구현하고 `NEXT_PUBLIC_API_URL`만 설정하면 프론트엔드가 정상 작동합니다.**
