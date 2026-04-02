import { useCallback, useEffect, useRef, useState } from 'react'

export const useSectionNavigation = (navItems) => {
  const [activeSection, setActiveSection] = useState(navItems[0]?.id ?? '')
  const [navLockId, setNavLockId] = useState('')
  const sectionNodesRef = useRef({})
  const navLockTimerRef = useRef(null)
  const lastItemId = navItems[navItems.length - 1]?.id ?? ''

  useEffect(() => {
    if (!navItems.some((item) => item.id === activeSection)) {
      setActiveSection(navItems[0]?.id ?? '')
    }
  }, [activeSection, navItems])

  const registerSection = useCallback((id, node) => {
    if (!id) return

    if (node) {
      sectionNodesRef.current[id] = node
    } else {
      delete sectionNodesRef.current[id]
    }
  }, [])

  const handleJumpTo = useCallback((id) => {
    const node = sectionNodesRef.current[id]
    if (!node) return

    if (navLockTimerRef.current) {
      window.clearTimeout(navLockTimerRef.current)
    }

    setNavLockId(id)
    setActiveSection(id)

    const absoluteTop = window.scrollY + node.getBoundingClientRect().top
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
    const targetTop = id === lastItemId
      ? maxScroll
      : Math.min(Math.max(0, absoluteTop - 104), maxScroll)

    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    })

    navLockTimerRef.current = window.setTimeout(() => {
      setNavLockId('')
      setActiveSection(id)
    }, 950)
  }, [lastItemId])

  useEffect(() => {
    let frameId = 0

    const syncActiveSection = () => {
      if (navLockId) return

      const sections = navItems
        .map((item) => ({ id: item.id, node: sectionNodesRef.current[item.id] }))
        .filter((item) => item.node)

      if (!sections.length) return

      const scrollTop = window.scrollY
      const scrollBottom = scrollTop + window.innerHeight
      const documentBottom = document.documentElement.scrollHeight

      if (lastItemId && documentBottom - scrollBottom <= 16) {
        setActiveSection(lastItemId)
        return
      }

      const focusLine = scrollTop + Math.min(220, window.innerHeight * 0.28)
      let nextActive = sections[0].id

      for (const section of sections) {
        const absoluteTop = scrollTop + section.node.getBoundingClientRect().top
        if (absoluteTop <= focusLine) {
          nextActive = section.id
        } else {
          break
        }
      }

      setActiveSection(nextActive)
    }

    const scheduleSync = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(() => {
        frameId = 0
        syncActiveSection()
      })
    }

    scheduleSync()
    window.addEventListener('scroll', scheduleSync, { passive: true })
    window.addEventListener('resize', scheduleSync)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', scheduleSync)
      window.removeEventListener('resize', scheduleSync)
    }
  }, [lastItemId, navItems, navLockId])

  useEffect(() => () => {
    if (navLockTimerRef.current) {
      window.clearTimeout(navLockTimerRef.current)
    }
  }, [])

  return { activeSection, registerSection, handleJumpTo }
}
