'use client'

import { useState, useEffect, useRef } from 'react'

export type GuestConfig = {
  adults: number
  children: number
  childAges: number[]
  rooms: number
}

const LIMITS = { adults: { min: 1, max: 6 }, children: { min: 0, max: 9 }, rooms: { min: 1, max: 4 } }

export function GuestSelector({ value, onChange }: { value: GuestConfig; onChange: (v: GuestConfig) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  function step(field: 'adults' | 'children' | 'rooms', dir: number) {
    const lim = LIMITS[field]
    const cur = value[field] as number
    const nv = Math.min(lim.max, Math.max(lim.min, cur + dir))
    const next = { ...value, [field]: nv }
    if (field === 'children') {
      next.childAges = Array.from({ length: nv }, (_, i) => value.childAges[i] ?? 0)
    }
    onChange(next)
  }

  function setChildAge(idx: number, age: number) {
    const childAges = [...value.childAges]
    childAges[idx] = age
    onChange({ ...value, childAges })
  }

  const dropdownContent = (
    <>
      <div className="guest-dd-room-title">Select Adults &amp; Rooms</div>
      {(['adults', 'children', 'rooms'] as const).map(field => (
        <div className="guest-dd-row" key={field}>
          <div className="guest-dd-label">
            <span className="guest-dd-name">{field.toUpperCase()}</span>
            {field === 'adults' && <span className="guest-dd-sub">(Age 18+)</span>}
            {field === 'children' && <span className="guest-dd-sub">(Under 18)</span>}
          </div>
          <div className="guest-dd-stepper">
            <button type="button" className="stepper-btn" onClick={() => step(field, -1)}>−</button>
            <span className="stepper-val">{value[field]}</span>
            <button type="button" className="stepper-btn" onClick={() => step(field, 1)}>+</button>
          </div>
        </div>
      ))}

      {value.children > 0 && (
        <div className="guest-dd-ages">
          <div className="guest-dd-ages-label">Age(s) of Children</div>
          <div className="guest-dd-ages-list">
            {Array.from({ length: value.children }, (_, i) => (
              <select key={i} value={value.childAges[i] ?? 0} onChange={e => setChildAge(i, +e.target.value)}>
                {Array.from({ length: 18 }, (_, age) => (
                  <option key={age} value={age}>{age}</option>
                ))}
              </select>
            ))}
          </div>
        </div>
      )}

      <button type="button" className="guest-dd-update" onClick={() => setOpen(false)}>Update</button>
    </>
  )

  return (
    <div className="search-bar-field search-bar-field--guests" ref={ref}>
      <div className="search-bar-mobile-label">Guests</div>
      <div className="search-bar-val-row" onClick={() => setOpen(o => !o)}>
        <svg className="field-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="4" r="2.5" stroke="#8899bb" strokeWidth="1.5"/>
          <path d="M2 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#8899bb" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="guest-summary">
          <span className="guest-summary-main">
            {value.adults} Adult{value.adults !== 1 ? 's' : ''}{value.children > 0 ? `, ${value.children} Child${value.children !== 1 ? 'ren' : ''}` : ''}
          </span>
          <span className="guest-summary-sub">{value.rooms} Room{value.rooms !== 1 ? 's' : ''}</span>
        </span>
        <svg className="guest-arrow" width="9" height="5" viewBox="0 0 9 5">
          <path d="M0 0l4.5 5L9 0z" fill="#aaa"/>
        </svg>
      </div>

      {open && (
        <div className="guest-dropdown open" onClick={e => e.stopPropagation()}>
          {dropdownContent}
        </div>
      )}
    </div>
  )
}
