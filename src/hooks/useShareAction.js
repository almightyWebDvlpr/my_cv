import { useCallback, useEffect, useState } from 'react'

export const useShareAction = (shareTitle) => {
  const [shareStatus, setShareStatus] = useState('idle')

  const handleShare = useCallback(async () => {
    const shareUrl = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({ title: shareTitle, url: shareUrl })
        setShareStatus('shared')
        return
      }

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setShareStatus('copied')
        return
      }

      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setShareStatus('copied')
    } catch (error) {
      if (error?.name === 'AbortError') return
      setShareStatus('copied')
    }
  }, [shareTitle])

  useEffect(() => {
    if (shareStatus === 'idle') return undefined

    const timer = window.setTimeout(() => setShareStatus('idle'), 1800)
    return () => window.clearTimeout(timer)
  }, [shareStatus])

  return { shareStatus, handleShare }
}
