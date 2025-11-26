# API 명세서

## 1. 인증 (Auth) - Google OAuth 2.0

### 1.1 Google 로그인 URL 요청
- **URL**: `/api/auth/google`
- **Method**: `GET`
- **Description**: Google OAuth 인증 페이지로 리다이렉트할 URL을 반환합니다.
- **Response (200 OK)**:
  ```json
  {
    "url": "https://accounts.google.com/o/oauth2/v2/auth?client_id=...&redirect_uri=...&scope=email%20profile"
  }
  ```

### 1.2 Google OAuth 콜백
- **URL**: `/api/auth/google/callback`
- **Method**: `GET`
- **Description**: Google OAuth 인증 후 콜백을 처리하고 JWT 토큰을 발급합니다.
- **Query Parameters**:
  - `code`: Google에서 전달받은 인증 코드
  - `state`: CSRF 방지용 상태 값
- **Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-v4",
      "email": "user@gmail.com",
      "name": "홍길동",
      "profileImage": "https://lh3.googleusercontent.com/...",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
  ```
- **Response (401 Unauthorized)**:
  ```json
  {
    "message": "Google 인증에 실패했습니다."
  }
  ```

### 1.3 로그아웃
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Description**: 서버 측에서 세션을 종료하거나 쿠키를 삭제합니다. (JWT의 경우 클라이언트에서 토큰 삭제로 처리 가능하지만, 서버 측 블랙리스트 처리를 위해 호출할 수 있음)
- **Response (200 OK)**:
  ```json
  {
    "message": "로그아웃 되었습니다."
  }
  ```

### 1.4 내 정보 조회
- **URL**: `/api/auth/me`
- **Method**: `GET`
- **Description**: 현재 로그인한 사용자의 정보를 조회합니다. Authorization 헤더에 Bearer Token이 필요합니다.
- **Headers**:
  - `Authorization`: `Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "id": "uuid-v4",
    "email": "user@example.com",
    "name": "홍길동",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
  ```
- **Response (401 Unauthorized)**:
  ```json
  {
    "message": "인증되지 않은 사용자입니다."
  }
  ```
