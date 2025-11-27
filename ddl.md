# ZeroCraft Database Schema (MySQL DDL)

## 개요

ZeroCraft 플랫폼의 데이터베이스 스키마입니다. MySQL 8.0 이상을 권장합니다.

---

## 데이터베이스 생성

```sql
CREATE DATABASE IF NOT EXISTS zerocraft
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE zerocraft;
```

---

## 테이블 구조

### 1. 사용자 테이블 (users)

Google OAuth 인증을 통한 사용자 정보를 저장합니다.

```sql
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    profile_image VARCHAR(500),
    google_id VARCHAR(100) UNIQUE,
    credits INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_users_email (email),
    INDEX idx_users_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼          | 타입         | 설명              |
| ------------- | ------------ | ----------------- |
| id            | VARCHAR(36)  | UUID 기본키       |
| email         | VARCHAR(255) | 이메일 (유니크)   |
| name          | VARCHAR(100) | 사용자 이름       |
| profile_image | VARCHAR(500) | 프로필 이미지 URL |
| google_id     | VARCHAR(100) | Google OAuth ID   |
| credits       | INT          | 이용권 잔액       |
| created_at    | TIMESTAMP    | 생성일시          |
| updated_at    | TIMESTAMP    | 수정일시          |

---

### 2. 지원사업 테이블 (grants)

정부 지원사업 정보를 저장합니다.

```sql
CREATE TABLE grants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organization VARCHAR(200) NOT NULL,
    deadline DATE,
    amount VARCHAR(100),
    category VARCHAR(50) NOT NULL,
    status ENUM('open', 'closed', 'upcoming') NOT NULL DEFAULT 'open',
    eligibility TEXT,
    application_method TEXT,
    required_documents JSON,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    contact_website VARCHAR(500),
    views INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_grants_category (category),
    INDEX idx_grants_status (status),
    INDEX idx_grants_deadline (deadline),
    INDEX idx_grants_organization (organization),
    FULLTEXT INDEX ft_grants_search (title, description, organization)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼               | 타입         | 설명                        |
| ------------------ | ------------ | --------------------------- |
| id                 | VARCHAR(36)  | UUID 기본키                 |
| title              | VARCHAR(255) | 지원사업 제목               |
| description        | TEXT         | 상세 설명                   |
| organization       | VARCHAR(200) | 주관 기관                   |
| deadline           | DATE         | 마감일                      |
| amount             | VARCHAR(100) | 지원 금액                   |
| category           | VARCHAR(50)  | 카테고리                    |
| status             | ENUM         | 상태 (open/closed/upcoming) |
| eligibility        | TEXT         | 신청 자격                   |
| application_method | TEXT         | 신청 방법                   |
| required_documents | JSON         | 필요 서류 목록              |
| contact_phone      | VARCHAR(50)  | 연락처 전화                 |
| contact_email      | VARCHAR(255) | 연락처 이메일               |
| contact_website    | VARCHAR(500) | 연락처 웹사이트             |
| views              | INT          | 조회수                      |
| created_at         | TIMESTAMP    | 생성일시                    |
| updated_at         | TIMESTAMP    | 수정일시                    |

---

### 3. 지원사업 태그 테이블 (grant_tags)

지원사업에 사용되는 태그 마스터 테이블입니다.

```sql
CREATE TABLE grant_tags (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_grant_tags_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼       | 타입        | 설명               |
| ---------- | ----------- | ------------------ |
| id         | VARCHAR(36) | UUID 기본키        |
| name       | VARCHAR(50) | 태그 이름 (유니크) |
| created_at | TIMESTAMP   | 생성일시           |

---

### 4. 지원사업-태그 연결 테이블 (grant_tag_mappings)

지원사업과 태그의 다대다(N:M) 관계를 연결합니다.

```sql
CREATE TABLE grant_tag_mappings (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    grant_id VARCHAR(36) NOT NULL,
    tag_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_grant_tag (grant_id, tag_id),
    CONSTRAINT fk_gtm_grant FOREIGN KEY (grant_id) REFERENCES grants(id) ON DELETE CASCADE,
    CONSTRAINT fk_gtm_tag FOREIGN KEY (tag_id) REFERENCES grant_tags(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼       | 타입        | 설명             |
| ---------- | ----------- | ---------------- |
| id         | VARCHAR(36) | UUID 기본키      |
| grant_id   | VARCHAR(36) | 지원사업 ID (FK) |
| tag_id     | VARCHAR(36) | 태그 ID (FK)     |
| created_at | TIMESTAMP   | 생성일시         |

---

### 5. 사업계획서 테이블 (business_plans)

사용자가 작성한 사업계획서를 저장합니다.

```sql
CREATE TABLE business_plans (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    grant_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    content JSON,
    status ENUM('draft', 'completed') NOT NULL DEFAULT 'draft',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_bp_user_id (user_id),
    INDEX idx_bp_grant_id (grant_id),
    INDEX idx_bp_status (status),
    INDEX idx_bp_created_at (created_at),
    CONSTRAINT fk_bp_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bp_grant FOREIGN KEY (grant_id) REFERENCES grants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼       | 타입         | 설명                       |
| ---------- | ------------ | -------------------------- |
| id         | VARCHAR(36)  | UUID 기본키                |
| user_id    | VARCHAR(36)  | 사용자 ID (FK)             |
| grant_id   | VARCHAR(36)  | 지원사업 ID (FK, nullable) |
| title      | VARCHAR(255) | 사업계획서 제목            |
| content    | JSON         | 사업계획서 내용 (JSON)     |
| status     | ENUM         | 상태 (draft/completed)     |
| created_at | TIMESTAMP    | 생성일시                   |
| updated_at | TIMESTAMP    | 수정일시                   |

---

### 6. 찜한 지원사업 테이블 (favorite_grants)

사용자가 찜한 지원사업을 저장합니다.

```sql
CREATE TABLE favorite_grants (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    grant_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uk_user_grant (user_id, grant_id),
    INDEX idx_fg_user_id (user_id),
    INDEX idx_fg_grant_id (grant_id),
    CONSTRAINT fk_fg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_fg_grant FOREIGN KEY (grant_id) REFERENCES grants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼       | 타입        | 설명             |
| ---------- | ----------- | ---------------- |
| id         | VARCHAR(36) | UUID 기본키      |
| user_id    | VARCHAR(36) | 사용자 ID (FK)   |
| grant_id   | VARCHAR(36) | 지원사업 ID (FK) |
| created_at | TIMESTAMP   | 생성일시         |

---

### 7. 결제 테이블 (payments)

이용권 구매 결제 정보를 저장합니다.

```sql
CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    order_id VARCHAR(100) NOT NULL UNIQUE,
    product_id VARCHAR(50) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    amount INT NOT NULL,
    credits_added INT NOT NULL DEFAULT 1,
    payment_method VARCHAR(50),
    status ENUM('pending', 'completed', 'failed', 'cancelled', 'refunded') NOT NULL DEFAULT 'pending',
    payment_gateway_id VARCHAR(255),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_payments_user_id (user_id),
    INDEX idx_payments_order_id (order_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_created_at (created_at),
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼               | 타입         | 설명               |
| ------------------ | ------------ | ------------------ |
| id                 | VARCHAR(36)  | UUID 기본키        |
| user_id            | VARCHAR(36)  | 사용자 ID (FK)     |
| order_id           | VARCHAR(100) | 주문 번호 (유니크) |
| product_id         | VARCHAR(50)  | 상품 ID            |
| product_name       | VARCHAR(255) | 상품명             |
| amount             | INT          | 결제 금액          |
| credits_added      | INT          | 지급될 이용권 수   |
| payment_method     | VARCHAR(50)  | 결제 수단          |
| status             | ENUM         | 결제 상태          |
| payment_gateway_id | VARCHAR(255) | PG사 거래 ID       |
| paid_at            | TIMESTAMP    | 결제 완료 시간     |
| created_at         | TIMESTAMP    | 생성일시           |
| updated_at         | TIMESTAMP    | 수정일시           |

---

### 8. 이용권 사용 내역 테이블 (credit_history)

이용권의 구매/사용 내역을 기록합니다.

```sql
CREATE TABLE credit_history (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    type ENUM('purchase', 'use', 'refund', 'bonus') NOT NULL,
    amount INT NOT NULL,
    description VARCHAR(255),
    business_plan_id VARCHAR(36),
    payment_id VARCHAR(36),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_ch_user_id (user_id),
    INDEX idx_ch_type (type),
    INDEX idx_ch_created_at (created_at),
    CONSTRAINT fk_ch_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ch_business_plan FOREIGN KEY (business_plan_id) REFERENCES business_plans(id) ON DELETE SET NULL,
    CONSTRAINT fk_ch_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼             | 타입         | 설명                             |
| ---------------- | ------------ | -------------------------------- |
| id               | VARCHAR(36)  | UUID 기본키                      |
| user_id          | VARCHAR(36)  | 사용자 ID (FK)                   |
| type             | ENUM         | 유형 (purchase/use/refund/bonus) |
| amount           | INT          | 변동량 (+구매, -사용)            |
| description      | VARCHAR(255) | 설명                             |
| business_plan_id | VARCHAR(36)  | 관련 사업계획서 ID (FK)          |
| payment_id       | VARCHAR(36)  | 관련 결제 ID (FK)                |
| created_at       | TIMESTAMP    | 생성일시                         |

---

### 9. 리프레시 토큰 테이블 (refresh_tokens)

JWT 리프레시 토큰을 저장합니다.

```sql
CREATE TABLE refresh_tokens (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_rt_user_id (user_id),
    INDEX idx_rt_token (token(255)),
    INDEX idx_rt_expires_at (expires_at),
    CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

| 컬럼       | 타입         | 설명           |
| ---------- | ------------ | -------------- |
| id         | VARCHAR(36)  | UUID 기본키    |
| user_id    | VARCHAR(36)  | 사용자 ID (FK) |
| token      | VARCHAR(500) | 리프레시 토큰  |
| expires_at | TIMESTAMP    | 만료 시간      |
| created_at | TIMESTAMP    | 생성일시       |

---

## ERD (Entity Relationship Diagram)

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   users     │       │ business_plans  │       │   grants    │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)         │    ┌──│ id (PK)     │
│ email       │  │    │ user_id (FK)    │────┘  │ title       │
│ name        │  │    │ grant_id (FK)   │───────│ organization│
│ google_id   │  │    │ title           │       │ deadline    │
│ credits     │  │    │ content (JSON)  │       │ category    │
│ created_at  │  │    │ status          │       │ status      │
└─────────────┘  │    │ created_at      │       └─────────────┘
                 │    └─────────────────┘              │
                 │                                     │
                 │    ┌─────────────────┐              │
                 │    │ favorite_grants │              │
                 │    ├─────────────────┤              │
                 ├────│ user_id (FK)    │              │
                 │    │ grant_id (FK)   │──────────────┤
                 │    │ created_at      │              │
                 │    └─────────────────┘              │
                 │                                     │
                 │    ┌─────────────────┐    ┌────────────────────┐
                 │    │    payments     │    │ grant_tag_mappings │
                 │    ├─────────────────┤    ├────────────────────┤
                 ├────│ user_id (FK)    │    │ grant_id (FK)      │───┤
                 │    │ order_id        │    │ tag_id (FK)        │───┼─┐
                 │    │ amount          │    └────────────────────┘   │ │
                 │    │ status          │                             │ │
                 │    └─────────────────┘    ┌─────────────┐          │ │
                 │           │               │ grant_tags  │          │ │
                 │           │               ├─────────────┤          │ │
                 │           ▼               │ id (PK)     │──────────┘ │
                 │    ┌─────────────────┐    │ name        │            │
                 │    │ credit_history  │    └─────────────┘            │
                 │    ├─────────────────┤                               │
                 └────│ user_id (FK)    │                               │
                      │ type            │                               │
                      │ amount          │                               │
                      │ payment_id (FK) │───────────────────────────────┘
                      └─────────────────┘
```

---

## 초기 데이터

### 태그 기본 데이터

```sql
INSERT INTO grant_tags (id, name) VALUES
    (UUID(), '창업지원'),
    (UUID(), 'R&D'),
    (UUID(), '수출지원'),
    (UUID(), '고용지원'),
    (UUID(), '금융지원'),
    (UUID(), '마케팅'),
    (UUID(), '교육훈련'),
    (UUID(), '컨설팅'),
    (UUID(), '시설지원'),
    (UUID(), '기술개발'),
    (UUID(), '소상공인'),
    (UUID(), '중소기업'),
    (UUID(), '벤처기업'),
    (UUID(), '예비창업자'),
    (UUID(), '청년창업'),
    (UUID(), '여성기업'),
    (UUID(), '사회적기업'),
    (UUID(), '1인기업');
```

---

## 인덱스 전략

| 인덱스                | 테이블          | 용도                     |
| --------------------- | --------------- | ------------------------ |
| `idx_users_email`     | users           | 이메일 기반 로그인/조회  |
| `idx_users_google_id` | users           | Google OAuth 인증        |
| `idx_grants_category` | grants          | 카테고리별 필터링        |
| `idx_grants_status`   | grants          | 상태별 필터링            |
| `idx_grants_deadline` | grants          | 마감일 정렬              |
| `ft_grants_search`    | grants          | 전문 검색 (Full-Text)    |
| `idx_bp_user_id`      | business_plans  | 사용자별 사업계획서 조회 |
| `uk_user_grant`       | favorite_grants | 중복 찜 방지             |
| `idx_payments_status` | payments        | 결제 상태별 조회         |
| `idx_ch_user_id`      | credit_history  | 사용자별 이용권 내역     |

---

## 주요 쿼리 예시

### 1. 사용자의 사업계획서 목록 조회

```sql
SELECT
    bp.*,
    g.title AS grant_title
FROM business_plans bp
LEFT JOIN grants g ON bp.grant_id = g.id
WHERE bp.user_id = ?
ORDER BY bp.updated_at DESC
LIMIT ? OFFSET ?;
```

### 2. 지원사업 전문 검색 (Full-Text)

```sql
SELECT
    *,
    MATCH(title, description, organization)
    AGAINST(? IN NATURAL LANGUAGE MODE) AS relevance
FROM grants
WHERE MATCH(title, description, organization)
      AGAINST(? IN NATURAL LANGUAGE MODE)
  AND status = 'open'
ORDER BY relevance DESC
LIMIT ? OFFSET ?;
```

### 3. 찜한 지원사업 목록 조회

```sql
SELECT fg.*, g.*
FROM favorite_grants fg
JOIN grants g ON fg.grant_id = g.id
WHERE fg.user_id = ?
ORDER BY fg.created_at DESC;
```

### 4. 이용권 차감

```sql
-- 트랜잭션으로 처리
START TRANSACTION;

UPDATE users
SET credits = credits - 1
WHERE id = ? AND credits > 0;

INSERT INTO credit_history (user_id, type, amount, description, business_plan_id)
VALUES (?, 'use', -1, '사업계획서 생성', ?);

COMMIT;
```

### 5. 마이페이지 통합 조회

```sql
SELECT
    u.*,
    (SELECT COUNT(*) FROM business_plans WHERE user_id = u.id) AS business_plan_count,
    (SELECT COUNT(*) FROM favorite_grants WHERE user_id = u.id) AS favorite_count
FROM users u
WHERE u.id = ?;
```

### 6. 카테고리 + 태그 필터링

```sql
SELECT DISTINCT g.*
FROM grants g
JOIN grant_tag_mappings gtm ON g.id = gtm.grant_id
JOIN grant_tags gt ON gtm.tag_id = gt.id
WHERE g.category = ?
  AND gt.name IN (?, ?, ?)
  AND g.status = 'open'
ORDER BY g.deadline ASC;
```

### 7. 결제 완료 처리

```sql
START TRANSACTION;

-- 결제 상태 업데이트
UPDATE payments
SET status = 'completed', paid_at = NOW()
WHERE id = ? AND status = 'pending';

-- 이용권 지급
UPDATE users
SET credits = credits + (SELECT credits_added FROM payments WHERE id = ?)
WHERE id = ?;

-- 내역 기록
INSERT INTO credit_history (user_id, type, amount, description, payment_id)
VALUES (?, 'purchase', (SELECT credits_added FROM payments WHERE id = ?), '이용권 구매', ?);

COMMIT;
```

---

## 테이블 요약

| 테이블명             | 설명               | 주요 관계                                                 |
| -------------------- | ------------------ | --------------------------------------------------------- |
| `users`              | 사용자 정보        | 1:N → business_plans, favorite_grants, payments           |
| `grants`             | 지원사업 정보      | 1:N → business_plans, favorite_grants, grant_tag_mappings |
| `grant_tags`         | 태그 마스터        | 1:N → grant_tag_mappings                                  |
| `grant_tag_mappings` | 지원사업-태그 연결 | N:1 → grants, grant_tags                                  |
| `business_plans`     | 사업계획서         | N:1 → users, grants                                       |
| `favorite_grants`    | 찜한 지원사업      | N:1 → users, grants                                       |
| `payments`           | 결제 정보          | N:1 → users                                               |
| `credit_history`     | 이용권 내역        | N:1 → users, business_plans, payments                     |
| `refresh_tokens`     | 리프레시 토큰      | N:1 → users                                               |
