export type KakaoLatLng = object

export type KakaoMap = {
  setBounds: (bounds: KakaoLatLngBounds) => void
  setCenter: (position: KakaoLatLng) => void
  setLevel: (level: number) => void
  relayout: () => void
}

export type KakaoLatLngBounds = {
  extend: (position: KakaoLatLng) => void
}

export type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void
}

export type KakaoCustomOverlay = {
  setMap: (map: KakaoMap | null) => void
}

export type KakaoInfoWindow = {
  open: (map: KakaoMap, marker: KakaoMarker) => void
  close: () => void
}

export type KakaoMapsApi = {
  load: (callback: () => void) => void
  Map: new (container: HTMLElement, options: { center: KakaoLatLng; level: number }) => KakaoMap
  LatLng: new (latitude: number, longitude: number) => KakaoLatLng
  LatLngBounds: new () => KakaoLatLngBounds
  Marker: new (options: { map: KakaoMap; position: KakaoLatLng; title?: string }) => KakaoMarker
  CustomOverlay: new (options: {
    map: KakaoMap
    position: KakaoLatLng
    content: HTMLElement
    xAnchor?: number
    yAnchor?: number
    zIndex?: number
    clickable?: boolean
  }) => KakaoCustomOverlay
  InfoWindow: new (options: { content: string; removable?: boolean }) => KakaoInfoWindow
  event: {
    addListener: (target: KakaoMarker, event: string, callback: () => void) => void
  }
}

declare global {
  interface Window {
    kakao?: { maps: KakaoMapsApi }
  }
}

let kakaoMapsPromise: Promise<KakaoMapsApi> | null = null

export function loadKakaoMaps(): Promise<KakaoMapsApi> {
  if (window.kakao?.maps) {
    return new Promise((resolve) => window.kakao?.maps.load(() => resolve(window.kakao!.maps)))
  }
  if (kakaoMapsPromise) return kakaoMapsPromise

  const appKey = import.meta.env.VITE_KAKAO_MAP_APP_KEY
  if (!appKey) return Promise.reject(new Error('VITE_KAKAO_MAP_APP_KEY가 설정되지 않았습니다.'))

  kakaoMapsPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = 'kakao-map-sdk'
    script.async = true
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${encodeURIComponent(appKey)}&autoload=false`
    script.onload = () => {
      if (!window.kakao?.maps) {
        reject(new Error('카카오 지도 SDK를 불러오지 못했습니다.'))
        return
      }
      window.kakao.maps.load(() => resolve(window.kakao!.maps))
    }
    script.onerror = () => reject(new Error('카카오 지도 SDK 요청에 실패했습니다.'))
    document.head.appendChild(script)
  })

  return kakaoMapsPromise
}
