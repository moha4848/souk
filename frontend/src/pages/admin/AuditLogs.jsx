import { useState, useEffect, useRef } from 'react'
import { C, Spinner } from '../../components/UI'
import AdminLayout from '../../components/AdminLayout'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000/api', headers: { 'Content-Type': 'application/json' } })
api.interceptors.request.use(c => {
  const t = localStorage.getItem('souk_admin_token') || localStorage.getItem('souk_token')
  if (t) c.headers.Authorization = `Bearer ${t}`
  return c
})

const ACTION_CONFIG = {
  create:  { color: '#5cc8b0', icon: '✚', label: 'Création' },
  update:  { color: '#c9a84c', icon: '✎', label: 'Mise à jour' },
  delete:  { color: '#c94c4c', icon: '✕', label: 'Suppression' },
  approve: { color: '#5c8bc9', icon: '✔', label: 'Approbation' },
  reject:  { color: '#c97070', icon: '✖', label: 'Rejet' },
  login:   { color: '#c9b05c', icon: '⇥', label: 'Connexion' },
  view:    { color: '#6a6a8a', icon: '◉', label: 'Consultation' },
}

// Demo logs for display when API isn't ready
const DEMO_LOGS = [
  { id: 1, user: { name: 'SOUK CEO', email: 'admin@souk.ma' }, team: { name: 'System Team', type: 'system' }, action: 'approve', entity_type: 'Store', entity_id: 12, metadata: { store: 'Artisanat Fès' }, created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 2, user: { name: 'Fati Finance', email: 'finance@souk.ma' }, team: { name: 'Finance Team', type: 'finance' }, action: 'view', entity_type: 'Commission', entity_id: 45, metadata: { amount: '341 MAD' }, created_at: new Date(Date.now() - 18 * 60000).toISOString() },
  { id: 3, user: { name: 'Momo Moderator', email: 'moderator@souk.ma' }, team: { name: 'Moderation Team', type: 'moderation' }, action: 'reject', entity_type: 'Product', entity_id: 88, metadata: { reason: 'Image non conforme' }, created_at: new Date(Date.now() - 45 * 60000).toISOString() },
  { id: 4, user: { name: 'Sara Support', email: 'support@souk.ma' }, team: { name: 'Support Team', type: 'support' }, action: 'update', entity_type: 'Ticket', entity_id: 33, metadata: { status: 'resolved' }, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: 5, user: { name: 'SOUK CEO', email: 'admin@souk.ma' }, team: { name: 'System Team', type: 'system' }, action: 'create', entity_type: 'Team', entity_id: 6, metadata: { name: 'Marketing Team' }, created_at: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: 6, user: { name: 'Fati Finance', email: 'finance@souk.ma' }, team: { name: 'Finance Team', type: 'finance' }, action: 'approve', entity_type: 'Subscription', entity_id: 7, metadata: { plan: 'Excellence Premium', amount: '499 MAD' }, created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: 7, user: { name: 'SOUK CEO', email: 'admin@souk.ma' }, team: { name: 'System Team', type: 'system' }, action: 'update', entity_type: 'Permission', entity_id: 3, metadata: { role: 'Moderation Manager', perm: 'fraud.detect' }, created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
]

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000
  if (diff < 60) return 'À l\'instant'
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`
  return `Il y a ${Math.floor(diff / 86400)} jour(s)`
}

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [actionFilter, setActionFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const intervalRef = useRef(null)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const r = await api.get('/admin/activity-logs')
      setLogs(r.data || [])
    } catch {
      // API error, set empty logs
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    if (autoRefresh) {
      intervalRef.current = setInterval(fetchLogs, 30000)
    }
    return () => clearInterval(intervalRef.current)
  }, [autoRefresh])

  const filtered = logs.filter(log => {
    const matchAction = actionFilter === 'all' || log.action === actionFilter
    const matchSearch = !search
      || log.user?.name?.toLowerCase().includes(search.toLowerCase())
      || log.entity_type?.toLowerCase().includes(search.toLowerCase())
      || log.action?.toLowerCase().includes(search.toLowerCase())
    return matchAction && matchSearch
  })

  return (
    <AdminLayout>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontFamily: "'Playfair Display', serif", color: C.text }}>Journal d'Audit</h1>
          <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>Traçabilité complète de toutes les actions administratives</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setAutoRefresh(r => !r)} style={{
            padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 12,
            border: `1px solid ${autoRefresh ? '#5cc8b044' : C.border}`,
            background: autoRefresh ? '#5cc8b015' : 'transparent',
            color: autoRefresh ? '#5cc8b0' : C.muted,
          }}>
            {autoRefresh ? '⏸ Auto-refresh ON' : '▶ Auto-refresh OFF'}
          </button>
          <button onClick={fetchLogs} style={{
            padding: '8px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12,
            border: `1px solid ${C.border}`, background: 'transparent', color: C.muted,
          }}>
            ↻ Actualiser
          </button>
        </div>
      </div>

      {/* ── Quick Stats ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(ACTION_CONFIG).map(([action, conf]) => {
          const count = logs.filter(l => l.action === action).length
          if (!count && action !== 'create') return null
          return (
            <div key={action} style={{ padding: '10px 16px', borderRadius: 12, background: C.surface, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 14, color: conf.color }}>{conf.icon}</span>
              <span style={{ fontSize: 12, color: C.muted }}>{conf.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: conf.color }}>{count}</span>
            </div>
          )
        })}
      </div>

      {/* ── Filters Row ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Rechercher dans les logs..."
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: C.surface, color: C.text, fontSize: 13, outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
          onFocus={e => e.target.style.borderColor = C.gold}
          onBlur={e => e.target.style.borderColor = C.border}
        />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['all', 'Tous'], ...Object.entries(ACTION_CONFIG).map(([k, v]) => [k, v.label])].map(([key, label]) => (
            <button key={key} onClick={() => setActionFilter(key)} style={{
              padding: '8px 14px', borderRadius: 20, border: `1px solid ${actionFilter === key ? C.gold : C.border}`,
              background: actionFilter === key ? `${C.gold}15` : 'transparent',
              color: actionFilter === key ? C.gold : C.muted, cursor: 'pointer', fontSize: 12,
              fontWeight: actionFilter === key ? 600 : 400,
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ── Timeline Logs ───────────────────────────────────────────── */}
      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div style={{ position: 'absolute', left: 23, top: 0, bottom: 0, width: 1, background: C.border, zIndex: 0 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', color: C.muted, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
              <div>Aucun log correspondant à ce filtre</div>
            </div>
          )}
          {filtered.map((log, i) => {
            const conf = ACTION_CONFIG[log.action] || { color: C.muted, icon: '•', label: log.action }
            const isExpanded = expanded === log.id
            return (
              <div key={log.id} style={{ display: 'flex', gap: 16, position: 'relative', zIndex: 1 }}>
                {/* Dot */}
                <div style={{
                  width: 46, height: 46, borderRadius: '50%', flexShrink: 0,
                  background: `${conf.color}18`, border: `2px solid ${conf.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: conf.color, zIndex: 1,
                  boxShadow: `0 0 0 4px ${C.bg}`,
                }}>
                  {conf.icon}
                </div>

                {/* Card */}
                <div style={{
                  flex: 1, background: C.surface, border: `1px solid ${isExpanded ? conf.color + '44' : C.border}`,
                  borderRadius: 14, padding: '14px 18px', cursor: 'pointer',
                  transition: 'all .2s', marginBottom: 0,
                }}
                onClick={() => setExpanded(isExpanded ? null : log.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: conf.color }}>{conf.label}</span>
                        <span style={{ fontSize: 12, color: C.muted }}>·</span>
                        <span style={{ fontSize: 12, color: C.muted }}>{log.entity_type}</span>
                        {log.entity_id && <span style={{ fontSize: 11, color: C.border, background: `${C.border}22`, padding: '2px 6px', borderRadius: 6 }}>#{log.entity_id}</span>}
                      </div>
                      <div style={{ fontSize: 13, color: C.text }}>
                        <span style={{ fontWeight: 600 }}>{log.user?.name || 'Système'}</span>
                        <span style={{ color: C.muted }}> · {log.team?.name || 'Plateforme'}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 11, color: C.muted }}>{timeAgo(log.created_at)}</div>
                    </div>
                  </div>

                  {/* Expanded metadata */}
                  {isExpanded && log.metadata && (
                    <div style={{ marginTop: 14, padding: '12px 14px', background: '#0a0a10', borderRadius: 10, border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>Métadonnées</div>
                      {Object.entries(log.metadata).map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', gap: 8, fontSize: 12, marginBottom: 4 }}>
                          <span style={{ color: C.muted, minWidth: 80 }}>{k}</span>
                          <span style={{ color: C.text, fontWeight: 600 }}>{String(v)}</span>
                        </div>
                      ))}
                      <div style={{ display: 'flex', gap: 8, fontSize: 12, marginTop: 8, borderTop: `1px solid ${C.border}`, paddingTop: 8 }}>
                        <span style={{ color: C.muted, minWidth: 80 }}>email</span>
                        <span style={{ color: C.tealL }}>{log.user?.email || '—'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </AdminLayout>
  )
}
