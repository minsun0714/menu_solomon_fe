# 메뉴솔로몬 (menu_solomon_fe)

팀 점심 투표 서비스 프론트엔드 MVP. React · TypeScript · TanStack Query · Tailwind CSS · shadcn/ui 스타일 컴포넌트 · React Router.

백엔드 REST API(`docs/api-spec.md`, `docs/vote-api-spec.md`)와 연동되며, 로그인 없이 쿠키 기반 익명 세션(`GET /session/me`)을 사용합니다.

## 환경 변수

`.env.example`을 참고해 `.env.local`을 만듭니다.

- `VITE_API_BASE_URL`: API Base URL (기본값 `/api`, 로컬 Compose는 `http://localhost:8080/api`)
- `VITE_KAKAO_MAP_APP_KEY`: 카카오 지도 JavaScript 키

## 실행

```bash
npm install
npm run dev     # 개발 서버
npm run build   # 타입 체크 + 빌드
npm run lint
```

## 아키텍처

```
UI Component → Feature Hook → Query/Mutation Hook → Service → HTTP API (`src/lib/api.ts`)
```

- `src/services/*` : 모든 데이터 접근. `src/lib/api.ts`의 fetch 래퍼(`credentials: "include"`, `{ data }` 언래핑, ProblemDetail 오류)를 사용합니다.
- `src/hooks/*/queries`, `mutations` : TanStack Query 래퍼 (쿼리 키는 `src/queries/queryKeys.ts`).
- `src/hooks/*` : 화면용 Feature Hook (`useTeamDetail`, `useVoteSession`, `useVoting`, `useVoteDecision` 등).
- `src/domain/*` : 순수 비즈니스 규칙 (`teamRules`, `reviewRules`, `voteRules`).
- `src/constants/*` : 도메인 상수/라벨/메시지.

참고: shadcn/ui 레지스트리에 접근할 수 없는 환경이라 `src/components/ui`의 컴포넌트는 shadcn/ui(new-york) 구조를 따라 radix-ui 기반으로 직접 작성했습니다 (`components.json` 포함).
