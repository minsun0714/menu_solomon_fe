import mixpanel from 'mixpanel-browser'

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>

let initialized = false

function getDeviceType() {
  if (window.matchMedia('(max-width: 767px)').matches) return 'mobile'
  if (window.matchMedia('(max-width: 1023px)').matches) return 'tablet'
  return 'desktop'
}

function getAcquisitionSource(url: URL) {
  const utmSource = url.searchParams.get('utm_source')
  if (utmSource) return utmSource
  if (!document.referrer) return 'direct'

  try {
    return new URL(document.referrer).hostname
  } catch {
    return 'direct'
  }
}

function track(event: string, properties?: AnalyticsProperties) {
  if (!initialized) return
  mixpanel.track(event, properties)
}

export const analytics = {
  initialize() {
    const token = import.meta.env.VITE_MIXPANEL_TOKEN
    if (!token || initialized) return

    mixpanel.init(token, {
      debug: import.meta.env.DEV,
      track_pageview: false,
    })
    initialized = true

    if (window.location.pathname === '/') {
      const url = new URL(window.location.href)
      track('visitor_landing_page_viewed', {
        source: getAcquisitionSource(url),
        campaign: url.searchParams.get('utm_campaign'),
        landing_page_url: url.toString(),
        device_type: getDeviceType(),
      })
    }
  },

  identify(userId: string) {
    if (!initialized) return
    mixpanel.identify(userId)
  },

  track,
}
