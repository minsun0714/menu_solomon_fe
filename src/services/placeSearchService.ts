import { simulateLatency } from '@/mocks/api/db'
import { seedRestaurants } from '@/mocks/data/seed'
import type { OfficeLocation, PlaceSearchPage } from '@/types/restaurant'

const mockOfficePlaces: OfficeLocation[] = [
  { kakaoPlaceId: 'mock-office-1', name: '솔로몬 오피스', address: '서울 강남구 테헤란로 152', latitude: 37.5009, longitude: 127.0364 },
  { kakaoPlaceId: 'mock-office-2', name: '강남 파이낸스센터', address: '서울 강남구 테헤란로 152', latitude: 37.5001, longitude: 127.0365 },
  { kakaoPlaceId: 'mock-office-3', name: '역삼 스마트워크센터', address: '서울 강남구 역삼로 169', latitude: 37.4954, longitude: 127.0396 },
  { kakaoPlaceId: 'mock-office-4', name: '선릉 비즈니스센터', address: '서울 강남구 선릉로 428', latitude: 37.5037, longitude: 127.0481 },
  ...seedRestaurants.map(({ id, name, address, latitude, longitude }) => ({
    kakaoPlaceId: `mock-${id}`,
    name,
    address,
    latitude,
    longitude,
  })),
]

export const placeSearchService = {
  // 백엔드 연동 시 이 함수 내부만 `/api/places/search` 호출로 교체합니다.
  search(keyword: string, page = 1, size = 5): Promise<PlaceSearchPage> {
    return simulateLatency(() => {
      const query = keyword.trim().toLowerCase()
      const matches = mockOfficePlaces.filter(({ name, address }) =>
        [name, address].some((text) => text.toLowerCase().includes(query)),
      )
      const totalCount = matches.length
      const totalPages = Math.max(1, Math.ceil(totalCount / size))
      const currentPage = Math.min(Math.max(page, 1), totalPages)
      const offset = (currentPage - 1) * size

      return {
        items: matches.slice(offset, offset + size),
        page: currentPage,
        totalPages,
        totalCount,
        hasNextPage: currentPage < totalPages,
      }
    })
  },
}
