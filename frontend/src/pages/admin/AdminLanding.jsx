import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { C } from '../../components/UI'

const KF = `
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
@keyframes pulseGlow { 0%, 100% { opacity: 0.5; } 50% { opacity: 0.8; } }
`

export default function AdminLanding() {
  const navigate = useNavigate()
  const { admin } = useAdminAuth()

  return (
    <div style={{ minHeight: '100vh', background: '#020203', color: C.text, fontFamily: "'DM Sans', sans-serif", display: 'flex', flexDirection: 'column' }}>
      <style>{KF}</style>

      {/* Abstract Background */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', borderRadius: '50%', animation: 'float 8s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(201,168,76,0.02) 0%, transparent 60%)', borderRadius: '50%', animation: 'float 12s ease-in-out infinite reverse' }} />
      </div>

      {/* Minimalist Top Nav */}
      <header style={{ padding: '30px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.gold, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.bg, fontWeight: 800 }}>S</div>
          <span style={{ fontSize: 18, color: '#fff', letterSpacing: 2, fontWeight: 700 }}>SOUK CORP</span>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ border: `1px solid ${C.gold}40`, padding: '6px 16px', borderRadius: 20, color: C.gold, fontSize: 12, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 24, background: 'rgba(201,168,76,0.05)' }}>
          Accès Restreint
        </div>
        
        <h1 style={{ margin: '0 0 20px', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontFamily: "'Playfair Display', serif", lineHeight: 1.1, color: '#fff' }}>
          Portail du <span style={{ color: C.gold }}>SuperAdmin</span>
        </h1>
        
        <p style={{ maxWidth: 600, color: C.muted, fontSize: '1.2rem', lineHeight: 1.6, marginBottom: 50 }}>
          Interface centrale de gestion de la plateforme SOUK. Supervisez les vendeurs, analysez les revenus SaaS et configurez les forfaits d'abonnement.
        </p>

        {admin ? (
          <div>
            <div style={{ marginBottom: 20, color: C.teal, fontSize: 14 }}>Vous êtes déjà authentifié en tant que {admin.name}</div>
            <button onClick={() => navigate('/admin/dashboard')} style={{ padding: '16px 40px', background: `linear-gradient(135deg, ${C.gold}, ${C.copper})`, border: 'none', borderRadius: 30, color: C.bg, fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: `0 10px 30px ${C.gold}40`, transition: 'transform 0.2s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
              Accéder au Dashboard
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/admin/login')} style={{ padding: '16px 40px', background: 'transparent', border: `2px solid ${C.gold}`, borderRadius: 30, color: C.gold, fontSize: 16, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}
            onMouseOver={e => { e.currentTarget.style.background = C.gold; e.currentTarget.style.color = C.bg; e.currentTarget.style.boxShadow = `0 10px 30px ${C.gold}40` }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.gold; e.currentTarget.style.boxShadow = 'none' }}>
            S'authentifier
          </button>
        )}
      </main>

      {/* Footer */}
      <footer style={{ padding: '30px', textAlign: 'center', color: C.muted, fontSize: 13, borderTop: `1px solid rgba(255,255,255,0.05)`, position: 'relative', zIndex: 10 }}>
        Système de gestion interne SOUK. Toute tentative d'accès non autorisé est surveillée.
      </footer>
    </div>
  )
}
