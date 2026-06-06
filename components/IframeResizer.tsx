'use client'
import { useEffect } from 'react'

export function IframeResizer() {
  useEffect(() => {
    function sendHeight() {
      const height = document.body.scrollHeight
      window.parent.postMessage({ type: 'IFRAME_HEIGHT', height }, '*')
    }

    sendHeight()

    const observer = new ResizeObserver(sendHeight)
    observer.observe(document.body)

    return () => observer.disconnect()
  }, [])

  return null
}
