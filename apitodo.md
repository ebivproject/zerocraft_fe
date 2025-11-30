💰 결제 API 라우팅 (/api/payments)

1. 결제 준비
   POST /api/payments
   Request:
   {
   "productId": "business_plan_1",
   "couponCode": "WELCOME30" // 선택사항
   }
   Response:
   {
   "paymentId": "uuid",
   "orderId": "ORDER_1701234567890_abc12345",
   "amount": 20000, // 쿠폰 적용 후 최종 금액
   "productName": "AI 사업계획서 이용권 1회",
   "customerName": "홍길동",
   "customerEmail": "user@example.com"
   }
2. 결제 승인 (토스페이먼츠)
   POST /api/payments/confirm
   Request:
   {
   "orderId": "ORDER*1701234567890_abc12345",
   "paymentKey": "토스페이먼츠*결제키",
   "amount": 20000
   }
   Response:
   {
   "paymentId": "uuid",
   "orderId": "ORDER_1701234567890_abc12345",
   "status": "completed",
   "creditsAdded": 1,
   "currentCredits": 5,
   "message": "결제가 완료되었습니다. 이용권 1회가 지급되었습니다."
   }
3. 결제 내역 조회
   GET /api/payments?page=1&limit=10
   Response:
   {
   "data": [
   {
   "id": "uuid",
   "orderId": "ORDER_xxx",
   "productName": "AI 사업계획서 이용권 1회",
   "amount": 50000,
   "creditsAdded": 1,
   "status": "completed",
   "paymentMethod": "card",
   "createdAt": "2024-11-29T..."
   }
   ],
   "pagination": {
   "page": 1,
   "limit": 10,
   "total": 5,
   "totalPages": 1
   }
   }
   📦 사용 가능한 productId
   "business_plan_1" → 1회 이용권 (50,000원)
   "business_plan_3" → 3회 이용권 (79,900원)
   "business_plan_5" → 5회 이용권 (119,900원)
   🔐 인증
   모든 엔드포인트는 JWT 토큰 필요:
   Authorization: Bearer {token}
