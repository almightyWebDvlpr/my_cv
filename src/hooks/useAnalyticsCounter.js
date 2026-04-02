import { useEffect, useState } from 'react'
import { ANALYTICS_STORAGE_KEY, GOATCOUNTER_ENDPOINT, GOATCOUNTER_JSON_URL, GOATCOUNTER_SCRIPT_URL } from '../constants/appConfig'

const getInitialAnalyticsCount = () => {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(ANALYTICS_STORAGE_KEY) || ''
}

export const useAnalyticsCounter = ({ enabled }) => {
  const [analyticsValue, setAnalyticsValue] = useState(getInitialAnalyticsCount)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(Boolean(GOATCOUNTER_JSON_URL) && enabled && !getInitialAnalyticsCount())

  useEffect(() => {
    if (!GOATCOUNTER_ENDPOINT) return undefined

    window.goatcounter = { ...(window.goatcounter ?? {}), allow_local: true }

    const existingScript = document.querySelector(`script[data-goatcounter="${GOATCOUNTER_ENDPOINT}/count"]`)
    if (existingScript) return undefined

    const script = document.createElement('script')
    script.async = true
    script.dataset.goatcounter = `${GOATCOUNTER_ENDPOINT}/count`
    script.src = GOATCOUNTER_SCRIPT_URL
    document.body.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!enabled || !GOATCOUNTER_JSON_URL) {
      setIsAnalyticsLoading(false)
      return undefined
    }

    const controller = new AbortController()
    let attempts = 0
    let retryTimer
    let refreshTimer

    const getCached = () => window.localStorage.getItem(ANALYTICS_STORAGE_KEY) || ''
    const cached = getCached()

    if (cached) {
      setAnalyticsValue(cached)
      setIsAnalyticsLoading(false)
    } else {
      setIsAnalyticsLoading(true)
    }

    const scheduleRefresh = () => {
      if (controller.signal.aborted) return
      refreshTimer = window.setTimeout(() => {
        attempts = 0
        loadCount(false)
      }, 30000)
    }

    const loadCount = async (showLoader = false) => {
      attempts += 1

      if (showLoader && !getCached()) {
        setIsAnalyticsLoading(true)
      }

      try {
        const response = await fetch(`${GOATCOUNTER_JSON_URL}&_=${Date.now()}`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
          cache: 'no-store',
          mode: 'cors',
        })

        if (!response.ok) throw new Error(`GoatCounter responded with ${response.status}`)

        const data = await response.json()
        const rawCount = typeof data.count === 'number' ? String(data.count) : typeof data.count === 'string' ? data.count.trim() : ''
        if (!rawCount) throw new Error('GoatCounter returned an empty count')

        window.localStorage.setItem(ANALYTICS_STORAGE_KEY, rawCount)
        setAnalyticsValue(rawCount)
        setIsAnalyticsLoading(false)
        scheduleRefresh()
      } catch (error) {
        if (error.name === 'AbortError') return

        const fallbackCount = getCached()
        if (fallbackCount) {
          setAnalyticsValue(fallbackCount)
        }

        if (attempts < 4) {
          retryTimer = window.setTimeout(() => loadCount(showLoader), 1500)
          return
        }

        setIsAnalyticsLoading(false)
        scheduleRefresh()
      }
    }

    loadCount(true)

    return () => {
      controller.abort()
      if (retryTimer) window.clearTimeout(retryTimer)
      if (refreshTimer) window.clearTimeout(refreshTimer)
    }
  }, [enabled])

  return { analyticsValue, isAnalyticsLoading }
}
