import { useEffect, useRef, useState } from 'react'
import { AlertCircle, LoaderCircle } from 'lucide-react'
import { loadKakaoMaps, type KakaoCustomOverlay } from '@/lib/kakaoMaps'
import type { OfficeLocation, TeamRestaurantSummary } from '@/types/restaurant'
import { OfficeLocationDialog } from './OfficeLocationDialog'

type RestaurantMapPanelProps = {
  restaurants: TeamRestaurantSummary[]
  officeLocation: OfficeLocation | null
  onOfficeLocationChange: (location: OfficeLocation) => void
}

const DEFAULT_CENTER = { latitude: 37.5012, longitude: 127.0396 }

function createRestaurantMarker(name: string, address: string) {
  const marker = document.createElement('div')
  marker.className = 'flex cursor-default flex-col items-center'
  marker.title = address

  const label = document.createElement('div')
  label.className = 'max-w-44 truncate rounded-md border border-primary bg-card px-2.5 py-1 text-xs font-medium text-foreground whitespace-nowrap'
  label.textContent = name

  const pointer = document.createElement('div')
  pointer.className = '-mt-px size-3 rotate-45 border-r-2 border-b-2 border-primary bg-card'

  const dot = document.createElement('div')
  dot.className = 'mt-1 size-2.5 rounded-full border-2 border-card bg-primary'

  marker.append(label, pointer, dot)
  return marker
}

function createOfficeMarker(name: string, address: string) {
  const marker = document.createElement('div')
  marker.className = 'flex cursor-default flex-col items-center'
  marker.title = address

  const label = document.createElement('div')
  label.className = 'max-w-48 truncate rounded-lg bg-foreground px-3 py-2 text-xs font-semibold text-background whitespace-nowrap'
  label.textContent = `사무실 · ${name}`

  const pointer = document.createElement('div')
  pointer.className = '-mt-1 size-3 rotate-45 bg-foreground'

  marker.append(label, pointer)
  return marker
}

export function RestaurantMapPanel({ restaurants, officeLocation, onOfficeLocationChange }: RestaurantMapPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  useEffect(() => {
    let disposed = false
    const overlays: KakaoCustomOverlay[] = []

    setStatus('loading')
    loadKakaoMaps()
      .then((maps) => {
        if (disposed || !containerRef.current) return

        const fallback = new maps.LatLng(DEFAULT_CENTER.latitude, DEFAULT_CENTER.longitude)
        const map = new maps.Map(containerRef.current, { center: fallback, level: 5 })
        const bounds = new maps.LatLngBounds()

        restaurants.forEach(({ restaurant }) => {
          const position = new maps.LatLng(restaurant.latitude, restaurant.longitude)
          const overlay = new maps.CustomOverlay({
            map,
            position,
            content: createRestaurantMarker(restaurant.name, restaurant.address),
            xAnchor: 0.5,
            yAnchor: 1,
            zIndex: 3,
            clickable: true,
          })
          bounds.extend(position)
          overlays.push(overlay)
        })

        if (officeLocation) {
          const position = new maps.LatLng(officeLocation.latitude, officeLocation.longitude)
          const overlay = new maps.CustomOverlay({
            map,
            position,
            content: createOfficeMarker(officeLocation.name, officeLocation.address),
            xAnchor: 0.5,
            yAnchor: 1,
            zIndex: 4,
            clickable: true,
          })
          bounds.extend(position)
          overlays.push(overlay)
        }

        const locationCount = restaurants.length + (officeLocation ? 1 : 0)
        if (locationCount === 1) {
          const onlyLocation = restaurants[0]?.restaurant ?? officeLocation!
          map.setCenter(new maps.LatLng(onlyLocation.latitude, onlyLocation.longitude))
          map.setLevel(3)
        } else if (locationCount > 1) {
          map.setBounds(bounds)
        }

        requestAnimationFrame(() => map.relayout())
        setStatus('ready')
      })
      .catch(() => {
        if (!disposed) setStatus('error')
      })

    return () => {
      disposed = true
      overlays.forEach((overlay) => overlay.setMap(null))
    }
  }, [officeLocation, restaurants])

  return (
    <aside className="sticky top-8 hidden h-[calc(100vh-4rem)] min-h-[560px] max-h-[720px] overflow-hidden rounded-lg border bg-muted lg:block">
      <div ref={containerRef} className="absolute inset-0" aria-label="등록된 식당 위치 지도" />

      <div className="pointer-events-none absolute top-4 left-4 z-10 rounded-md border bg-card p-3">
        <p className="font-semibold">식당 지도</p>
        <p className="mt-0.5 text-xs text-muted-foreground">등록된 식당 {restaurants.length}곳</p>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <OfficeLocationDialog value={officeLocation} onSave={onOfficeLocationChange} />
      </div>
      {status === 'loading' && (
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-background/80 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" /> 지도를 불러오는 중...
        </div>
      )}
      {status === 'error' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-background px-6 text-center">
          <AlertCircle className="size-6 text-destructive" />
          <p className="text-sm font-medium">지도를 불러오지 못했어요.</p>
          <p className="text-xs text-muted-foreground">카카오 앱 키와 등록된 도메인을 확인해 주세요.</p>
        </div>
      )}
      {status === 'ready' && restaurants.length === 0 && (
        <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-md border bg-card px-3 py-2 text-xs text-muted-foreground">
          식당을 추가하면 지도에 표시돼요.
        </div>
      )}
    </aside>
  )
}
