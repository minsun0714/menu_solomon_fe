# 메뉴솔로몬 투표 API 명세 — 현재 UI 기준

> 현재 프론트 UI와 도메인 규칙을 그대로 지원하기 위한 백엔드 계약이다. 기존 단일 선택 투표 API를 대체한다.

## 1. 공통

- Base path: `/api/teams/{teamId}`
- 모든 API는 해당 팀의 ACTIVE 팀원만 호출할 수 있다.
- 성공 응답은 `{ "data": ... }`, `204`는 본문이 없다.
- 오류는 `application/problem+json`과 `ProblemDetail`을 사용한다.
- 응답 ID는 기존 API와 동일하게 접두사 문자열을 사용한다.
- 날짜는 ISO 8601 UTC 문자열을 사용하며, 날짜 경계 계산은 `Asia/Seoul` 기준이다.

상태:

- `OPEN`: 진행 중
- `CLOSED`: 마감됐지만 메뉴가 확정되지 않음
- `CONFIRMED`: 메뉴 확정 완료

후보 출처:

- `MANUAL`: 직접 추가
- `RECOMMENDED`: 추천 결과에서 추가

확정 유형:

- `AUTO`: 단독 최다 득표로 자동 확정
- `MANUAL`: 투표 생성자가 수동 확정

## 2. 공통 DTO

### VoteSession

```json
{
  "id": "vote_1",
  "teamId": "team_1",
  "name": "오늘 점심 투표",
  "createdByTeamMemberId": "member_1",
  "status": "OPEN",
  "closesAt": "2026-10-04T07:00:00Z",
  "createdAt": "2026-10-04T04:00:00Z"
}
```

`name`은 아직 지정하지 않은 경우 `null`일 수 있다. 프론트는 이 경우 `점심 투표 #{id}`로 표시한다.

### Participant

```json
{
  "id": "participant_1",
  "sessionId": "vote_1",
  "teamMemberId": "member_1",
  "nickname": "익명 사용자 1234",
  "participating": true
}
```

### Restaurant

```json
{
  "id": "restaurant_1",
  "kakaoPlaceId": "12345678",
  "name": "맛있는 식당",
  "address": "서울 강남구",
  "latitude": 37.501,
  "longitude": 127.039,
  "category": "한식",
  "kakaoPlaceUrl": "https://place.map.kakao.com/12345678"
}
```

### Candidate

```json
{
  "id": "candidate_1",
  "sessionId": "vote_1",
  "restaurantId": "restaurant_1",
  "source": "MANUAL",
  "restaurant": {
    "id": "restaurant_1",
    "kakaoPlaceId": "12345678",
    "name": "맛있는 식당",
    "address": "서울 강남구",
    "latitude": 37.501,
    "longitude": 127.039,
    "category": "한식",
    "kakaoPlaceUrl": "https://place.map.kakao.com/12345678"
  },
  "averageRating": 4.5
}
```

리뷰가 없으면 `averageRating`은 `0`이다. 프론트 투표 카드가 숫자 타입으로 사용하므로 `null`을 반환하지 않는다.

### Ballot

복수 선택은 후보별 투표 행 하나로 저장한다.

```json
{
  "id": "ballot_1",
  "sessionId": "vote_1",
  "candidateId": "candidate_1",
  "teamMemberId": "member_1",
  "createdAt": "2026-10-04T04:30:00Z",
  "updatedAt": "2026-10-04T04:30:00Z"
}
```

필수 유니크 제약:

```text
UNIQUE(session_id, candidate_id, team_member_id)
```

`UNIQUE(session_id, team_member_id)`는 사용하지 않는다.

### Decision

```json
{
  "id": "decision_1",
  "sessionId": "vote_1",
  "restaurantId": "restaurant_1",
  "confirmedByTeamMemberId": "member_1",
  "confirmationType": "MANUAL",
  "confirmedAt": "2026-10-04T07:00:00Z"
}
```

자동 확정이면 `confirmedByTeamMemberId`는 `null`이다.

## 3. 투표 세션

### 투표 생성

```http
POST /api/teams/{teamId}/votes
```

모든 ACTIVE 팀원이 생성할 수 있으며, 한 팀에 `OPEN` 투표를 여러 개 만들 수 있다.

요청:

```json
{
  "closesAt": "2026-10-04T07:00:00Z"
}
```

- `closesAt` 필수
- 현재 시각 이후여야 함
- 프론트 기본값은 요청 시점부터 3시간 뒤
- 생성 시점의 ACTIVE 팀원을 모두 `participating=true`로 초기화

응답 `201 Created`:

```json
{
  "data": {
    "id": "vote_1",
    "teamId": "team_1",
    "name": null,
    "createdByTeamMemberId": "member_1",
    "status": "OPEN",
    "closesAt": "2026-10-04T07:00:00Z",
    "createdAt": "2026-10-04T04:00:00Z"
  }
}
```

### 투표 목록 조회

```http
GET /api/teams/{teamId}/votes
```

기본 정렬은 `createdAt` 최신순이다. 조회 시 마감 시간이 지난 `OPEN` 투표를 먼저 정산한다.

응답 `200 OK`:

```json
{
  "data": [
    {
      "id": "vote_1",
      "teamId": "team_1",
      "name": "오늘 점심 투표",
      "createdByTeamMemberId": "member_1",
      "creatorNickname": "익명 사용자 1234",
      "status": "OPEN",
      "closesAt": "2026-10-04T07:00:00Z",
      "createdAt": "2026-10-04T04:00:00Z",
      "participantCount": 6,
      "candidateCount": 3,
      "ballotCount": 4,
      "myBallotCandidateIds": ["candidate_1", "candidate_3"]
    }
  ]
}
```

- `ballotCount`는 선택 행 수가 아니라 투표한 고유 팀원 수다.
- `myBallotCandidateIds`는 현재 팀원이 선택한 모든 후보 ID다.

### 투표 상세 조회

```http
GET /api/teams/{teamId}/votes/{voteId}
```

조회 시 마감 시간이 지났다면 먼저 정산한다.

```json
{
  "data": {
    "session": {
      "id": "vote_1",
      "teamId": "team_1",
      "name": "오늘 점심 투표",
      "createdByTeamMemberId": "member_1",
      "status": "OPEN",
      "closesAt": "2026-10-04T07:00:00Z",
      "createdAt": "2026-10-04T04:00:00Z"
    },
    "creatorNickname": "익명 사용자 1234",
    "decision": null
  }
}
```

### 투표 이름 또는 종료 시간 수정

```http
PATCH /api/teams/{teamId}/votes/{voteId}
```

- 모든 ACTIVE 팀원이 수정 가능
- `OPEN` 상태에서만 가능
- 부분 수정 지원
- 미전송 필드는 기존 값 유지
- `name`은 blank 불가, 최대 40자
- `closesAt`은 현재 시각 이후여야 함

```json
{
  "name": "금요일 점심 투표",
  "closesAt": "2026-10-04T08:00:00Z"
}
```

응답은 변경된 `VoteSession`이다.

### 투표 삭제

```http
DELETE /api/teams/{teamId}/votes/{voteId}
```

- 모든 ACTIVE 팀원이 삭제 가능
- `OPEN`, `CLOSED`, `CONFIRMED` 모두 삭제 가능
- 참여자, 후보, 투표 내역, 확정 결과를 함께 삭제
- 성공: `204 No Content`

### 투표 다시 시작

```http
POST /api/teams/{teamId}/votes/{voteId}/restart
```

- 투표 생성자만 가능
- `OPEN` 또는 `CLOSED` 상태에서 가능
- `CONFIRMED` 상태에서는 불가
- 후보는 그대로 유지
- 기존 투표 내역 전체 삭제
- 모든 참여 상태는 그대로 유지
- 상태를 `OPEN`으로 변경
- 종료 시간을 실행 시점부터 3시간 뒤로 변경

본문 없음. 응답은 변경된 `VoteSession`이다.

## 4. 참여 상태

### 참여자 목록

```http
GET /api/teams/{teamId}/votes/{voteId}/participants
```

응답 `200 OK`:

```json
{
  "data": [
    {
      "id": "participant_1",
      "sessionId": "vote_1",
      "teamMemberId": "member_1",
      "nickname": "익명 사용자 1234",
      "participating": true
    }
  ]
}
```

### 팀원 참여 상태 변경

```http
PUT /api/teams/{teamId}/votes/{voteId}/participants/{targetTeamMemberId}
```

- 모든 ACTIVE 팀원이 본인과 다른 팀원의 상태를 변경 가능
- `OPEN` 상태에서만 가능
- 대상은 같은 팀의 ACTIVE 팀원이어야 함
- 해당 투표의 참여 행이 없다면 새로 생성
- `participating=false`로 변경하면 대상 팀원의 해당 투표 내역 전체 삭제

```json
{
  "participating": false
}
```

응답 `200 OK`:

```json
{
  "data": {
    "id": "participant_1",
    "sessionId": "vote_1",
    "teamMemberId": "member_1",
    "nickname": "익명 사용자 1234",
    "participating": false
  }
}
```

## 5. 후보

### 후보 목록

```http
GET /api/teams/{teamId}/votes/{voteId}/candidates
```

응답은 `Candidate[]`다.

### 후보 추가

```http
POST /api/teams/{teamId}/votes/{voteId}/candidates
```

- 모든 ACTIVE 팀원이 추가 가능
- `OPEN` 상태에서만 가능
- 카카오 장소 검색에서 저장된 식당을 후보로 추가
- 같은 투표에 같은 식당 중복 추가 불가

```json
{
  "kakaoPlaceId": "12345678",
  "source": "MANUAL"
}
```

추천 결과 추가 시 `source`는 `RECOMMENDED`다. 응답 `201 Created`는 생성된 `Candidate`다.

### 후보 삭제

```http
DELETE /api/teams/{teamId}/votes/{voteId}/candidates/{candidateId}
```

- 모든 ACTIVE 팀원이 삭제 가능
- `OPEN` 상태에서만 가능
- 후보에 연결된 모든 투표 내역을 함께 삭제
- 성공: `204 No Content`

## 6. 추천 점심

### 추천 한 건 조회

```http
GET /api/teams/{teamId}/votes/{voteId}/recommendations?cursor=0
```

- 사용자가 추천 버튼을 눌렀을 때만 호출
- 한 번에 한 곳만 반환
- 새로고침 시 다음 cursor로 호출
- 현재 투표 후보에 이미 포함된 식당 제외
- 최근 7일 이내 확정 메뉴 제외
- 현재 투표에서 불참 상태인 팀원의 리뷰를 제외하고 평균 별점 계산
- 평균 별점 내림차순을 기본 추천 순서로 사용

```json
{
  "data": {
    "items": [
      {
        "restaurant": {
          "id": "restaurant_1",
          "kakaoPlaceId": "12345678",
          "name": "맛있는 식당",
          "address": "서울 강남구",
          "latitude": 37.501,
          "longitude": 127.039,
          "category": "한식",
          "kakaoPlaceUrl": "https://place.map.kakao.com/12345678"
        },
        "averageRating": 4.5,
        "reason": "참여자 리뷰 평점 반영 · 최근 7일 내 선택 안 함"
      }
    ],
    "nextCursor": 1
  }
}
```

추천 대상이 없으면 `items`는 빈 배열이다.

## 7. 복수 투표

### 내 투표 저장 또는 변경

```http
PUT /api/teams/{teamId}/votes/{voteId}/ballots/me
```

- 현재 팀원의 참여 상태가 `true`여야 함
- `OPEN` 상태이고 마감 전이어야 함
- 후보를 제한 없이 여러 개 선택 가능
- 같은 후보 ID 중복은 서버에서 제거
- 기존 내 투표 내역을 요청 목록으로 전부 교체
- 빈 배열은 허용하지 않음. 전체 취소는 DELETE 사용
- 유효성 검증 후 삭제와 생성은 하나의 트랜잭션으로 처리

```json
{
  "candidateIds": [10, 12, 15]
}
```

응답 `200 OK`:

```json
{
  "data": [
    {
      "id": "ballot_1",
      "sessionId": "vote_1",
      "candidateId": "candidate_10",
      "teamMemberId": "member_1",
      "createdAt": "2026-10-04T04:30:00Z",
      "updatedAt": "2026-10-04T04:30:00Z"
    }
  ]
}
```

### 내 투표 전체 취소

```http
DELETE /api/teams/{teamId}/votes/{voteId}/ballots/me
```

`OPEN` 상태이고 마감 전일 때만 가능하다. 성공은 `204 No Content`다.

### 투표 결과 조회

```http
GET /api/teams/{teamId}/votes/{voteId}/results
```

```json
{
  "data": {
    "results": [
      {
        "candidateId": "candidate_1",
        "voteCount": 3,
        "percentage": 75
      }
    ],
    "ballots": [
      {
        "id": "ballot_1",
        "sessionId": "vote_1",
        "candidateId": "candidate_1",
        "teamMemberId": "member_1",
        "createdAt": "2026-10-04T04:30:00Z",
        "updatedAt": "2026-10-04T04:30:00Z"
      }
    ]
  }
}
```

- `voteCount`: 해당 후보를 선택한 팀원 수
- 득표율 분모: 후보 선택 건수가 아니라 한 개 이상 투표한 고유 팀원 수
- 복수 선택이므로 후보별 percentage 합계는 100%를 초과할 수 있음

## 8. 마감과 메뉴 확정

### 마감 처리

마감 처리는 스케줄러를 기본으로 하고, 투표 목록·상세·결과 조회 시 지연 처리도 함께 수행한다.

마감 시간이 지난 `OPEN` 투표:

1. 후보별 득표수 계산
2. 최다 득표 후보가 정확히 한 곳이면 자동 확정
3. 최다 득표 후보가 여러 곳이거나 투표가 없으면 `CLOSED`

자동 확정 시:

- `status=CONFIRMED`
- `confirmationType=AUTO`
- `confirmedByTeamMemberId=null`

### 수동 확정

```http
POST /api/teams/{teamId}/votes/{voteId}/decision
```

- 투표 생성자만 가능
- `CLOSED` 상태에서만 가능
- 동점인 최다 득표 후보 중 하나만 선택 가능
- 투표당 확정 결과 하나

```json
{
  "restaurantId": 10
}
```

응답 `201 Created`는 생성된 `Decision`이다.

### 확정 메뉴 수정

```http
PATCH /api/teams/{teamId}/votes/{voteId}/decision
```

- 투표 생성자만 가능
- 확정 결과가 있어야 함
- 해당 투표의 후보 식당으로만 변경 가능

```json
{
  "restaurantId": 12
}
```

응답은 변경된 `Decision`이다.

### 확정 메뉴 삭제

```http
DELETE /api/teams/{teamId}/votes/{voteId}/decision
```

- 투표 생성자만 가능
- 확정 결과 삭제 후 투표 상태를 `CLOSED`로 변경
- 성공: `204 No Content`

## 9. 확정 메뉴 히스토리

### 주간 조회

```http
GET /api/teams/{teamId}/lunch-history?view=WEEK&date=2026-10-04
```

- `date`가 포함된 주 조회
- 월요일 시작
- `Asia/Seoul` 기준

### 월간 조회

```http
GET /api/teams/{teamId}/lunch-history?view=MONTH&month=2026-10
```

공통 응답:

```json
{
  "data": [
    {
      "decisionId": "decision_1",
      "sessionId": "vote_1",
      "confirmedAt": "2026-10-04T07:00:00Z",
      "restaurant": {
        "id": "restaurant_1",
        "kakaoPlaceId": "12345678",
        "name": "맛있는 식당",
        "address": "서울 강남구",
        "latitude": 37.501,
        "longitude": 127.039,
        "category": "한식",
        "kakaoPlaceUrl": "https://place.map.kakao.com/12345678"
      },
      "confirmationType": "AUTO",
      "confirmedByNickname": null
    }
  ]
}
```

- 최신 확정순 정렬
- 자동 확정이면 `confirmedByNickname=null`
- 과거 투표 상세 모달은 기존 투표 상세·참여자·후보·결과 API를 그대로 호출한다.

## 10. 권한 요약

| 기능 | 권한 | 상태 |
| --- | --- | --- |
| 투표 생성 | 모든 ACTIVE 팀원 | - |
| 이름·종료 시간 수정 | 모든 ACTIVE 팀원 | OPEN |
| 투표 삭제 | 모든 ACTIVE 팀원 | 전체 |
| 참여 상태 변경 | 모든 ACTIVE 팀원, 다른 팀원 변경 가능 | OPEN |
| 후보 추가·삭제 | 모든 ACTIVE 팀원 | OPEN |
| 복수 투표 저장·취소 | 참여 상태인 본인 | OPEN, 마감 전 |
| 투표 다시 시작 | 투표 생성자 | OPEN 또는 CLOSED |
| 수동 확정 | 투표 생성자 | CLOSED |
| 확정 메뉴 수정·삭제 | 투표 생성자 | CONFIRMED |

## 11. 필수 오류 코드

| HTTP | code | 상황 |
| --- | --- | --- |
| `400` | `VALIDATION_ERROR` | 이름, 시간, ID, 배열 검증 실패 |
| `403` | `NOT_TEAM_MEMBER` | ACTIVE 팀원이 아님 |
| `403` | `VOTE_CREATOR_REQUIRED` | 생성자 전용 기능 호출 |
| `404` | `VOTE_NOT_FOUND` | 해당 팀의 투표를 찾을 수 없음 |
| `404` | `TEAM_MEMBER_NOT_FOUND` | 참여 상태 변경 대상이 없음 |
| `404` | `VOTE_CANDIDATE_NOT_FOUND` | 해당 투표 후보를 찾을 수 없음 |
| `404` | `DECISION_NOT_FOUND` | 확정 결과를 찾을 수 없음 |
| `409` | `VOTE_NOT_OPEN` | OPEN에서만 가능한 기능 호출 |
| `409` | `VOTE_ALREADY_CONFIRMED` | 확정된 투표 변경 시도 |
| `409` | `VOTE_PARTICIPATION_REQUIRED` | 불참 상태 또는 참여 행 없음 |
| `409` | `VOTE_CANDIDATE_ALREADY_EXISTS` | 같은 식당 후보 중복 추가 |
| `409` | `VOTE_NOT_CLOSED` | CLOSED에서만 가능한 확정 시도 |
| `409` | `INVALID_DECISION_CANDIDATE` | 수동 확정 가능한 후보가 아님 |

## 12. DB 제약 및 트랜잭션

```text
UNIQUE(lunch_participants.session_id, lunch_participants.team_member_id)
UNIQUE(lunch_candidates.session_id, lunch_candidates.restaurant_id)
UNIQUE(lunch_ballots.session_id, lunch_ballots.candidate_id, lunch_ballots.team_member_id)
UNIQUE(lunch_decisions.session_id)
```

다음 작업은 반드시 하나의 트랜잭션으로 처리한다.

- 참여 상태를 불참으로 바꾸면서 해당 팀원의 투표 내역 삭제
- 복수 투표 목록 전체 교체
- 후보 삭제와 연결된 투표 내역 삭제
- 투표 다시 시작과 기존 투표 내역 초기화
- 마감 정산과 자동 확정 생성
- 확정 결과 삭제와 투표 상태를 `CLOSED`로 변경
