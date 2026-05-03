import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDashboard } from '../../api/services'
import { useAuth } from '../../context/AuthContext'
import { useSettings } from '../../context/SettingsContext'
import { C, Ornament, Pill, Card, StatusBadge, ZelligeBg, Spinner, Glass } from '../../components/UI'

export default function Dashboard() {
  const { user }    = useAuth()
  const { settings } = useSettings()
  const navigate    = useNavigate()
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />

  const stats = [
    { icon:'🛍️', val: data?.orders_count ?? 0,    label:'Commandes' },
    { icon:'👁️', val: data?.visits ?? '—',         label:'Visites' },
    { icon:'📦', val: data?.products_count ?? 0,   label:'Produits' },
  ]
  const weekly = data?.weekly_sales ?? []
  const maxW   = Math.max(...weekly.map(w => w.revenue || 0), 1)

  return (
    <div style={{ paddingBottom:16, animation:'fadeUp .35s ease' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .dash-top { display: flex; flex-direction: column; gap: 16px; }
        .dash-revenue { max-width: 100%; }
        .dash-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
        .dash-charts { display: flex; flex-direction: column; gap: 14px; }
        @media (min-width: 900px) {
          .dash-top { flex-direction: row; align-items: stretch; }
          .dash-revenue { flex: 1; min-width: 0; }
          .dash-stats { flex: 1; min-width: 0; grid-template-columns: repeat(3, 1fr); }
          .dash-charts { flex-direction: row; }
          .dash-charts > div { flex: 1; min-width: 0; }
        }
        @media (min-width: 1200px) {
          .dash-content { max-width: 1400px; margin: 0 auto; }
        }
      `}</style>
      <ZelligeBg height={240} />

      {/* Header */}
      <div className="dash-content" style={{ position:'relative', zIndex:1 }}>
      <div style={{ padding:'20px clamp(16px, 3vw, 32px) 0',
        display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:10, letterSpacing:3, color:C.muted, textTransform:'uppercase' }}>Marhba bik</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize: 'clamp(20px, 3vw, 28px)', fontWeight:900, color:'#fff' }}>
            {user?.vendor?.shop_name || user?.name} <span style={{ color:C.gold }}>✦</span>
          </div>
        </div>
        <div onClick={() => navigate('/profile')} style={{ width:40, height:40, borderRadius:'50%', cursor:'pointer',
          background:`linear-gradient(135deg,${C.teal},${C.gold})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:14, fontWeight:600, border:`1.5px solid ${C.border}` }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
      </div>

      {/* Revenue card */}
      {/* Revenue + Stats row */}
      <div className="dash-top" style={{ padding:'18px clamp(16px, 3vw, 32px) 0', position:'relative', zIndex:1 }}>
        <Glass className="dash-revenue" style={{
          background:'rgba(255,255,255,0.03)',
          border:`1px solid ${C.gold}30`, borderRadius:24, padding:'30px', overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', right:-12, top:-20, fontSize:110,
            color:C.gold, opacity:0.05, lineHeight:1, userSelect:'none' }}>◈</div>
          <div style={{ fontSize:10, letterSpacing:2.5, color:C.muted, textTransform:'uppercase', marginBottom:12, fontWeight:800 }}>
            <span style={{ color:C.gold }}>✦</span> Chiffre d'affaires · Ce mois
          </div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight:900, color:'#fff', lineHeight:1 }}>
            {(data?.revenue ?? 0).toLocaleString('fr-MA')}
            <span style={{ fontSize:16, fontWeight:400, color:C.muted, marginLeft:10 }}>MAD</span>
          </div>
          <div style={{ marginTop:20 }}>
            <Pill color={data?.revenue_growth >= 0 ? C.emerald : C.danger}
              bg={data?.revenue_growth >= 0 ? `${C.emerald}15` : `${C.danger}15`}>
              {data?.revenue_growth >= 0 ? '↑' : '↓'} {Math.abs(data?.revenue_growth ?? 0)}% vs mois dernier
            </Pill>
          </div>
        </Glass>

      {/* Mini stats */}
        <div className="dash-stats">
          {stats.map(s => (
            <Glass key={s.label} style={{ 
              background:'rgba(255,255,255,0.02)', border:`1px solid ${C.border}`,
              borderRadius:20, padding:'20px 15px', textAlign:'center', transition: 'transform 0.2s' }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize:28, marginBottom:8, opacity:0.8 }}>{s.icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:900, color:'#fff' }}>{s.val}</div>
              <div style={{ fontSize:10, color:C.muted, textTransform:'uppercase', letterSpacing:1.5, marginTop:6, fontWeight:800 }}>{s.label}</div>
            </Glass>
          ))}
        </div>
      </div>

      <div style={{ padding:'0 clamp(16px, 3vw, 32px)' }}><Ornament /></div>

      {/* Recent orders */}
      <div style={{ padding:'4px clamp(16px, 3vw, 32px) 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:900, color:'#fff' }}>Commandes récentes</div>
        <div onClick={() => navigate('/orders')} style={{ fontSize:11, color:C.gold, cursor:'pointer' }}>Voir tout →</div>
      </div>
      <div style={{ padding:'10px clamp(16px, 3vw, 32px) 0' }}>
        {(data?.recent_orders ?? []).map((o, i) => (
          <div key={o.id} onClick={() => navigate(`/orders/${o.id}`)} style={{
            background:C.surface, border:`1px solid ${C.border}`, borderRadius:14,
            padding:'12px 14px', marginBottom:8, display:'flex', justifyContent:'space-between',
            alignItems:'center', cursor:'pointer', transition:'border .2s',
            animation:`fadeUp .3s ease ${i*0.07}s both`,
          }}
          onMouseOver={e=>e.currentTarget.style.borderColor=C.borderH}
          onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
            <div>
              <div style={{ fontSize:13, fontWeight:500 }}>{o.client_name}</div>
              <div style={{ fontSize:10, color:C.muted, marginTop:2, letterSpacing:1 }}>#{o.id} · {o.client_city}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, fontWeight:600, color:C.goldL }}>
                {o.total} MAD
              </div>
              <div style={{ marginTop:2 }}><StatusBadge status={o.status} /></div>
            </div>
          </div>
        ))}
        {(data?.recent_orders ?? []).length === 0 && (
          <div style={{ textAlign:'center', color:C.muted, padding:'30px 0',
            fontFamily:"'Cormorant Garamond',serif", fontSize:16 }}>Aucune commande encore ◇</div>
        )}
      </div>

      {/* Weekly chart + Top Products side by side on desktop */}
      <div className="dash-charts" style={{ padding:'14px clamp(16px, 3vw, 32px) 0' }}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:16 }}>
        <div style={{ fontSize:10, letterSpacing:2, color:C.muted, textTransform:'uppercase', marginBottom:14 }}>
          Ventes · 7 derniers jours
        </div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:64 }}>
          {weekly.map((w, i) => (
            <div key={i} style={{ flex:1, borderRadius:'3px 3px 0 0',
              background:`linear-gradient(to top,${C.copper},${C.gold})`,
              height:`${Math.max((w.revenue/maxW)*100, 4)}%`,
              opacity: 0.6 + i * 0.06 }} />
          ))}
        </div>
        <div style={{ display:'flex', gap:6, marginTop:6 }}>
          {weekly.map((w, i) => (
            <div key={i} style={{ flex:1, textAlign:'center', fontSize:9, color:C.muted }}>{w.date}</div>
          ))}
        </div>
      </div>
      </div>

      {/* Top Products Analytics */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:16 }}>
        <div style={{ fontSize:10, letterSpacing:2, color:C.muted, textTransform:'uppercase', marginBottom:16 }}>
          Performance · Top Produits
        </div>
        {(data?.top_products ?? []).length === 0 ? (
          <div style={{ fontSize: 12, color: C.muted, textAlign: 'center', padding: '20px 0' }}>Aucune donnée de vente ◇</div>
        ) : data.top_products.map(p => (
          <div key={p.id} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
              <span style={{ fontWeight: 500 }}>{p.name}</span>
              <span style={{ color: C.muted }}>{p.sold} vendus</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${Math.min(100, (p.sold / 50) * 100)}%`, background: C.gold, borderRadius: 3 }} />
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}
