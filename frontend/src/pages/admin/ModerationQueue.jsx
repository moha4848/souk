import { useState, useEffect } from 'react'
import { C, Spinner } from '../../components/UI'
import AdminLayout from '../../components/AdminLayout'
import { Shield, Archive, Shirt, Monitor, Settings, Search, CheckCircle, Check, X, Store } from 'lucide-react'
import { getPendingUsers, approveUser, rejectUser } from '../../api/services'

// ─── Status colors map ────────────────────────────────────────────────
const STATUS = {
  pending:  { label: 'En attente', color: '#c9a84c', bg: '#c9a84c18' },
  approved: { label: 'Approuvé',   color: '#5cc8b0', bg: '#5cc8b018' },
  rejected: { label: 'Rejeté',     color: '#c94c4c', bg: '#c94c4c18' },
}

function Badge({ status }) {
  const s = STATUS[status] || { label: status, color: C.muted, bg: '#ffffff08' }
  return (
    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      color: s.color, background: s.bg, border: `1px solid ${s.color}33` }}>
      {s.label}
    </span>
  )
}

export default function ModerationQueue() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState(null)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const r = await getPendingUsers()
      // Simulate richer data
      const enriched = (r.data || []).map(u => ({
        ...u,
        status: u.status || 'pending',
        project_type: u.project_type || 'artisan',
        created_at: u.created_at || new Date().toISOString()
      }))
      setPending(enriched)
    } catch {
      setPending([])
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAction = async (fn, id, label) => {
    setProcessingId(id)
    try {
      await fn(id)
      showToast(`Action terminée avec succès`)
      fetchData()
    } catch {
      showToast('Erreur lors de l\'action', 'error')
    } finally {
      setProcessingId(null)
    }
  }

  const filtered = pending.filter(u => {
    const matchStatus = filter === 'all' || u.status === filter
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const counts = {
    all:      pending.length,
    pending:  pending.filter(u => u.status === 'pending').length,
    approved: pending.filter(u => u.status === 'approved').length,
    rejected: pending.filter(u => u.status === 'rejected').length,
  }

  const TYPE_ICON = { artisan: <Archive size={16} />, vetements: <Shirt size={16} />, electronique: <Monitor size={16} />, services: <Settings size={16} /> }

  return (
    <AdminLayout>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 999,
          padding: '14px 20px', borderRadius: 12,
          background: toast.type === 'success' ? '#5cc8b022' : '#c94c4c22',
          border: `1px solid ${toast.type === 'success' ? '#5cc8b0' : '#c94c4c'}44`,
          color: toast.type === 'success' ? '#5cc8b0' : '#c94c4c',
          fontSize: 13, fontWeight: 600, backdropFilter: 'blur(10px)',
          animation: 'fadeIn .3s',
        }}>{toast.msg}</div>
      )}

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(201,168,76,0.12)', border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontFamily: "'Playfair Display', serif", color: C.text }}>File de Modération</h1>
            <p style={{ margin: 0, fontSize: 13, color: C.muted }}>Validation des boutiques et comptes vendeurs</p>
          </div>
        </div>

        {/* Stat Pills */}
        <div style={{ display: 'flex', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
          {[['all','Tous','#a0a0a0'], ['pending','En attente','#c9a84c'], ['approved','Approuvés','#5cc8b0'], ['rejected','Rejetés','#c94c4c']].map(([key, label, color]) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: '8px 18px', borderRadius: 30, border: `1px solid ${filter === key ? color : C.border}`,
              background: filter === key ? `${color}18` : 'transparent',
              color: filter === key ? color : C.muted, cursor: 'pointer', fontSize: 13,
              fontWeight: filter === key ? 600 : 400, transition: 'all .2s',
            }}>
              {label} <span style={{ opacity: 0.6 }}>({counts[key]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Search ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: C.muted }}>
            <Search size={18} />
          </div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            style={{
              width: '100%', padding: '12px 16px 12px 48px', borderRadius: 12, boxSizing: 'border-box',
              background: C.surface, border: `1px solid ${C.border}`, color: C.text,
              fontSize: 14, outline: 'none', fontFamily: "'DM Sans', sans-serif"
            }}
          onFocus={e => e.target.style.borderColor = C.gold}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────── */}
      {loading ? <Spinner /> : (
        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.015)', borderBottom: `1px solid ${C.border}` }}>
                {['Boutique / Vendeur', 'Type', 'Email', 'Date', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 48, textAlign: 'center', color: C.muted }}>
                  <div style={{ color: C.gold, opacity: 0.3, marginBottom: 12, display: 'flex', justifyContent: 'center' }}><CheckCircle size={48} /></div>
                  <div>Aucun élément dans cette file</div>
                </td></tr>
              )}
              {filtered.map((user, i) => (
                <tr key={user.id} style={{
                  borderBottom: i < filtered.length - 1 ? `1px solid ${C.border}` : 'none',
                  transition: 'background .15s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.025)'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${C.gold}33, ${C.copper}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.gold }}>
                        {TYPE_ICON[user.project_type] || <Store size={18} />}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{user.vendor?.shop_name || user.shop_name || user.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>@{user.store_slug || 'no-slug'}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 18px', fontSize: 12, color: C.muted, textTransform: 'capitalize' }}>
                    {user.project_type || 'Général'}
                  </td>
                  <td style={{ padding: '16px 18px', fontSize: 13, color: C.muted }}>{user.email}</td>
                  <td style={{ padding: '16px 18px', fontSize: 12, color: C.muted }}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-MA') : '—'}
                  </td>
                  <td style={{ padding: '16px 18px' }}><Badge status={user.status} /></td>
                  <td style={{ padding: '16px 18px' }}>
                    {user.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          disabled={processingId === user.id}
                          onClick={() => handleAction(approveUser, user.id, 'Boutique approuvée')}
                          style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #5cc8b044', background: '#5cc8b014', color: '#5cc8b0', fontSize: 12, cursor: 'pointer', fontWeight: 600, transition: 'all .2s' }}
                          onMouseOver={e => e.currentTarget.style.background = '#5cc8b025'}
                          onMouseOut={e => e.currentTarget.style.background = '#5cc8b014'}
                        >
                          {processingId === user.id ? '...' : <><Check size={14} /> Approuver</>}
                        </button>
                        <button
                          disabled={processingId === user.id}
                          onClick={() => handleAction(rejectUser, user.id, 'Boutique rejetée')}
                          style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #c94c4c44', background: '#c94c4c14', color: '#c94c4c', fontSize: 12, cursor: 'pointer', fontWeight: 600, transition: 'all .2s' }}
                          onMouseOver={e => e.currentTarget.style.background = '#c94c4c25'}
                          onMouseOut={e => e.currentTarget.style.background = '#c94c4c14'}
                        >
                          <X size={14} /> Rejeter
                        </button>
                      </div>
                    )}
                    {user.status !== 'pending' && <span style={{ fontSize: 12, color: C.muted }}>Traité</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  )
}
