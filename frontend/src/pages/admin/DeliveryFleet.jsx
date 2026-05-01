import { useState, useEffect } from 'react'
import { C, Spinner } from '../../components/UI'
import AdminLayout from '../../components/AdminLayout'
import { getOrders } from '../../api/services'

function StatCard({ icon, title, value, sub, color = C.gold, trend }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18,
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120,
        background: `radial-gradient(circle at top right, ${color}15, transparent 70%)` }} />
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function DeliveryFleet() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const r = await getOrders()
      setOrders(r.data?.data || r.data || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const pendingOrders = orders.filter(o => o.status === 'paid' || o.status === 'pending')
  const shippedOrders = orders.filter(o => o.status === 'shipped')
  const deliveredOrders = orders.filter(o => o.status === 'delivered')

  const TABS = [
    { key: 'pending', label: `📦 À Expédier (${pendingOrders.length})` },
    { key: 'shipped', label: `🚚 En Route (${shippedOrders.length})` },
    { key: 'delivered', label: `✅ Livrés (${deliveredOrders.length})` },
  ]

  const displayOrders = tab === 'pending' ? pendingOrders : tab === 'shipped' ? shippedOrders : deliveredOrders

  return (
    <AdminLayout>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 26, fontFamily: "'Playfair Display', serif", color: C.text }}>
          Gestion de la Flotte & Livraisons
        </h1>
        <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Suivi logistique, expéditions et coordination des livreurs</p>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon="🚚" title="Livraisons en Cours" value={shippedOrders.length} color={C.gold} />
        <StatCard icon="📦" title="Attente Expédition" value={pendingOrders.length} color={C.copper} />
        <StatCard icon="🏁" title="Livrées (Total)" value={deliveredOrders.length} color={C.tealL} />
        <StatCard icon="⏱️" title="Temps Moyen" value="2.4 Jours" color="#5cc8b0" />
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '10px 20px', border: 'none', background: 'transparent',
            color: tab === t.key ? C.gold : C.muted, cursor: 'pointer', fontSize: 13,
            fontWeight: tab === t.key ? 600 : 400,
            borderBottom: `2px solid ${tab === t.key ? C.gold : 'transparent'}`,
            transition: 'all .2s', marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
        {loading ? <Spinner /> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.border}` }}>
                {['Commande', 'Ville', 'Client', 'Méthode', 'Date', 'Action'].map(h => (
                  <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayOrders.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: C.muted }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>🚚</div>
                  <div>Aucune livraison dans cette catégorie</div>
                </td></tr>
              )}
              {displayOrders.map((o, i) => (
                <tr key={o.id || i} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .15s' }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '14px 18px', fontSize: 13, color: C.gold, fontWeight: 600 }}>#{o.id}</td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: C.text }}>{o.shipping_city || '—'}</td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: C.muted }}>{o.client_name}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                      background: o.delivery_method === 'express' ? `${C.copper}22` : `${C.gold}15`,
                      color: o.delivery_method === 'express' ? C.copper : C.gold,
                      border: `1px solid ${o.delivery_method === 'express' ? C.copper : C.gold}33`
                    }}>
                      {o.delivery_method?.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 12, color: C.muted }}>{new Date(o.created_at).toLocaleDateString('fr-MA')}</td>
                  <td style={{ padding: '14px 18px' }}>
                    {tab === 'pending' && (
                      <button style={{
                        padding: '6px 12px', borderRadius: 8, background: C.gold, color: '#000',
                        border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                      }}>Expédier</button>
                    )}
                    {tab === 'shipped' && (
                      <button style={{
                        padding: '6px 12px', borderRadius: 8, background: '#5cc8b0', color: '#000',
                        border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer'
                      }}>Confirmer Livraison</button>
                    )}
                    {tab === 'delivered' && (
                      <span style={{ color: '#5cc8b0', fontSize: 12, fontWeight: 600 }}>✅ Terminé</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}
