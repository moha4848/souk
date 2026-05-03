import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { C, ZelligeBg, FieldInput, FieldSelect } from '../../components/UI'

const KF = `
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes pulseGlow { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
`

export default function AdminLanding() {
  const navigate = useNavigate()
  const { admin } = useAdminAuth()

  return (
    <div style={{ minHeight: '100vh', background: '#020203', color: C.text, fontFamily: "'Outfit', sans-serif", display: 'flex', flexDirection: 'column', position:'relative', overflow:'hidden' }}>
      <style>{KF}</style>

      {/* High-End Background Decor */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '800px', height: '800px', background: `radial-gradient(circle, ${C.gold}15 0%, transparent 70%)`, borderRadius: '50%', filter:'blur(120px)', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '1000px', height: '1000px', background: `radial-gradient(circle, ${C.emerald}10 0%, transparent 70%)`, borderRadius: '50%', filter:'blur(150px)', animation: 'float 12s ease-in-out infinite reverse' }} />
        <ZelligeBg opacity={0.03} />
      </div>

      {/* Corp Header */}
      <header style={{ padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
          <img src="/logo.png" alt="SOUK" style={{ height: 40, filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.3))' }} />
          <div style={{ width:1, height:30, background:C.border, margin:'0 5px' }} />
          <span style={{ fontSize: 16, color: '#fff', letterSpacing: 4, fontWeight: 900, textTransform:'uppercase' }}>CORP <span style={{ color:C.gold }}>✦</span></span>
        </div>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:2, fontWeight:700 }}>SECURE ACCESS PROTOCOL v4.2</div>
      </header>

      {/* Hero Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ 
          display:'flex', alignItems:'center', gap:12, marginBottom:35, 
          padding:'10px 25px', borderRadius:100, background: 'rgba(255,255,255,0.03)', 
          border: `1px solid ${C.border}`, backdropFilter:'blur(10px)'
        }}>
           <div style={{ width:8, height:8, borderRadius:'50%', background:C.gold, boxShadow:`0 0 10px ${C.gold}` }} />
           <span style={{ fontSize:11, fontWeight:900, color:C.gold, letterSpacing:3, textTransform:'uppercase' }}>Restricted Management Area</span>
        </div>
        
        <h1 style={{ 
          margin: '0 0 30px', fontSize: 'clamp(3rem, 7vw, 6rem)', 
          fontFamily: "'Playfair Display', serif", lineHeight: 1, color: '#fff', 
          fontWeight: 900, letterSpacing: '-2px' 
        }}>
          Gouvernance <br/> <span style={{ color: C.gold }}>SOUK CORP</span>
        </h1>
        
        <p style={{ maxWidth: 700, color: C.muted, fontSize: '1.4rem', lineHeight: 1.8, marginBottom: 60, fontWeight: 300 }}>
          Interface souveraine de contrôle et de supervision. Gérez l'écosystème SaaS, arbitrez les transactions et pilotez la croissance du royaume digital.
        </p>

        {admin ? (
          <div style={{ animation: 'fadeUp 1s ease-out' }}>
            <div style={{ marginBottom: 30, color: C.emerald, fontSize: 14, fontWeight:700, letterSpacing:1 }}>
               SESSION ACTIVE : ADMINISTRATEUR {admin.name.toUpperCase()}
            </div>
            <button onClick={() => navigate('/admin/dashboard')} style={{ 
              padding: '22px 60px', background: C.gold, border: 'none', 
              borderRadius: 100, color: '#000', fontSize: 15, fontWeight: 900, 
              cursor: 'pointer', boxShadow: `0 20px 40px ${C.gold}30`, transition: '0.4s',
              letterSpacing: 1
            }}
              onMouseOver={e => {e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow=`0 25px 50px ${C.gold}50`}}
              onMouseOut={e => {e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow=`0 20px 40px ${C.gold}30`}}>
              DÉVERROUILLER LE DASHBOARD
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/admin/login')} style={{ 
            padding: '22px 60px', background: 'transparent', border: `1.5px solid ${C.gold}`, 
            borderRadius: 100, color: C.gold, fontSize: 15, fontWeight: 900, 
            cursor: 'pointer', transition: 'all 0.4s', letterSpacing:1
          }}
            onMouseOver={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = '#000'; e.currentTarget.style.boxShadow = `0 20px 40px ${C.gold}40` }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold; e.currentTarget.style.boxShadow = 'none' }}>
            S'AUTHENTIFIER
          </button>
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding: '40px', textAlign: 'center', color: C.muted, fontSize: 11, letterSpacing:2, borderTop: `1px solid ${C.border}`, position: 'relative', zIndex: 10, background: 'rgba(0,0,0,0.3)', backdropFilter:'blur(20px)' }}>
        © 2026 SOUK CORP. PROTOCOLE DE SÉCURITÉ ACTIF. TOUTE INTRUSION EST TRACÉE ET SIGNALÉE.
      </footer>
    </div>
  )
}
