import { useState } from 'react'

export const C = {
  bg:       'var(--c-bg, #0a0a0a)',
  surface:  'var(--c-surface, #141414)',
  surface2: 'var(--c-surface2, #1f1f1f)',
  emerald:  'var(--c-emerald, #10b981)',
  emeraldD: 'var(--c-emeraldD, #059669)',
  gold:     'var(--c-gold, #ffd700)',
  goldL:    'var(--c-goldL, #fff3b0)',
  copper:   'var(--c-copper, #d35400)',
  saffron:  'var(--c-saffron, #f4c430)',
  emeraldL: 'var(--c-emeraldL, #34d399)',
  text:     'var(--c-text, #f8fafc)',
  muted:    'var(--c-muted, #94a3b8)',
  border:   'var(--c-border, rgba(16,185,129,0.15))',
  borderH:  'var(--c-borderH, rgba(16,185,129,0.4))',
  danger:   'var(--c-danger, #ef4444)',
}

// ── Global Responsive Styles ──────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=Cairo:wght@400;700;900&display=swap');

  :root {
    --container-padding: 60px;
    --mobile-padding: 20px;
  }
  body {
    margin: 0;
    font-family: 'Outfit', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  @media (max-width: 768px) {
    :root {
      --container-padding: 20px;
    }
  }
  img { max-width: 100%; height: auto; }
  .hide-mobile { @media (max-width: 768px) { display: none !important; } }
  .show-mobile { display: none !important; @media (max-width: 768px) { display: block !important; } }
  
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }
`

export const ResponsiveStyle = () => <style>{globalStyles}</style>

// ── Glass Overlay ───────────────────────────────────────────────────
export const Glass = ({ children, style={} }) => (
  <div style={{
    background: 'rgba(20, 20, 20, 0.65)',
    backdropFilter: 'blur(24px)',
    border: `1px solid ${C.border}`,
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    ...style
  }}>{children}</div>
)

// ── Elegant Ornament ────────────────────────────────────────────────
export const Ornament = () => (
  <div style={{ display:'flex', alignItems:'center', gap:15, color:C.emerald, margin:'20px 0', opacity:0.8 }}>
    <div style={{ height:1, flex:1, background:`linear-gradient(90deg, transparent, ${C.emerald})` }} />
    <span style={{ fontSize:20, filter: `drop-shadow(0 0 10px ${C.emerald})` }}>✦</span>
    <div style={{ height:1, flex:1, background:`linear-gradient(90deg, ${C.emerald}, transparent)` }} />
  </div>
)

// ── Premium Card ────────────────────────────────────────────────────
export const Card = ({ children, style={}, hover=false, onClick }) => (
  <div 
    onClick={onClick}
    style={{
      background:C.surface, 
      border:`1px solid ${C.border}`, 
      borderRadius:32,
      padding:24, 
      transition:'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)', 
      cursor: onClick ? 'pointer' : 'default',
      position:'relative',
      boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
      overflow: 'hidden',
      ...style,
    }}
    onMouseOver={hover ? e => {
      e.currentTarget.style.transform = 'translateY(-12px)';
      e.currentTarget.style.borderColor = C.emerald;
      e.currentTarget.style.boxShadow = `0 30px 60px rgba(0,0,0,0.4), 0 0 30px ${C.emerald}30`;
    } : undefined}
    onMouseOut={hover ? e => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = C.border;
      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
    } : undefined}
  >
    {children}
  </div>
)

// ── Neo Emerald Button ─────────────────────────────────────────────
export const GoldBtn = ({ children, onClick, outline=false, style={}, disabled=false }) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    style={{
      padding:'18px 36px', 
      borderRadius:100, 
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily:"'Outfit', sans-serif", 
      fontSize:15, 
      fontWeight:800, 
      letterSpacing:1,
      textTransform:'uppercase', 
      transition:'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      background: outline ? 'transparent' : `linear-gradient(135deg, ${C.emerald}, ${C.emeraldD})`,
      border: outline ? `2px solid ${C.emerald}` : 'none',
      color: outline ? C.emerald : '#fff',
      boxShadow: outline ? 'none' : `0 10px 30px ${C.emerald}40`,
      opacity: disabled ? 0.5 : 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      ...style,
    }}
    onMouseOver={e => { 
      if(!disabled) {
        e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
        e.currentTarget.style.boxShadow = outline ? `0 0 25px ${C.emerald}40` : `0 20px 40px ${C.emerald}60`;
      }
    }}
    onMouseOut={e => { 
      if(!disabled) {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = outline ? 'none' : `0 10px 30px ${C.emerald}40`;
      }
    }}
  >{children}</button>
)

// ── Neo Arch Frame ──────────────────────────────────────────────────
export const NeoArch = ({ children, style={} }) => (
  <div style={{
    position: 'relative',
    padding: '40px',
    borderRadius: '40px',
    border: `1px solid ${C.border}`,
    background: C.surface,
    transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)',
    ...style
  }}
  onMouseOver={e => {
    e.currentTarget.style.borderColor = C.emerald;
    e.currentTarget.style.boxShadow = `0 30px 60px rgba(0,0,0,0.4), 0 0 30px ${C.emerald}30`;
    e.currentTarget.style.transform = 'translateY(-10px)';
  }}
  onMouseOut={e => {
    e.currentTarget.style.borderColor = C.border;
    e.currentTarget.style.boxShadow = 'none';
    e.currentTarget.style.transform = 'translateY(0)';
  }}
  >
    <div style={{ position:'absolute', top:-10, left:'50%', transform:'translateX(-50%)', color:C.emerald, fontSize:24, textShadow:`0 0 10px ${C.emerald}` }}>✦</div>
    {children}
  </div>
)
export const Arch = NeoArch

// ── UI Helpers ──────────────────────────────────────────────────────
export const Pill = ({ color=C.emerald, bg='rgba(16,185,129,0.1)', children }) => (
  <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:bg,
    border:`1px solid ${color}20`, borderRadius:100, padding:'6px 14px', fontSize:11,
    color, fontWeight:900, letterSpacing:1, textTransform:'uppercase' }}>{children}</span>
)

export const FieldInput = ({ label, type='text', value, onChange, placeholder, style={} }) => (
  <div style={{ marginBottom:25, ...style }}>
    {label && <div style={{ fontSize:11, color:C.emerald, letterSpacing:2,
      textTransform:'uppercase', marginBottom:10, marginLeft:4, fontWeight:800 }}>{label}</div>}
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
      width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:18,
      padding:'18px 24px', color:C.text, fontFamily:"'Outfit', sans-serif", fontSize:15, outline:'none',
      transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', boxSizing:'border-box',
    }}
    onFocus={e=>{e.target.style.borderColor=C.emerald; e.target.style.boxShadow=`0 0 0 6px ${C.emerald}15`, e.target.style.transform='translateY(-2px)'}}
    onBlur={e=>{e.target.style.borderColor=C.border; e.target.style.boxShadow='none', e.target.style.transform='translateY(0)'}}
    />
  </div>
)

export const FieldSelect = ({ label, value, onChange, options, style={} }) => (
  <div style={{ marginBottom:25, ...style }}>
    {label && <div style={{ fontSize:11, color:C.emerald, letterSpacing:2,
      textTransform:'uppercase', marginBottom:10, marginLeft:4, fontWeight:800 }}>{label}</div>}
    <select value={value} onChange={onChange} style={{
      width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:18,
      padding:'18px 24px', color:C.text, fontFamily:"'Outfit', sans-serif", fontSize:15, outline:'none',
      cursor:'pointer', transition: 'all 0.3s'
    }}
    onFocus={e=>e.target.style.borderColor=C.emerald}
    onBlur={e=>e.target.style.borderColor=C.border}
    >
      {options.map(o => (
        <option key={o.value} value={o.value} style={{ background:C.surface }}>{o.label}</option>
      ))}
    </select>
  </div>
)

export const Spinner = () => (
  <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}>
    <div style={{ width:48, height:48, border:`4px solid ${C.border}`, borderTop:`4px solid ${C.emerald}`, borderRadius:'50%', animation:'spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite' }}/>
    <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
  </div>
)

const STATUS = {
  delivered:  { label:'Livré',      color:C.emerald },
  processing: { label:'En cours',   color:C.saffron },
  pending:    { label:'En attente', color:C.copper },
  shipped:    { label:'Expédié',    color:C.emeraldD },
  cancelled:  { label:'Annulé',     color:C.danger },
}
export const StatusBadge = ({ status }) => {
  const s = STATUS[status] || { label: status, color: C.muted }
  return (
    <span style={{ 
      display:'inline-flex', alignItems:'center', gap:8, fontSize:11, color:s.color, 
      fontWeight:900, textTransform:'uppercase', letterSpacing:1,
      background: `${s.color}15`, padding: '6px 14px', borderRadius: 100, border: `1px solid ${s.color}30`
    }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:s.color }} /> {s.label}
    </span>
  )
}

export const ZelligeBg = ({ opacity=0.08 }) => (
  <div style={{ position:'absolute', inset:0, opacity, pointerEvents:'none', zIndex:0 }}>
    <svg width="100%" height="100%">
      <pattern id="p" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <path d="M60 0 L120 60 L60 120 L0 60 Z" fill="none" stroke={C.emerald} strokeWidth="1" />
        <path d="M0 0 L60 60 L120 0" fill="none" stroke={C.emerald} strokeWidth="0.5" opacity="0.4" />
        <circle cx="60" cy="60" r="20" fill="none" stroke={C.gold} strokeWidth="0.5" opacity="0.6" />
        <path d="M60 40 L80 60 L60 80 L40 60 Z" fill={C.emerald} opacity="0.1" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#p)" />
    </svg>
  </div>
)

export const Noise = () => null; // Removed noise as it might look too grainy/unattractive for standard clients
