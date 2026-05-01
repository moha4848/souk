import { useState, useEffect } from 'react'
import { C, Spinner } from '../../components/UI'
import AdminLayout from '../../components/AdminLayout'
import { getCommissions } from '../../api/services'

import StatCard from '../../features/admin/components/StatCard'

function MiniChart({ data, color }) {
  if (!data?.length) return null
  const max = Math.max(...data)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40 }}>
      {data.map((v, i) => (
        <div key={i} style={{
          flex: 1, borderRadius: '3px 3px 0 0',
          height: `${(v / max) * 100}%`,
          background: `linear-gradient(180deg, ${color}, ${color}66)`,
          transition: 'height .5s',
          minHeight: 4,
        }} />
      ))}
    </div>
  )
}

export default function FinanceReview() {
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('commissions')
  const [dateFilter, setDateFilter] = useState('month')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const r = await getCommissions()
      setCommissions(r.data?.data || r.data || [])
    } catch {
      setCommissions([])
    } finally {
      setLoading(false)
    }
  }

  const totalCommissions = commissions.reduce((s, c) => s + parseFloat(c.amount || 0), 0)

  // Simulated chart data (replace with real data)
  const chartData = [12400, 15200, 11800, 18900, 14300, 22100, 19600, 25400]

  const TABS = [
    { key: 'commissions', label: '💰 Commissions' },
    { key: 'subscriptions', label: '🔁 Abonnements' },
    { key: 'payouts', label: '📤 Virements' },
  ]

  return (
    <AdminLayout>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: '0 0 6px', fontSize: 26, fontFamily: "'Playfair Display', serif", color: C.text }}>
          Tableau de Bord Financier
        </h1>
        <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Revenus, commissions et mouvements de fonds</p>
      </div>

      {/* ── Stats Grid ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <StatCard icon="💎" title="Commissions SOUK" value={`${totalCommissions.toLocaleString()} MAD`} color={C.gold} trend={12.4} />
        <StatCard icon="📈" title="Volume Transactionnel" value="1.24M MAD" sub="Ce mois" color={C.tealL} trend={8.2} />
        <StatCard icon="🔁" title="Abonnements Actifs" value="142" sub="sur 158 inscrits" color={C.copper} />
        <StatCard icon="✅" title="Taux de Succès Paiement" value="98.3%" color="#5cc8b0" trend={0.8} />
      </div>

      {/* ── Revenue Chart Card ─────────────────────────────────────── */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>Évolution des Revenus</div>
            <div style={{ fontSize: 12, color: C.muted }}>Commissions SOUK par semaine</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['week', 'month', 'year'].map(f => (
              <button key={f} onClick={() => setDateFilter(f)} style={{
                padding: '6px 14px', borderRadius: 20, border: `1px solid ${dateFilter === f ? C.gold : C.border}`,
                background: dateFilter === f ? `${C.gold}18` : 'transparent',
                color: dateFilter === f ? C.gold : C.muted, cursor: 'pointer', fontSize: 12,
              }}>
                {f === 'week' ? 'Semaine' : f === 'month' ? 'Mois' : 'An'}
              </button>
            ))}
          </div>
        </div>
        {/* Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100, marginBottom: 8 }}>
          {chartData.map((v, i) => {
            const max = Math.max(...chartData)
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', borderRadius: '6px 6px 0 0',
                  height: `${(v / max) * 90}%`, minHeight: 6,
                  background: i === chartData.length - 1
                    ? `linear-gradient(180deg, ${C.gold}, ${C.copper})`
                    : `linear-gradient(180deg, ${C.gold}66, ${C.gold}22)`,
                  transition: 'height .8s ease',
                  position: 'relative',
                }}>
                  {i === chartData.length - 1 && (
                    <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 9, color: C.gold, whiteSpace: 'nowrap', fontWeight: 700 }}>
                      {v.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['S1','S2','S3','S4','S5','S6','S7','S8'].map(s => (
            <div key={s} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: C.muted }}>{s}</div>
          ))}
        </div>
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

      {/* ── Commissions Table ───────────────────────────────────────── */}
      {tab === 'commissions' && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
          {loading ? <Spinner /> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.border}` }}>
                  {['Commande', 'Vendeur', 'Client', 'Montant Total', 'Commission', 'Date'].map(h => (
                    <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {commissions.length === 0 && (
                  <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: C.muted }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>💸</div>
                    <div>Aucune commission enregistrée</div>
                  </td></tr>
                )}
                {commissions.map((c, i) => (
                  <tr key={c.id || i} style={{ borderBottom: `1px solid ${C.border}`, transition: 'background .15s' }}
                  onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                  onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '14px 18px', fontSize: 13, color: C.gold, fontWeight: 600 }}>#{c.order_id}</td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: C.text }}>{c.vendor?.shop_name || c.vendor?.name || '—'}</td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: C.muted }}>{c.order?.user?.name || '—'}</td>
                    <td style={{ padding: '14px 18px', fontSize: 13, color: C.text }}>{parseFloat(c.order?.total || 0).toLocaleString()} MAD</td>
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ color: '#5cc8b0', fontWeight: 700, fontSize: 14 }}>{parseFloat(c.amount || 0).toLocaleString()} MAD</span>
                    </td>
                    <td style={{ padding: '14px 18px', fontSize: 12, color: C.muted }}>{new Date(c.created_at).toLocaleDateString('fr-MA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab !== 'commissions' && (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 48, textAlign: 'center', color: C.muted }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🛠️</div>
          <div style={{ fontSize: 16, color: C.text, marginBottom: 8 }}>Module en construction</div>
          <div style={{ fontSize: 13 }}>Cette section sera disponible dans la prochaine version.</div>
        </div>
      )}
    </AdminLayout>
  )
}
