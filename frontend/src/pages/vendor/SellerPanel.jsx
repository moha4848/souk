import { useState, useEffect } from 'react'
import { C, Card, Ornament, ZelligeBg, Pill, Spinner, StatusBadge } from '../../components/UI'
import { DollarSign, Package, Archive, Eye, Sparkles, ArrowRight } from 'lucide-react'
import { getSellerDashboard } from '../../api/services'

export default function SellerPanel() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSellerDashboard()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (!data) return <div style={{ color:C.text, padding:40 }}>Erreur de chargement.</div>

  const { stats, recent_orders, store_info } = data

  return (
    <div style={{ padding: '0 0 60px 0', minHeight:'100vh', background:C.bg }}>
      <div style={{ position:'relative', padding:'60px 40px', background:C.surface, borderBottom:`1px solid ${C.border}` }}>
        <ZelligeBg height={180} />
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ color:C.gold, fontSize:12, letterSpacing:4, textTransform:'uppercase', marginBottom:8 }}>
            Tableau de Bord Vendeur
          </div>
          <h1 style={{ color:C.text, fontSize:42, margin:0, fontFamily:"'Playfair Display', serif", fontWeight:900 }}>
            Bienvenue, {store_info.name || 'Artisan SOUK'}
          </h1>
          <div style={{ marginTop:14, display:'flex', gap:10 }}>
            <Pill color={C.goldL} bg="rgba(201,168,76,0.1)">{store_info.slug}.souk.ma</Pill>
            <Pill color={C.tealL} bg="rgba(92,200,176,0.1)">Boutique active</Pill>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px', maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Stat Cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:24, marginBottom:40 }}>
          <StatCard label="Chiffre d'Affaires" value={`${stats.total_revenue} MAD`} icon={<DollarSign size={32} />} color={C.gold} />
          <StatCard label="Commandes" value={stats.total_orders} icon={<Package size={32} />} color={C.copper} />
          <StatCard label="Produits" value={stats.total_products} icon={<Archive size={32} />} color={C.teal} />
          <StatCard label="Visiteurs" value={stats.visitors} icon={<Eye size={32} />} color={C.text} />
        </div>

        <div style={{ display:'grid', gridTemplateColumns: '2fr 1fr', gap:24 }}>
          
          {/* Recent Orders */}
          <Card>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h3 style={{ margin:0, color:C.text }}>Dernières Commandes</h3>
              <span onClick={() => navigate('/orders')} style={{ fontSize:12, color:C.gold, cursor:'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>Voir tout <ArrowRight size={14} /></span>
            </div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ textAlign:'left', borderBottom:`1px solid ${C.border}`, color:C.muted, fontSize:11, textTransform:'uppercase' }}>
                  <th style={{ padding:'12px 0' }}>Client</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {recent_orders.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding:20, textAlign:'center', color:C.muted }}>Aucune commande récente.</td></tr>
                ) : recent_orders.map(order => (
                  <tr key={order.id} style={{ borderBottom:`1px solid ${C.border}`, fontSize:14, color:C.text }}>
                    <td style={{ padding:'16px 0' }}>{order.client_name}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td style={{ fontWeight:600 }}>{order.total} MAD</td>
                    <td><StatusBadge status={order.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Tips Box */}
          <Card style={{ background:`linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)` }}>
            <h3 style={{ color:C.gold, margin:'0 0 10px 0', display:'flex', alignItems:'center', gap:10 }}>Conseils SOUK IA <Sparkles size={16} /></h3>
            <Ornament />
            <p style={{ color:C.muted, fontSize:13, lineHeight:1.6, marginTop:20 }}>
              "Votre boutique a reçu 15% de visiteurs en plus cette semaine. Pensez à ajouter une <strong>Vente Flash</strong> sur vos articles les plus aimés pour booster vos conversions."
            </p>
            <div style={{ marginTop:24, padding:16, border:`1px dashed ${C.border}`, borderRadius:12, fontSize:12, color:C.goldL }}>
              Saviez-vous que les photos sur fond clair augmentent les clics de 30% ?
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <Card style={{ position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', right:-10, bottom:-10, opacity:0.05, color }}>{icon}</div>
      <div style={{ fontSize:11, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>{label}</div>
      <div style={{ fontSize:28, fontWeight:600, color }}>{value}</div>
    </Card>
  )
}
