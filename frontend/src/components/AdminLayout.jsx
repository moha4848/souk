import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'
import { C } from './UI'

export default function AdminLayout({ children }) {
  const { admin, logoutAdmin } = useAdminAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const TEAM_CONFIG = {
    superadmin: {
      label: 'Super Admin',
      icon: '⬢',
      color: C.emerald,
      nav: [
        { path: '/admin/dashboard',    icon: '📊', label: 'Vue Globale' },
        { path: '/admin/moderation',   icon: '🛡️', label: 'Modération' },
        { path: '/admin/finance',      icon: '💰', label: 'Finance' },
        { path: '/admin/rbac',         icon: '🔐', label: 'Équipes & Rôles' },
        { path: '/admin/logs',         icon: '📜', label: 'Audit Logs' },
      ]
    },
    staff: {
      label: 'Équipe',
      icon: '⬡',
      color: C.emeraldL,
      nav: [
        { path: '/admin/dashboard', icon: '📊', label: 'Mon espace' },
      ]
    },
  }

  const ADMIN_CSS = `
    @media (max-width: 900px) {
      .admin-sidebar { transform: translateX(-100%); width: 0 !important; }
      .admin-main { margin-left: 0 !important; }
      .admin-topbar { padding: 0 15px !important; }
      .admin-content { padding: 25px !important; }
      .admin-bottom-nav { display: flex !important; }
    }
  `

  const role = admin?.role || 'superadmin'
  const config = TEAM_CONFIG[role]

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Outfit', sans-serif" }}>
      <style>{ADMIN_CSS}</style>
      
      {/* ── Desktop Sidebar ── */}
      <aside className="admin-sidebar" style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 280,
        background: C.surface, borderRight: `1px solid ${C.border}`,
        display: 'flex', flexDirection: 'column', zIndex: 100, transition:'0.4s'
      }}>
        <div style={{ padding: '40px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 50 }}>
            <div style={{ 
              width: 40, height: 40, borderRadius: 12, background: C.emerald, 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 20px ${C.emerald}40`
            }}>
              <span style={{ fontSize: 20, color: '#fff' }}>{config.icon}</span>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: 2 }}>SOUK</div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: config.color, fontWeight: 800 }}>{config.label.toUpperCase()}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {config.nav.map(item => {
              const active = pathname === item.path
              return (
                <button 
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                    borderRadius: 12, border: 'none', background: active ? `${C.emerald}10` : 'none',
                    color: active ? C.emerald : C.muted, cursor: 'pointer', transition: '0.3s',
                    textAlign: 'left', fontSize: 14, fontWeight: active ? 800 : 500
                  }}
                  onMouseOver={e => !active && (e.currentTarget.style.color = C.text)}
                  onMouseOut={e => !active && (e.currentTarget.style.color = C.muted)}
                >
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginTop: 'auto', padding: 30, borderTop: `1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
             <div style={{ width:32, height:32, borderRadius:8, background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800 }}>{admin?.name?.charAt(0)}</div>
             <div style={{ fontSize:13, fontWeight:700 }}>{admin?.name}</div>
          </div>
          <button 
            onClick={logoutAdmin}
            style={{ 
              width: '100%', padding: 12, borderRadius: 10, background: 'none', 
              border: `1px solid ${C.border}`, color: C.danger, cursor: 'pointer',
              fontSize: 12, fontWeight: 800
            }}
          >DECONNEXION</button>
        </div>
      </aside>

      {/* ── Main Area ── */}
      <main className="admin-main" style={{ marginLeft: 280, transition:'0.4s' }}>
        <header className="admin-topbar" style={{
          height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px', background: 'rgba(10,10,10,0.5)', backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${C.border}`, position:'sticky', top:0, zIndex:90
        }}>
          <h2 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 2, color: C.muted }}>
             Dashboard <span style={{ color:C.text, margin:'0 10px' }}>/</span> <span style={{ color:C.emerald }}>{config.nav.find(n => n.path === pathname)?.label || 'Aperçu'}</span>
          </h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
             <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 800 }}>{admin?.name}</div>
                <div style={{ fontSize: 10, color: config.color, fontWeight: 700 }}>{admin?.role}</div>
             </div>
             <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.emerald, boxShadow: `0 0 10px ${C.emerald}` }} />
          </div>
        </header>

        <div className="admin-content" style={{ padding: 45 }}>
          {children}
        </div>
      </main>

      {/* ── Mobile Bottom Nav ── */}
      <div className="admin-bottom-nav" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, height: 75,
        background: C.surface, borderTop: `1px solid ${C.border}`,
        display: 'none', justifyContent: 'space-around', alignItems: 'center', zIndex: 200
      }}>
        {config.nav.slice(0, 4).map(item => {
          const active = pathname === item.path
          return (
            <button key={item.path} onClick={() => navigate(item.path)} style={{
              background: 'none', border: 'none', color: active ? C.emerald : C.muted,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              fontSize: 10, cursor: 'pointer', transition:'0.3s'
            }}>
              <span style={{ fontSize: 22, opacity: active ? 1 : 0.6 }}>{item.icon}</span>
              <span style={{ fontWeight: active ? 900 : 600, letterSpacing:1 }}>{item.label.split(' ')[0].toUpperCase()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
