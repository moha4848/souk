import { createContext, useContext, useState, useEffect } from 'react'

const SettingsContext = createContext(null)

const DEFAULTS = {
  dark_mode: true,
  accent: '#c9a84c',       // gold default
  font_size: 'normal',     // small | normal | large
  notif_push: true,
  notif_email: true,
  notif_sms: false,
  shop_name: 'Ma Boutique',
  shop_desc: 'Produits artisanaux marocains de qualité.',
  shop_phone: '+212 6XX XXX XXX',
  delivery_amana: true,
  delivery_chrono: false,
  delivery_free_above: '500',
  promo_active: true,
  promo_code: 'SOUK10',
  promo_value: 10,         // MAD
  payment_cod: true,
  payment_bank: true,
  payment_paypal: false,
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('souk_settings') || '{}')
      return { ...DEFAULTS, ...saved }
    } catch {
      return { ...DEFAULTS }
    }
  })

  // Persist on every change
  useEffect(() => {
    localStorage.setItem('souk_settings', JSON.stringify(settings))
  }, [settings])

  const update = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Compute dynamic theme from settings
  const theme = settings.dark_mode ? {
    bg:       '#08080d',
    surface:  '#111118',
    surface2: '#1a1a24',
    text:     '#f0ead6',
    muted:    '#6a6358',
    border:   'rgba(201,168,76,0.13)',
    borderH:  'rgba(201,168,76,0.32)',
  } : {
    bg:       '#f8f6f0',
    surface:  '#ffffff',
    surface2: '#efeade',
    text:     '#1a1814',
    muted:    '#8a8578',
    border:   'rgba(120,100,60,0.15)',
    borderH:  'rgba(120,100,60,0.35)',
  }

  theme.gold    = settings.accent
  theme.goldL   = settings.dark_mode ? lighten(settings.accent, 30) : settings.accent
  theme.copper  = '#b87333'
  theme.teal    = '#2a6b6b'
  theme.tealL   = '#5cc8b0'
  theme.danger  = '#c94c4c'

  const fontScale = settings.font_size === 'Petit' ? 0.9 : settings.font_size === 'Grand' ? 1.15 : 1

  // Inject CSS variables to root to make C object dynamic everywhere
  useEffect(() => {
    const root = document.documentElement
    Object.entries(theme).forEach(([k, v]) => {
      root.style.setProperty(`--c-${k}`, v)
    })
    root.style.fontSize = `${fontScale * 100}%`
  }, [theme, fontScale])

  return (
    <SettingsContext.Provider value={{ settings, update, toggle, theme, fontScale }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)

// Simple color lighten helper
function lighten(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, (num >> 16) + Math.round(255 * percent / 100))
  const g = Math.min(255, ((num >> 8) & 0x00FF) + Math.round(255 * percent / 100))
  const b = Math.min(255, (num & 0x0000FF) + Math.round(255 * percent / 100))
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
}
