import { MS_PER_DAY, MS_PER_HOUR, MS_PER_MINUTE } from '@/constants/date'
import type { Restaurant, TeamRestaurant } from '@/types/restaurant'
import type { Review } from '@/types/review'
import type { Team, TeamMember } from '@/types/team'
import type { User } from '@/types/user'
import type {
  LunchBallot,
  LunchCandidate,
  LunchDecision,
  LunchParticipant,
  LunchVoteSession,
} from '@/types/vote'

const now = Date.now()
const ago = (ms: number) => new Date(now - ms).toISOString()
const later = (ms: number) => new Date(now + ms).toISOString()

export const CURRENT_USER_ID = 'u1'

export const seedUsers: User[] = [
  { id: 'u1', nickname: '민선', profileImageUrl: null },
  { id: 'u2', nickname: '지훈', profileImageUrl: null },
  { id: 'u3', nickname: '서연', profileImageUrl: null },
  { id: 'u4', nickname: '도윤', profileImageUrl: null },
  { id: 'u5', nickname: '하은', profileImageUrl: null },
  { id: 'u6', nickname: '준서', profileImageUrl: null },
]

export const seedTeams: Team[] = [
  { id: 't1', name: '플랫폼개발팀', description: '매일 점심 메뉴 고민을 함께 해결하는 개발팀입니다.' },
  { id: 't2', name: '디자인팀', description: '맛집 탐방을 좋아하는 디자이너들.' },
  { id: 't3', name: '점심 스터디', description: '새로 만든 작은 모임입니다.' },
]

export const seedInviteCodes: Record<string, string> = {
  t1: 'platform-dev-9f2k',
  t2: 'design-team-7a1c',
  t3: 'lunch-study-3d8e',
}

export const seedMembers: TeamMember[] = [
  { id: 'm1', teamId: 't1', userId: 'u1', role: 'ADMIN', joinedAt: ago(60 * MS_PER_DAY) },
  { id: 'm2', teamId: 't1', userId: 'u2', role: 'MEMBER', joinedAt: ago(55 * MS_PER_DAY) },
  { id: 'm3', teamId: 't1', userId: 'u3', role: 'MEMBER', joinedAt: ago(40 * MS_PER_DAY) },
  { id: 'm4', teamId: 't1', userId: 'u4', role: 'MEMBER', joinedAt: ago(20 * MS_PER_DAY) },
  { id: 'm5', teamId: 't2', userId: 'u5', role: 'ADMIN', joinedAt: ago(90 * MS_PER_DAY) },
  { id: 'm6', teamId: 't2', userId: 'u1', role: 'MEMBER', joinedAt: ago(30 * MS_PER_DAY) },
  { id: 'm7', teamId: 't2', userId: 'u6', role: 'MEMBER', joinedAt: ago(10 * MS_PER_DAY) },
  { id: 'm8', teamId: 't3', userId: 'u1', role: 'ADMIN', joinedAt: ago(2 * MS_PER_DAY) },
]

export const seedRestaurants: Restaurant[] = [
  { id: 'r1', name: '한울 김치찌개', address: '서울 강남구 테헤란로 12길 5', latitude: 37.5012, longitude: 127.0396, category: '한식' },
  { id: 'r2', name: '스시 오마카세 하루', address: '서울 강남구 역삼로 33', latitude: 37.4979, longitude: 127.0276, category: '일식' },
  { id: 'r3', name: '마라탕 홍루', address: '서울 강남구 논현로 8길 21', latitude: 37.5043, longitude: 127.0241, category: '중식' },
  { id: 'r4', name: '파스타 보노', address: '서울 강남구 선릉로 64길 9', latitude: 37.5051, longitude: 127.0488, category: '양식' },
  { id: 'r5', name: '쌀국수 포하노이', address: '서울 강남구 테헤란로 27길 14', latitude: 37.5009, longitude: 127.0367, category: '아시안' },
  { id: 'r6', name: '버거 스테이션', address: '서울 강남구 봉은사로 120', latitude: 37.5088, longitude: 127.0412, category: '양식' },
  { id: 'r7', name: '돈카츠 정', address: '서울 강남구 역삼로 7길 3', latitude: 37.4995, longitude: 127.0301, category: '일식' },
  { id: 'r8', name: '비빔밥 곳간', address: '서울 강남구 테헤란로 5길 18', latitude: 37.4988, longitude: 127.0285, category: '한식' },
  { id: 'r9', name: '샐러드 팜', address: '서울 강남구 선릉로 90길 2', latitude: 37.5062, longitude: 127.0501, category: '샐러드' },
  { id: 'r10', name: '칼국수 명가', address: '서울 강남구 논현로 22길 11', latitude: 37.5031, longitude: 127.0229, category: '한식' },
  { id: 'r11', name: '짜장면 일번지', address: '서울 강남구 역삼로 15길 6', latitude: 37.4971, longitude: 127.0315, category: '중식' },
  { id: 'r12', name: '타코 로코', address: '서울 강남구 봉은사로 8길 4', latitude: 37.5075, longitude: 127.0379, category: '멕시칸' },
]

export const seedTeamRestaurants: TeamRestaurant[] = [
  { id: 'tr1', teamId: 't1', restaurantId: 'r1', registeredByTeamMemberId: 'm1', createdAt: ago(30 * MS_PER_DAY) },
  { id: 'tr2', teamId: 't1', restaurantId: 'r2', registeredByTeamMemberId: 'm2', createdAt: ago(28 * MS_PER_DAY) },
  { id: 'tr3', teamId: 't1', restaurantId: 'r3', registeredByTeamMemberId: 'm3', createdAt: ago(20 * MS_PER_DAY) },
  { id: 'tr4', teamId: 't1', restaurantId: 'r4', registeredByTeamMemberId: 'm1', createdAt: ago(15 * MS_PER_DAY) },
  { id: 'tr5', teamId: 't1', restaurantId: 'r5', registeredByTeamMemberId: 'm4', createdAt: ago(9 * MS_PER_DAY) },
  { id: 'tr6', teamId: 't1', restaurantId: 'r7', registeredByTeamMemberId: 'm2', createdAt: ago(3 * MS_PER_DAY) },
]

export const seedReviews: Review[] = [
  { id: 'rv1', teamRestaurantId: 'tr1', teamMemberId: 'm1', rating: 5, content: '김치찌개가 진하고 밥이 맛있어요. 점심 시간 웨이팅 조금 있음.', createdAt: ago(10 * MS_PER_DAY), updatedAt: ago(10 * MS_PER_DAY) },
  { id: 'rv2', teamRestaurantId: 'tr1', teamMemberId: 'm2', rating: 4, content: '가성비 좋습니다.', createdAt: ago(8 * MS_PER_DAY), updatedAt: ago(8 * MS_PER_DAY) },
  { id: 'rv3', teamRestaurantId: 'tr2', teamMemberId: 'm3', rating: 5, content: '런치 세트가 훌륭해요.', createdAt: ago(6 * MS_PER_DAY), updatedAt: ago(6 * MS_PER_DAY) },
  { id: 'rv4', teamRestaurantId: 'tr3', teamMemberId: 'm2', rating: 3, content: '조금 맵지만 재료는 신선합니다.', createdAt: ago(5 * MS_PER_DAY), updatedAt: ago(5 * MS_PER_DAY) },
  { id: 'rv5', teamRestaurantId: 'tr4', teamMemberId: 'm4', rating: 4, content: '크림 파스타 추천!', createdAt: ago(4 * MS_PER_DAY), updatedAt: ago(4 * MS_PER_DAY) },
  { id: 'rv6', teamRestaurantId: 'tr5', teamMemberId: 'm1', rating: 4, content: '국물이 깔끔해요.', createdAt: ago(2 * MS_PER_DAY), updatedAt: ago(2 * MS_PER_DAY) },
  { id: 'rv7', teamRestaurantId: 'tr6', teamMemberId: 'm3', rating: 5, content: '바삭바삭한 돈카츠.', createdAt: ago(1 * MS_PER_DAY), updatedAt: ago(1 * MS_PER_DAY) },
]

export const seedSessions: LunchVoteSession[] = [
  { id: 's1', teamId: 't1', createdByTeamMemberId: 'm1', status: 'OPEN', closesAt: later(2 * MS_PER_HOUR), createdAt: ago(1 * MS_PER_HOUR) },
  { id: 's2', teamId: 't1', createdByTeamMemberId: 'm2', status: 'OPEN', closesAt: later(5 * MS_PER_HOUR + 30 * MS_PER_MINUTE), createdAt: ago(30 * MS_PER_MINUTE) },
  { id: 's3', teamId: 't1', createdByTeamMemberId: 'm1', status: 'CLOSED', closesAt: ago(1 * MS_PER_HOUR), createdAt: ago(4 * MS_PER_HOUR) },
  { id: 's10', teamId: 't1', createdByTeamMemberId: 'm1', status: 'CONFIRMED', closesAt: ago(1 * MS_PER_DAY), createdAt: ago(1 * MS_PER_DAY + 3 * MS_PER_HOUR) },
  { id: 's11', teamId: 't1', createdByTeamMemberId: 'm2', status: 'CONFIRMED', closesAt: ago(3 * MS_PER_DAY), createdAt: ago(3 * MS_PER_DAY + 3 * MS_PER_HOUR) },
  { id: 's12', teamId: 't1', createdByTeamMemberId: 'm3', status: 'CONFIRMED', closesAt: ago(9 * MS_PER_DAY), createdAt: ago(9 * MS_PER_DAY + 3 * MS_PER_HOUR) },
  { id: 's13', teamId: 't1', createdByTeamMemberId: 'm1', status: 'CONFIRMED', closesAt: ago(16 * MS_PER_DAY), createdAt: ago(16 * MS_PER_DAY + 3 * MS_PER_HOUR) },
  { id: 's20', teamId: 't2', createdByTeamMemberId: 'm5', status: 'OPEN', closesAt: later(1 * MS_PER_HOUR), createdAt: ago(2 * MS_PER_HOUR) },
]

export const seedParticipants: LunchParticipant[] = seedSessions.flatMap(({ id, teamId }) =>
  seedMembers
    .filter((member) => member.teamId === teamId)
    .map(({ id: teamMemberId }) => ({
      id: `p-${id}-${teamMemberId}`,
      sessionId: id,
      teamMemberId,
      participating: !(teamMemberId === 'm4' && id !== 's10'),
    })),
)

export const seedCandidates: LunchCandidate[] = [
  { id: 'c1', sessionId: 's1', restaurantId: 'r1', source: 'MANUAL' },
  { id: 'c2', sessionId: 's1', restaurantId: 'r2', source: 'MANUAL' },
  { id: 'c3', sessionId: 's1', restaurantId: 'r4', source: 'RECOMMENDED' },
  { id: 'c4', sessionId: 's2', restaurantId: 'r3', source: 'MANUAL' },
  { id: 'c5', sessionId: 's2', restaurantId: 'r5', source: 'MANUAL' },
  { id: 'c6', sessionId: 's3', restaurantId: 'r7', source: 'MANUAL' },
  { id: 'c7', sessionId: 's3', restaurantId: 'r5', source: 'MANUAL' },
  { id: 'c10', sessionId: 's10', restaurantId: 'r1', source: 'MANUAL' },
  { id: 'c11', sessionId: 's11', restaurantId: 'r2', source: 'MANUAL' },
  { id: 'c12', sessionId: 's12', restaurantId: 'r3', source: 'MANUAL' },
  { id: 'c13', sessionId: 's13', restaurantId: 'r4', source: 'MANUAL' },
  { id: 'c20', sessionId: 's20', restaurantId: 'r6', source: 'MANUAL' },
]

const ballot = (id: string, sessionId: string, candidateId: string, teamMemberId: string): LunchBallot => ({
  id,
  sessionId,
  candidateId,
  teamMemberId,
  createdAt: ago(20 * MS_PER_MINUTE),
  updatedAt: ago(20 * MS_PER_MINUTE),
})

export const seedBallots: LunchBallot[] = [
  ballot('b1', 's1', 'c1', 'm2'),
  ballot('b2', 's1', 'c2', 'm3'),
  ballot('b3', 's2', 'c4', 'm1'),
  ballot('b4', 's3', 'c6', 'm1'),
  ballot('b5', 's3', 'c7', 'm2'),
]

export const seedDecisions: LunchDecision[] = [
  { id: 'd10', sessionId: 's10', restaurantId: 'r1', confirmedByTeamMemberId: null, confirmationType: 'AUTO', confirmedAt: ago(1 * MS_PER_DAY) },
  { id: 'd11', sessionId: 's11', restaurantId: 'r2', confirmedByTeamMemberId: 'm2', confirmationType: 'MANUAL', confirmedAt: ago(3 * MS_PER_DAY) },
  { id: 'd12', sessionId: 's12', restaurantId: 'r3', confirmedByTeamMemberId: null, confirmationType: 'AUTO', confirmedAt: ago(9 * MS_PER_DAY) },
  { id: 'd13', sessionId: 's13', restaurantId: 'r4', confirmedByTeamMemberId: 'm1', confirmationType: 'MANUAL', confirmedAt: ago(16 * MS_PER_DAY) },
]
