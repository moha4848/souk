import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { C } from './UI'
import LanguageSwitcher from './LanguageSwitcher'

const NAV = [
  { path:'/dashboard',  icon:'⬡', label:'dashboard' },
  { path:'/products',   icon:'◈', label:'products' },
  { path:'/orders',     icon:'◇', label:'orders' },
  { path:'/analytics',  icon:'◉', label:'analytics' },
  { path:'/profile',    icon:'◎', label:'profile' },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const RESPONSIVE_CSS = `
  /* ── RESET ── */
  .layout-root {
    min-height: 100vh;
    background: radial-gradient(ellipse at 30% 0%, rgba(255,215,0,0.05) 0%, ${C.bg} 60%);
    display: flex;
    font-family: 'Outfit', sans-serif;
    color: ${C.text};
  }

  /* ── SIDEBAR (Desktop) ── */
  .sidebar {
    display: none;
    width: 280px;
    min-height: 100vh;
    background: ${C.surface};
    border-right: 1px solid ${C.border};
    flex-shrink: 0;
    flex-direction: column;
    padding: 0;
    position: sticky;
    top: 0;
    height: 100vh;
    overflow-y: auto;
    z-index: 50;
    box-shadow: 20px 0 60px rgba(0,0,0,0.2);
  }

  /* ── MAIN CONTENT ── */
  .main-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .content-scroll {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 100px;
  }

  /* ── TOP BAR ── */
  .top-bar {
    display: flex; justify-content: space-between; align-items: center;
    background: rgba(10,10,10,0.4); backdrop-filter: blur(20px);
    border-bottom: 1px solid ${C.border};
  }

  /* ── BOTTOM NAV (Mobile) ── */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: 85px; background: rgba(15,15,15,0.85); backdrop-filter: blur(40px);
    border-top: 1px solid ${C.border}; display: flex; align-items: center;
    justify-content: space-around; z-index: 100;
    padding-bottom: 15px;
  }

  .fab-btn {
    width: 60px; height: 60px; background: linear-gradient(135deg, ${C.emerald}, ${C.emeraldD});
    border: none; border-radius: 20px; color: #fff; font-size: 32px; font-weight: 300;
    box-shadow: 0 10px 25px ${C.emerald}60; cursor: pointer;
    transform: translateY(-25px); transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex; alignItems: center; justifyContent: center;
  }
  .fab-btn:hover { transform: translateY(-30px) scale(1.1); boxShadow: 0 15px 35px ${C.emerald}80; }

  /* ── Sidebar items ── */
  .sidebar-item {
    display: flex; align-items: center; gap: 16px;
    padding: 16px 28px; cursor: pointer; border: none; background: none;
    color: ${C.muted}; font-family: 'Outfit', sans-serif; font-size: 15px;
    transition: all 0.3s; width: 100%; text-align: left;
    border-left: 4px solid transparent; letter-spacing: 0.5px;
    font-weight: 500;
  }
  .sidebar-item:hover { background: rgba(16,185,129,0.05); color: ${C.text}; }
  .sidebar-item.active {
    color: ${C.emerald}; font-weight: 800;
    background: linear-gradient(90deg, rgba(16,185,129,0.1), transparent);
    border-left-color: ${C.emerald};
  }

  /* ── DESKTOP: show sidebar, hide bottom nav ── */
  @media (min-width: 1024px) {
    .sidebar { display: flex; }
    .bottom-nav { display: none; }
    .content-scroll { padding-bottom: 0; }
    .top-bar { padding: 20px 45px; }
  }

  @media (max-width: 1023px) {
    .top-bar { padding: 15px 20px; }
  }
`

  return (
    <div className="layout-root">
      <style>{RESPONSIVE_CSS}</style>

      <aside className="sidebar">
        <div style={{ padding: '45px 28px' }}>
          <div onClick={() => navigate('/')} style={{ cursor:'pointer', display: 'flex', alignItems: 'center', gap: 15, marginBottom: 40 }}>
             <img src="/logo.png" alt="SOUK" style={{ height: 60, width: 'auto', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.2))' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {NAV.map(it => {
              const active = pathname === it.path
              return (
                <button
                  key={it.path}
                  className={`sidebar-item ${active ? 'active' : ''}`}
                  onClick={() => navigate(it.path)}
                >
                  <span style={{ fontSize: 20 }}>{it.icon}</span>
                  {t(it.label)}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ marginTop: 'auto', padding: '30px 28px', borderTop: `1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
            <div style={{ width:36, height:36, borderRadius:12, background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:C.emerald }}>{user?.name?.charAt(0)}</div>
            <div style={{ fontSize:13, fontWeight:700 }}>{user?.name?.split(' ')[0]}</div>
          </div>
          <button onClick={logout} style={{ width:'100%', padding:12, borderRadius:12, border:`1px solid ${C.border}`, background:'none', color:C.muted, fontSize:12, fontWeight:800, cursor:'pointer', textTransform:'uppercase' }}>{t('logout')}</button>
        </div>
      </aside>

      <div className="main-content">
        <div className="top-bar">
          <img src="/logo.png" alt="SOUK" className="show-mobile" style={{ height: 40, width: 'auto', cursor: 'pointer' }} onClick={() => navigate('/')} />
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, alignItems: 'center' }}>
            <LanguageSwitcher />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.emerald, boxShadow: `0 0 10px ${C.emerald}` }} />
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', opacity: 0.6 }}>{t('status_operational')}</span>
            </div>
          </div>
        </div>

        <div className="content-scroll">
          {children}
        </div>
      </div>

      <div className="bottom-nav">
        {NAV.map((it, i) => {
          const active = pathname === it.path
          const fab = i === 2 ? (
            <button key="fab" className="fab-btn" onClick={() => navigate('/products/new')}>+</button>
          ) : null

          return [
            fab,
            <button key={it.path} onClick={() => navigate(it.path)} style={{
              flex:1, background:'none', border:'none', display:'flex', flexDirection:'column',
              alignItems:'center', gap:6, cursor:'pointer', color: active ? C.emerald : C.muted,
              transition:'all .4s cubic-bezier(0.4, 0, 0.2, 1)', fontFamily:"'Outfit', sans-serif",
              transform: active ? 'translateY(-4px)' : 'none'
            }}>
              <span style={{ fontSize:24, opacity: active ? 1 : 0.5, filter: active ? `drop-shadow(0 0 8px ${C.emerald}40)` : 'none' }}>{it.icon}</span>
              <span style={{ fontSize:9, letterSpacing:1.5, textTransform:'uppercase', fontWeight: active ? 900 : 600 }}>{t(it.label)}</span>
              {active && <div style={{ width: 5, height: 5, borderRadius: '50%', background: C.emerald, marginTop: 4, boxShadow:`0 0 10px ${C.emerald}` }} />}
            </button>
          ]
        })}
      </div>
    </div>
  )
}
