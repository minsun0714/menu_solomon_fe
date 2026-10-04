import { api } from '@/lib/api'
import type { OfficeLocation } from '@/types/restaurant'

export const officeService = {
  getOffice(teamId: string): Promise<OfficeLocation | null> {
    return api.get<OfficeLocation | null>(`/teams/${teamId}/office`)
  },

  saveOffice(teamId: string, office: OfficeLocation): Promise<OfficeLocation> {
    const { kakaoPlaceId, name, address, latitude, longitude } = office
    return api.put<OfficeLocation>(`/teams/${teamId}/office`, { kakaoPlaceId, name, address, latitude, longitude })
  },
}
