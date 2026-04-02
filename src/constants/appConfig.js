export const LANGUAGE_STORAGE_KEY = 'cv-language'
export const OWNER_MODE_STORAGE_KEY = 'cv-owner-mode'
export const ANALYTICS_STORAGE_KEY = 'cv-goatcounter-total'

const goatCounterCode = import.meta.env.VITE_GOATCOUNTER_CODE?.trim() ?? ''

export const GOATCOUNTER_CODE = goatCounterCode
export const GOATCOUNTER_ENDPOINT = goatCounterCode ? `https://${goatCounterCode}.goatcounter.com` : ''
export const GOATCOUNTER_JSON_URL = GOATCOUNTER_ENDPOINT ? `${GOATCOUNTER_ENDPOINT}/counter/TOTAL.json?no_branding=1` : ''
export const GOATCOUNTER_SCRIPT_URL = 'https://gc.zgo.at/count.js'

export const ENGINE_UI = {
  en: {
    language: 'Language',
    quickExport: 'Quick export',
    progress: 'Reading progress',
    jumpTo: 'Jump to section',
    analytics: 'Global visits',
    analyticsPending: 'Loading…',
    analyticsUnavailable: 'Connect GoatCounter',
    analyticsLive: 'Live total pageviews',
    analyticsFallback: 'Waiting for GoatCounter',
    readTime: 'Reading time',
    readTimeValue: 'min read',
    share: 'Share',
    shareReady: 'Shared',
    shareCopied: 'Link copied',
  },
  uk: {
    language: 'Мова',
    quickExport: 'Експорт',
    progress: 'Прогрес перегляду',
    jumpTo: 'Перейти до секції',
    analytics: 'Глобальні візити',
    analyticsPending: 'Завантаження…',
    analyticsUnavailable: 'Підключіть GoatCounter',
    analyticsLive: 'Загальна кількість переглядів',
    analyticsFallback: 'Очікування відповіді GoatCounter',
    readTime: 'Час читання',
    readTimeValue: 'хв читання',
    share: 'Поділитися',
    shareReady: 'Поширено',
    shareCopied: 'Посилання скопійовано',
  },
}
