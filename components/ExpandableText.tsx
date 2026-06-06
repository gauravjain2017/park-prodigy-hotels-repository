'use client'

import { useState } from 'react'

export function ExpandableText({ text, limit, className }: { text: string; limit: number; className?: string }) {
  const [expanded, setExpanded] = useState(false)

  if (text.length <= limit) {
    return <p className={className}>{text}</p>
  }

  return (
    <div className={className}>
      <p style={{ margin: 0 }}>
        {expanded ? text : text.slice(0, limit) + '…'}
      </p>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ background: 'none', border: 'none', padding: '4px 0 0', color: 'var(--blue, #2872cc)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}
      >
        {expanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  )
}
