# 메뉴솔로몬 (menu_solomon_fe)

팀 점심 투표 서비스 프론트엔드 MVP. React · TypeScript · TanStack Query · Tailwind CSS · shadcn/ui 스타일 컴포넌트 · React Router.

현재는 **목업 데이터만** 사용합니다 (실제 백엔드, Kakao 지도/검색/로그인 미연동).

## 실행

```bash
npm install
npm run dev     # 개발 서버
npm run build   # 타입 체크 + 빌드
npm run lint
```

## 아키텍처

```
UI Component → Feature Hook → Query/Mutation Hook → Service → Mock API (추후 실제 API)
```

- `src/services/*` : 모든 데이터 접근. 목업 구현은 `src/mocks/api`(인메모리 DB) 안에만 존재하므로, 실제 HTTP로 교체할 때 서비스 내부만 바꾸면 됩니다.
- `src/hooks/*/queries`, `mutations` : TanStack Query 래퍼 (쿼리 키는 `src/queries/queryKeys.ts`).
- `src/hooks/*` : 화면용 Feature Hook (`useTeamDetail`, `useVoteSession`, `useVoting`, `useVoteDecision` 등).
- `src/domain/*` : 순수 비즈니스 규칙 (`teamRules`, `reviewRules`, `voteRules`).
- `src/constants/*` : 도메인 상수/라벨/메시지.
- 데모 로그인: 비로그인 상태에서 생성/수정/삭제 동작 시 로그인 필요 다이얼로그가 열리며, "데모 로그인"으로 목업 인증 상태가 전환됩니다.

참고: shadcn/ui 레지스트리에 접근할 수 없는 환경이라 `src/components/ui`의 컴포넌트는 shadcn/ui(new-york) 구조를 따라 radix-ui 기반으로 직접 작성했습니다 (`components.json` 포함).
