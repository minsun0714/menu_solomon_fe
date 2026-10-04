# 메뉴솔로몬 API 명세

> 투표 생성·수정·삭제, 후보, 투표 참여, 메뉴 확정 API는 정책 확정 전이므로 제외한다. 확정 점심 히스토리 조회는 포함한다.

## 1. 공통 규칙

- Base URL: `/api`
- 요청과 응답은 JSON을 사용한다.
- 프론트는 모든 요청에 `credentials: include`를 설정한다.
- 날짜는 ISO 8601 UTC 문자열로 전달한다.
- 오늘, 주간, 월간 계산은 `Asia/Seoul`을 기준으로 한다.
- 목록의 검색, 필터, 정렬은 서버에서 처리한다.

### 배포 Origin과 CORS

운영 환경은 FE와 BE가 같은 최상위 도메인을 사용하고, BE에만 `api.` 서브도메인을 붙이는 방식으로 구성한다.

```text
FE: https://example.com
BE: https://api.example.com
```

두 주소는 같은 scheme과 등록 가능 도메인을 사용하는 same-site 구성이다. 다만 origin은 서로 다르므로 백엔드는 credential CORS를 활성화하고 허용 Origin을 정확한 프론트 Origin으로 제한한다.

```http
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Credentials: true
Vary: Origin
```

- `Access-Control-Allow-Origin: *`와 credential 요청을 함께 사용하면 안 된다.
- 필요한 `OPTIONS` preflight 요청을 처리한다.
- 로컬 개발 Origin은 별도 환경 설정으로 `http://localhost:5173`만 추가한다.
- 프론트는 모든 fetch/XHR 요청에 `credentials: include`를 사용한다.
- 실제 운영 도메인을 환경 변수로 관리하며 `Access-Control-Allow-Origin`에는 정확한 FE Origin만 넣는다.

성공 응답:

```json
{ "data": {} }
```

오류 응답은 RFC 9457 `ProblemDetail` 형식을 사용한다.

```http
Content-Type: application/problem+json
```

```json
{
  "type": "https://api.example.com/problems/not-team-member",
  "title": "팀 접근 권한 없음",
  "status": 403,
  "detail": "해당 팀의 멤버만 접근할 수 있습니다.",
  "instance": "/api/teams/team_1",
  "code": "NOT_TEAM_MEMBER"
}
```

- `type`: 문제 유형을 식별하는 안정적인 URI
- `title`: 문제 유형에 대한 짧고 고정된 제목
- `status`: HTTP 상태 코드와 동일한 숫자
- `detail`: 현재 요청에서 발생한 문제에 대한 사용자 표시 가능 설명
- `instance`: 문제가 발생한 요청 경로
- `code`: 프론트 UI 분기를 위한 서비스 전용 확장 필드
- `fieldErrors`: 필드 검증 실패 시에만 포함하는 확장 필드
- 운영 응답에는 예외 클래스명, 스택 트레이스, SQL 등 내부 정보를 포함하지 않는다.

| 상태 | 의미 |
| --- | --- |
| `400` | 잘못된 요청값 |
| `401` | 익명 세션을 확인하거나 생성하지 못함 |
| `403` | 팀원 또는 관리자 권한 부족 |
| `404` | 리소스를 찾을 수 없음 |
| `409` | 중복 가입, 중복 식당 등 상태 충돌 |

## 2. 익명 사용자 세션

별도의 로그인 기능은 없다.

- 최초로 사용자 식별이 필요한 요청을 보낼 때 서버가 익명 사용자와 세션을 생성한다.
- 브라우저에는 추측하기 어려운 세션 토큰만 `HttpOnly` 쿠키로 저장한다.
- 사용자 ID와 세션 정보는 서버의 공용 DB 또는 Redis에 저장한다.
- 서버가 여러 대여도 동일한 세션 저장소를 사용한다.
- 같은 브라우저에서는 같은 사용자로 식별하며 한 사용자가 여러 팀에 가입할 수 있다.
- 쿠키가 삭제되거나 다른 브라우저에서 접속하면 새로운 사용자로 인식한다.
- 초대 링크 미리보기 API는 세션 쿠키 없이 호출할 수 있으며, 미리보기 조회만으로 익명 사용자나 세션을 생성하지 않는다.
- 익명 사용자와 세션은 `GET /api/session/me` 또는 팀 생성·가입처럼 사용자 식별이 필요한 변경 요청에서만 생성한다.

쿠키 예시:

```http
Set-Cookie: menu_solomon_session={opaqueToken}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=31536000
```

세션 쿠키는 API 호스트가 발급하는 host-only 쿠키로 사용하고 `Domain` 속성은 생략한다. 프론트 JavaScript가 쿠키를 직접 읽을 필요는 없다.

### 현재 사용자 조회 및 자동 발급

```http
GET /api/session/me
```

쿠키가 없으면 익명 사용자와 세션을 생성하고 쿠키를 발급한다.

```json
{
  "data": {
    "id": "user_1",
    "nickname": "익명 사용자 1234"
  }
}
```

익명 사용자 닉네임은 서버에서 구분 가능한 값으로 자동 생성한다.

## 3. 권한 정책

공개 조회:

- 초대받은 팀 미리보기

팀원 권한:

- 팀 상세 및 팀원 목록 조회
- 팀 식당 목록·상세와 리뷰 목록 조회
- 사무실 위치 조회
- 확정 점심 히스토리 조회
- 팀 식당 추가·삭제
- 내 리뷰 저장(생성 또는 덮어쓰기)·삭제
- 사무실 위치 설정
- 팀 탈퇴
- 현재 초대 링크 조회

관리자 권한:

- 팀 정보 수정·삭제
- 관리자 위임
- 초대 링크 재발급

## 4. 팀

### 내 팀 목록

```http
GET /api/teams?sort=LATEST_LUNCH
```

현재 익명 사용자가 가입한 팀을 페이지네이션 없이 모두 반환한다. 정렬은 서버에서 처리한다.

정렬값:

- `LATEST_LUNCH`: 최근 확정 점심 순, 기본값
- `NAME`: 이름 순
- `MEMBER_COUNT`: 멤버 많은 순

```json
{
  "data": [
    {
      "id": "team_1",
      "name": "솔로몬 개발팀",
      "description": "점심 메뉴를 함께 정해요",
      "memberCount": 6,
      "myRole": "ADMIN",
      "latestLunch": {
        "restaurantName": "을지다락",
        "confirmedAt": "2026-10-04T03:00:00Z"
      }
    }
  ]
}
```

확정 점심이 없으면 `latestLunch`는 `null`이다.

### 팀 상세

```http
GET /api/teams/{teamId}
```

팀원만 조회할 수 있다. 세션이 없거나 해당 팀의 멤버가 아니면 `403 NOT_TEAM_MEMBER`를 반환한다.

```json
{
  "data": {
    "id": "team_1",
    "name": "솔로몬 개발팀",
    "description": "점심 메뉴를 함께 정해요",
    "memberCount": 6,
    "myRole": "ADMIN"
  }
}
```

`myRole`은 현재 요청의 익명 세션 사용자를 기준으로 한다.

- 관리자: `ADMIN`
- 일반 팀원: `MEMBER`

프론트는 이 필드로 관리자 메뉴, 팀 탈퇴, 식당 등록 등 팀원 전용 UI의 노출 여부를 결정한다.

### 팀 생성

```http
POST /api/teams
```

```json
{
  "name": "솔로몬 개발팀",
  "description": "점심 메뉴를 함께 정해요"
}
```

- `name`은 필수이며 공백일 수 없다.
- `description`은 선택이며 미입력 시 빈 문자열로 저장한다.
- 생성자를 최초 `ADMIN` 멤버로 등록하고 초대 링크를 함께 생성한다.
- `201 Created`로 생성된 팀과 최초 초대 링크를 반환한다.

응답:

```json
{
  "data": {
    "id": "team_1",
    "name": "솔로몬 개발팀",
    "description": "점심 메뉴를 함께 정해요",
    "myRole": "ADMIN",
    "inviteUrl": "https://example.com/invite/랜덤토큰"
  }
}
```

프론트는 응답의 `id`를 이용해 `/teams/{id}`로 이동한다. `inviteUrl`은 생성 완료 화면에서 즉시 공유할 수 있다.

### 팀 정보 수정

```http
PATCH /api/teams/{teamId}
```

관리자만 가능하다.

부분 수정 규칙:

- `name`, `description`은 모두 선택 필드다.
- 전송하지 않은 필드는 기존 값을 유지한다.
- `description: ""`은 팀 소개를 빈 문자열로 저장한다.
- `name: null`, `description: null`은 허용하지 않는다.
- `name`을 공백 문자열로 보내면 `400 VALIDATION_ERROR`를 반환한다.
- 수정할 필드가 하나도 없으면 `400 VALIDATION_ERROR`를 반환한다.

요청:

```json
{
  "name": "변경된 팀 이름",
  "description": "변경된 소개"
}
```

응답 `200 OK`:

```json
{
  "data": {
    "id": "team_1",
    "name": "변경된 팀 이름",
    "description": "변경된 소개"
  }
}
```

### 팀 삭제

```http
DELETE /api/teams/{teamId}
```

관리자만 가능하며 팀원, 초대 링크, 팀 식당, 리뷰, 사무실 위치, 투표 및 히스토리를 함께 삭제한다. 응답은 `204 No Content`다.

```http
204 No Content
```

## 5. 초대 링크와 가입

사용자가 초대 코드를 직접 입력하거나 복사하는 기능은 제공하지 않는다. 완성된 링크만 노출한다.

```text
https://서비스주소/invite/{inviteToken}
```

`inviteToken`은 예측하기 어려운 랜덤 토큰을 사용한다.

### 초대받은 팀 미리보기

```http
GET /api/invitations/{inviteToken}
```

공개 조회다. 무효화된 링크는 `404`를 반환한다.

```json
{
  "data": {
    "teamId": "team_1",
    "name": "솔로몬 개발팀",
    "description": "점심 메뉴를 함께 정해요",
    "memberCount": 2,
    "isAlreadyMember": false,
    "members": [
      {
        "id": "member_1",
        "role": "ADMIN",
        "joinedAt": "2026-10-01T02:00:00Z",
        "user": {
          "id": "user_1",
          "nickname": "익명 사용자 1234"
        }
      }
    ]
  }
}
```

`isAlreadyMember`는 요청에 기존 세션 쿠키가 있을 때만 해당 사용자 기준으로 계산한다. 세션이 없으면 `false`이며, 이 조회 과정에서 새로운 세션을 만들지 않는다.

### 팀 가입

```http
POST /api/invitations/{inviteToken}/join
```

- 세션이 없으면 익명 사용자와 세션을 먼저 생성한다.
- 최초 가입 역할은 `MEMBER`다.
- 이미 가입했다면 기존 멤버를 `200 OK`로 반환하는 멱등 처리를 권장한다.
- 신규 가입은 `201 Created`다.
- 가입 성공 후 프론트는 `/teams/{teamId}` 실제 팀 화면으로 이동한다.

접근 흐름:

- 세션이 없거나 아직 팀원이 아닌 사용자는 초대 링크 미리보기에서만 팀 정보를 볼 수 있다.
- 초대 토큰 없이 `/teams/{teamId}`에 직접 접근한 비팀원에게는 팀 데이터를 노출하지 않고 `403 NOT_TEAM_MEMBER`를 반환한다.
- 프론트는 `403 NOT_TEAM_MEMBER`를 받으면 실제 팀 화면 대신 "초대 링크로 참여해 주세요" 안내를 표시한다.

응답:

```json
{
  "data": {
    "id": "member_2",
    "teamId": "team_1",
    "userId": "user_2",
    "role": "MEMBER",
    "joinedAt": "2026-10-04T08:30:00Z"
  }
}
```

### 현재 초대 링크 조회

```http
GET /api/teams/{teamId}/invitation
```

팀원만 가능하다.

```json
{
  "data": {
    "inviteUrl": "https://서비스주소/invite/랜덤토큰"
  }
}
```

### 초대 링크 재발급

```http
POST /api/teams/{teamId}/invitation/regenerate
```

관리자만 가능하다. 기존 링크를 즉시 무효화하고 새로운 `inviteUrl`을 반환한다.

응답 `200 OK`:

```json
{
  "data": {
    "inviteUrl": "https://example.com/invite/새로운랜덤토큰"
  }
}
```

## 6. 팀원

### 팀원 목록

```http
GET /api/teams/{teamId}/members
```

팀원만 조회할 수 있다.

```json
{
  "data": [
    {
      "id": "member_1",
      "teamId": "team_1",
      "userId": "user_1",
      "role": "ADMIN",
      "joinedAt": "2026-10-01T02:00:00Z",
      "user": {
        "id": "user_1",
        "nickname": "익명 사용자 1234"
      }
    }
  ]
}
```

역할은 `ADMIN` 또는 `MEMBER`다.

### 관리자 위임

```http
POST /api/teams/{teamId}/admin-transfer
```

```json
{ "nextAdminMemberId": "member_2" }
```

현재 관리자만 가능하다. 대상 멤버를 `ADMIN`, 기존 관리자를 `MEMBER`로 변경하며 하나의 트랜잭션으로 처리한다.

응답:

```http
204 No Content
```

### 팀 탈퇴

```http
DELETE /api/teams/{teamId}/members/me
```

- 일반 멤버는 즉시 탈퇴한다.
- 다른 멤버가 있는 관리자는 `409 ADMIN_TRANSFER_REQUIRED`를 반환한다.
- 관리자 혼자 남았다면 팀과 관련 데이터를 즉시 삭제한다.

성공 응답:

```http
204 No Content
```

위임이 필요한 경우:

```json
{
  "type": "https://api.example.com/problems/admin-transfer-required",
  "title": "관리자 권한 위임 필요",
  "status": 409,
  "detail": "관리자 권한을 위임한 후 탈퇴해 주세요.",
  "instance": "/api/teams/team_1/members/me",
  "code": "ADMIN_TRANSFER_REQUIRED"
}
```

### 관리자 위임 후 탈퇴

```http
POST /api/teams/{teamId}/members/me/transfer-and-leave
```

```json
{ "nextAdminMemberId": "member_2" }
```

대상 멤버를 관리자로 변경하고 현재 관리자를 탈퇴시키는 작업을 하나의 트랜잭션으로 처리한다.

응답:

```http
204 No Content
```

## 7. 카카오 장소 검색

카카오 REST API 키를 프론트에 노출하지 않고 백엔드가 프록시한다.

```http
GET /api/places/search?query=역삼%20한식&page=1&size=5
```

- `query`: 필수
- `page`: 기본값 `1`
- `size`: 기본값 `5`

응답 `200 OK`:

```json
{
  "data": {
    "items": [
      {
        "kakaoPlaceId": "12345678",
        "name": "맛있는 식당",
        "address": "서울 강남구 테헤란로 123",
        "latitude": 37.501,
        "longitude": 127.039,
        "category": "한식"
      }
    ],
    "page": 1,
    "pageSize": 5,
    "totalCount": 20,
    "totalPages": 4,
    "hasNextPage": true
  }
}
```

## 8. 팀 식당

### 팀 식당 목록

```http
GET /api/teams/{teamId}/restaurants?keyword=강남&category=한식&sort=RATING_DESC
```

팀원만 조회할 수 있다. 검색, 필터, 정렬은 서버에서 처리한다.

- `keyword`: 식당명, 메뉴·카테고리, 주소·지역 검색
- `category`: 카테고리 필터
- `sort=RATING_DESC`: 별점 높은 순
- `sort=LATEST`: 최근 등록 순
- `sort=NAME`: 이름 순

```json
{
  "data": {
    "items": [
      {
        "id": "team_restaurant_1",
        "teamId": "team_1",
        "restaurantId": "restaurant_1",
        "registeredByTeamMemberId": "member_1",
        "registeredByNickname": "익명 사용자 1234",
        "createdAt": "2026-10-04T08:30:00Z",
        "restaurant": {
          "id": "restaurant_1",
          "kakaoPlaceId": "12345678",
          "name": "맛있는 식당",
          "address": "서울 강남구 테헤란로 123",
          "latitude": 37.501,
          "longitude": 127.039,
          "category": "한식"
        },
        "averageRating": 4.5,
        "reviewCount": 7,
        "latestReview": {
          "id": "review_1",
          "teamMemberId": "member_2",
          "rating": 5,
          "content": "김치찌개가 맛있어요.",
          "authorNickname": "익명 사용자 5678",
          "createdAt": "2026-10-03T03:00:00Z",
          "updatedAt": "2026-10-03T03:00:00Z"
        }
      }
    ],
    "totalCount": 6,
    "reviewCount": 7,
    "categoryCounts": {
      "전체": 6,
      "한식": 2,
      "아시안": 1,
      "양식": 2,
      "일식": 1
    }
  }
}
```

`categoryCounts`는 선택된 카테고리와 무관하게 팀 전체 식당을 기준으로 계산한다.

### 팀 식당 상세

```http
GET /api/teams/{teamId}/restaurants/{teamRestaurantId}
```

팀원만 조회할 수 있으며 목록의 개별 객체와 같은 구조를 반환한다.

응답 `200 OK`:

```json
{
  "data": {
    "id": "team_restaurant_1",
    "teamId": "team_1",
    "restaurantId": "restaurant_1",
    "registeredByTeamMemberId": "member_1",
    "registeredByNickname": "익명 사용자 1234",
    "createdAt": "2026-10-04T08:30:00Z",
    "restaurant": {
      "id": "restaurant_1",
      "kakaoPlaceId": "12345678",
      "name": "맛있는 식당",
      "address": "서울 강남구 테헤란로 123",
      "latitude": 37.501,
      "longitude": 127.039,
      "category": "한식"
    },
    "averageRating": 4.5,
    "reviewCount": 7,
    "latestReview": null
  }
}
```

### 팀 식당 등록

```http
POST /api/teams/{teamId}/restaurants
```

모든 팀원이 가능하다.

```json
{ "kakaoPlaceId": "12345678" }
```

서버가 카카오 API로 장소 정보를 다시 조회하여 저장한다. 같은 팀에 이미 등록된 장소면 `409 RESTAURANT_ALREADY_REGISTERED`를 반환한다.

응답 `201 Created`:

```json
{
  "data": {
    "id": "team_restaurant_1",
    "teamId": "team_1",
    "restaurantId": "restaurant_1",
    "registeredByTeamMemberId": "member_1",
    "createdAt": "2026-10-04T08:30:00Z"
  }
}
```

### 팀 식당 삭제

```http
DELETE /api/teams/{teamId}/restaurants/{teamRestaurantId}
```

모든 팀원이 가능하다. 팀 식당 연결과 해당 팀의 리뷰를 삭제하되, 다른 팀에서 사용하는 식당 원본은 삭제하지 않는다.

응답:

```http
204 No Content
```

## 9. 사무실 위치

사무실 위치는 브라우저가 아닌 팀 공용 데이터로 저장한다.

### 조회

```http
GET /api/teams/{teamId}/office-location
```

팀원만 조회할 수 있다. 미설정 시 `{ "data": null }`을 반환한다.

```json
{
  "data": {
    "kakaoPlaceId": "987654",
    "name": "솔로몬 오피스",
    "address": "서울 강남구 테헤란로 152",
    "latitude": 37.5009,
    "longitude": 127.0364
  }
}
```

### 등록 또는 변경

```http
PUT /api/teams/{teamId}/office-location
```

모든 팀원이 가능하다.

```json
{ "kakaoPlaceId": "987654" }
```

서버가 카카오 API로 장소 정보를 다시 조회하여 저장한다.

응답 `200 OK`:

```json
{
  "data": {
    "kakaoPlaceId": "987654",
    "name": "솔로몬 오피스",
    "address": "서울 강남구 테헤란로 152",
    "latitude": 37.5009,
    "longitude": 127.0364
  }
}
```

## 10. 리뷰와 별점

정책:

- 팀원만 작성 가능
- 한 팀원은 한 팀 식당에 리뷰 하나만 작성 가능
- 저장 요청 시 기존 내 리뷰가 있으면 해당 리뷰를 덮어쓴다.
- 다른 팀원의 리뷰는 변경할 수 없으며 본인의 리뷰만 삭제할 수 있다.
- 별점은 1~5
- 내용은 필수이며 최대 200자
- DB에 `UNIQUE(team_restaurant_id, team_member_id)` 제약을 둔다.

### 리뷰 목록

```http
GET /api/teams/{teamId}/restaurants/{teamRestaurantId}/reviews
```

팀원만 조회할 수 있으며 최신순으로 반환한다.

`isMine`은 현재 요청에 포함된 익명 세션 사용자를 기준으로 계산한다. 현재 팀원이 해당 리뷰 작성자면 `true`, 다른 팀원이 작성했다면 `false`다.

```json
{
  "data": [
    {
      "id": "review_1",
      "teamRestaurantId": "team_restaurant_1",
      "teamMemberId": "member_1",
      "rating": 5,
      "content": "김치찌개가 맛있어요.",
      "authorNickname": "익명 사용자 1234",
      "createdAt": "2026-10-04T08:30:00Z",
      "updatedAt": "2026-10-04T08:30:00Z",
      "isMine": true
    }
  ]
}
```

### 내 리뷰 저장(Upsert)

```http
PUT /api/teams/{teamId}/restaurants/{teamRestaurantId}/reviews/me
```

```json
{
  "rating": 5,
  "content": "김치찌개가 맛있어요."
}
```

- 없으면 생성하고 `201 Created`를 반환한다.
- 있으면 같은 리뷰 레코드의 별점과 내용을 덮어쓰고 `200 OK`를 반환한다.
- 기존 리뷰가 있어도 `409`를 반환하지 않는다.
- 별도의 리뷰 수정 엔드포인트는 제공하지 않는다.

응답:

```json
{
  "data": {
    "id": "review_1",
    "teamRestaurantId": "team_restaurant_1",
    "teamMemberId": "member_1",
    "rating": 5,
    "content": "김치찌개가 맛있어요.",
    "createdAt": "2026-10-04T08:30:00Z",
    "updatedAt": "2026-10-04T08:30:00Z"
  }
}
```

### 내 리뷰 삭제

```http
DELETE /api/teams/{teamId}/restaurants/{teamRestaurantId}/reviews/me
```

본인의 리뷰만 삭제하며 `204 No Content`를 반환한다.

```http
204 No Content
```

## 11. 확정 점심 히스토리

### 주간 조회

```http
GET /api/teams/{teamId}/lunch-history?view=WEEK&date=2026-10-04
```

- `date`가 포함된 주를 조회한다.
- 주 시작일은 월요일이다.
- `Asia/Seoul`을 기준으로 계산한다.

### 월간 조회

```http
GET /api/teams/{teamId}/lunch-history?view=MONTH&month=2026-10
```

팀원만 조회할 수 있으며 최신 확정순으로 반환한다.

```json
{
  "data": [
    {
      "decisionId": "decision_1",
      "sessionId": "vote_1",
      "confirmedAt": "2026-10-04T03:00:00Z",
      "restaurant": {
        "id": "restaurant_1",
        "kakaoPlaceId": "12345678",
        "name": "맛있는 식당",
        "address": "서울 강남구 테헤란로 123",
        "latitude": 37.501,
        "longitude": 127.039,
        "category": "한식"
      },
      "confirmationType": "MANUAL",
      "confirmedByNickname": "익명 사용자 1234"
    }
  ]
}
```

## 12. 에러 코드

모든 오류는 `application/problem+json`으로 반환한다. 프론트는 HTTP 상태와 `ProblemDetail`의 `code` 확장 필드를 기준으로 토스트, 안내 문구, 권한 위임 모달 등을 구분한다.

`type`은 다음 규칙으로 구성한다.

```text
https://api.example.com/problems/{code를 kebab-case로 변환한 값}
```

예시:

```text
NOT_TEAM_MEMBER → https://api.example.com/problems/not-team-member
```

| HTTP | code | 의미 |
| --- | --- | --- |
| `400` | `VALIDATION_ERROR` | 필수값 누락, 형식 오류, 빈 이름 등 요청값 오류 |
| `401` | `SESSION_REQUIRED` | 유효한 익명 세션을 확인할 수 없음 |
| `403` | `NOT_TEAM_MEMBER` | 해당 팀의 멤버가 아님 |
| `403` | `ADMIN_REQUIRED` | 팀 관리자 권한이 필요함 |
| `404` | `TEAM_NOT_FOUND` | 팀을 찾을 수 없음 |
| `404` | `MEMBER_NOT_FOUND` | 팀원을 찾을 수 없음 |
| `404` | `INVITATION_NOT_FOUND` | 초대 링크가 유효하지 않거나 만료됨 |
| `404` | `TEAM_RESTAURANT_NOT_FOUND` | 팀 식당을 찾을 수 없음 |
| `404` | `REVIEW_NOT_FOUND` | 리뷰를 찾을 수 없음 |
| `404` | `KAKAO_PLACE_NOT_FOUND` | 카카오 장소를 찾을 수 없음 |
| `409` | `ADMIN_TRANSFER_REQUIRED` | 관리자가 탈퇴하기 전에 권한 위임이 필요함 |
| `409` | `RESTAURANT_ALREADY_REGISTERED` | 같은 팀에 이미 등록된 식당임 |
| `502` | `KAKAO_API_ERROR` | 카카오 장소 API 호출 실패 |
| `500` | `INTERNAL_SERVER_ERROR` | 서버 내부 오류 |

필드 검증 오류는 필요하면 `fieldErrors`를 추가한다.

```json
{
  "type": "https://api.example.com/problems/validation-error",
  "title": "요청값 검증 실패",
  "status": 400,
  "detail": "입력값을 확인해 주세요.",
  "instance": "/api/teams",
  "code": "VALIDATION_ERROR",
  "fieldErrors": {
    "name": "팀 이름은 필수입니다."
  }
}
```

## 13. 엔드포인트 요약

| Method | Endpoint | 권한 |
| --- | --- | --- |
| `GET` | `/session/me` | 공개·익명 세션 자동 발급 |
| `GET` | `/teams` | 현재 사용자 |
| `POST` | `/teams` | 익명 세션 사용자 |
| `GET` | `/teams/{teamId}` | 팀원 |
| `PATCH` | `/teams/{teamId}` | 관리자 |
| `DELETE` | `/teams/{teamId}` | 관리자 |
| `GET` | `/invitations/{token}` | 공개 |
| `POST` | `/invitations/{token}/join` | 익명 세션 사용자 |
| `GET` | `/teams/{teamId}/invitation` | 팀원 |
| `POST` | `/teams/{teamId}/invitation/regenerate` | 관리자 |
| `GET` | `/teams/{teamId}/members` | 팀원 |
| `POST` | `/teams/{teamId}/admin-transfer` | 관리자 |
| `DELETE` | `/teams/{teamId}/members/me` | 팀원 |
| `POST` | `/teams/{teamId}/members/me/transfer-and-leave` | 관리자 |
| `GET` | `/places/search` | 익명 세션 사용자 |
| `GET` | `/teams/{teamId}/restaurants` | 팀원 |
| `POST` | `/teams/{teamId}/restaurants` | 팀원 |
| `GET` | `/teams/{teamId}/restaurants/{id}` | 팀원 |
| `DELETE` | `/teams/{teamId}/restaurants/{id}` | 팀원 |
| `GET` | `/teams/{teamId}/office-location` | 팀원 |
| `PUT` | `/teams/{teamId}/office-location` | 팀원 |
| `GET` | `/teams/{teamId}/restaurants/{id}/reviews` | 팀원 |
| `PUT` | `/teams/{teamId}/restaurants/{id}/reviews/me` | 팀원 |
| `DELETE` | `/teams/{teamId}/restaurants/{id}/reviews/me` | 팀원 |
| `GET` | `/teams/{teamId}/lunch-history` | 팀원 |
