import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { C, Ornament } from '../../components/UI'

const KF = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
@keyframes fadeUp    { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes scaleIn   { from { opacity:0; transform:scale(0.7); } to { opacity:1; transform:scale(1); } }
@keyframes pulse     { 0%,100%{opacity:.4} 50%{opacity:1} }
@keyframes dash      { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
`

const STATUSES = [
  { id: 'confirmed', icon: '✓', label: 'Commande confirmée', desc: 'Votre commande a été reçue' },
  { id: 'preparing', icon: '📦', label: 'En préparation', desc: 'Le vendeur prépare votre colis' },
  { id: 'shipped',   icon: '🚚', label: 'Expédiée', desc: 'En route vers votre adresse' },
  { id: 'delivered', icon: '🏠', label: 'Livrée', desc: 'Commande reçue avec succès' },
]

export default function StoreOrderConfirm() {
  const { slug, orderNumber } = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  
  const order = state?.order
  const vendor = state?.vendor

  const activeStep = 0

  const themePrimary = vendor?.theme_settings?.primaryColor || C.gold

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'DM Sans',sans-serif" }}>
      <style>{KF}</style>

      {/* ── Navbar ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(8,8,13,0.9)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.border}`, padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg,${themePrimary},${C.copper})`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: C.bg }}>S</div>
          <span style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', fontWeight: 700, color: themePrimary }}>{vendor?.shop_name || 'SOUK'}</span>
        </div>
        <button onClick={() => navigate(`/store/${slug}`)} style={{ background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, borderRadius: 20, padding: '7px 16px', fontSize: 12, cursor: 'pointer' }}>
          Retourner à la boutique
        </button>
      </header>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '50px 32px 80px', animation: 'fadeUp 0.5s ease-out' }}>

        {/* ── Success Header ── */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          {/* Animated checkmark */}
          <div style={{ width: 90, height: 90, margin: '0 auto 24px', background: `${C.tealL}11`, border: `2px solid ${C.tealL}40`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="22" cy="22" r="20" stroke={C.tealL} strokeWidth="1.5" opacity="0.4" />
              <path d="M12 22L19 29L32 16" stroke={C.tealL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: `${C.tealL}15`, border: `1px solid ${C.tealL}40`, borderRadius: 20, padding: '5px 16px', fontSize: 12, color: C.tealL, marginBottom: 16, fontWeight: 600 }}>
            ● Commande #{orderNumber} Reçue
          </div>

          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: 12, lineHeight: 1.2 }}>
            Une commande d'exception.
          </h1>
          <p style={{ color: C.muted, lineHeight: 1.7, maxWidth: 500, margin: '0 auto', fontSize: '1rem' }}>
            Merci {order?.client_name || 'cher client'}. Votre demande a été transmise à l'artisan. 
            C'est le début d'un voyage vers un savoir-faire authentique.
          </p>
          <div style={{ marginTop:20 }}><Ornament /></div>
        </div>

        {/* ── Order Info Card ── */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: '30px', marginBottom: 28 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
            <div>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Numéro</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: themePrimary }}>#{orderNumber}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Montant Total</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>{order?.total?.toLocaleString('fr-MA')} MAD</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Mode de paiement</div>
              <div style={{ fontSize: 14, color: C.text }}>{order?.payment_method === 'cod' ? 'Cash à la livraison' : 'Paiement en ligne'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Ville</div>
              <div style={{ fontSize: 14, color: C.text }}>{order?.shipping_city}</div>
            </div>
          </div>
        </div>

        {/* ── Tracking Timeline ── */}
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: '30px', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, marginBottom: 30 }}>Suivi de votre commande</div>

          <div style={{ position: 'relative' }}>
            {STATUSES.map((st, i) => {
              const done = i <= activeStep
              const active = i === activeStep
              return (
                <div key={st.id} style={{ display: 'flex', gap: 24, alignItems: 'flex-start', marginBottom: i < STATUSES.length - 1 ? 30 : 0 }}>
                  <div style={{ 
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0, 
                    background: done ? themePrimary : C.surface2, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontSize: 16, color: done ? C.bg : C.muted,
                    boxShadow: active ? `0 0 20px ${themePrimary}40` : 'none'
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: done ? 600 : 400, color: done ? C.text : C.muted }}>{st.label}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{st.desc}</div>
                    {active && <div style={{ fontSize: 10, color: themePrimary, marginTop: 6, fontWeight: 700, letterSpacing: 1 }}>ACTUALISÉ À L'INSTANT</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <button onClick={() => navigate(`/store/${slug}`)} style={{ 
          width: '100%', padding: '16px 0', borderRadius: 14, background: `linear-gradient(135deg,${themePrimary},${themePrimary}CC)`, 
          border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15, boxShadow: `0 10px 30px ${themePrimary}30` 
        }}>
          CONTINUER MON VOYAGE SUR SOUK ✦
        </button>

      </div>
    </div>
  )
}
