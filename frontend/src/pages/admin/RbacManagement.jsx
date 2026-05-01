import { useState, useEffect } from 'react'
import { C, Spinner } from '../../components/UI'
import AdminLayout from '../../components/AdminLayout'
import { me as apiMe } from '../../api/services'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000/api', headers: { 'Content-Type': 'application/json' } })
api.interceptors.request.use(c => {
  const t = localStorage.getItem('souk_admin_token') || localStorage.getItem('souk_token')
  if (t) c.headers.Authorization = `Bearer ${t}`
  return c
})

const TEAM_ICONS = {
  marketplace: '🛒', finance: '💰', support: '💬',
  marketing: '📢', moderation: '🛡️', system: '⚙️'
}
const TEAM_COLORS = {
  marketplace: '#c9a84c', finance: '#5cc8b0', support: '#7ab0c9',
  marketing: '#c987c9', moderation: '#c97070', system: '#7070c9'
}

// Permission name => user-friendly label
const PERM_LABELS = {
  'products.moderate': 'Modérer les Produits',
  'categories.manage': 'Gérer les Catégories',
  'search.ranking': 'Gérer le Classement',
  'payments.view': 'Voir les Paiements',
  'commissions.manage': 'Gérer les Commissions',
  'subscriptions.manage': 'Gérer les Abonnements',
  'tickets.manage': 'Gérer les Tickets',
  'chats.access': 'Accéder aux Chats',
  'disputes.resolve': 'Résoudre les Disputes',
  'banners.manage': 'Gérer les Bannières',
  'promotions.manage': 'Gérer les Promotions',
  'campaigns.view': 'Voir les Campagnes',
  'stores.approve': 'Approuver les Boutiques',
  'fraud.detect': 'Détecter la Fraude',
  'logs.view': 'Voir les Logs',
  'ai.config': 'Configurer l\'IA',
  'settings.global': 'Paramètres Globaux',
}

export default function RbacManagement() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [inviteModal, setInviteModal] = useState(false)
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', password: '', role_id: '' })
  const [inviting, setInviting] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => { fetchTeams() }, [])

  const fetchTeams = async () => {
    setLoading(true)
    try {
      const r = await api.get('/admin/teams-overview')
      setTeams(r.data || [])
      if (r.data?.length) setSelectedTeam(r.data[0])
    } catch {
      // API error, set empty teams
      setTeams([])
      setSelectedTeam(null)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    setInviting(true)
    try {
      await api.post('/admin/team/invite', inviteForm)
      showToast('✅ Membre invité avec succès')
      setInviteModal(false)
      setInviteForm({ name: '', email: '', password: '', role_id: '' })
    } catch (err) {
      showToast(err.response?.data?.message || '❌ Erreur lors de l\'invitation', 'error')
    } finally {
      setInviting(false)
    }
  }

  if (loading) return <AdminLayout><Spinner /></AdminLayout>

  return (
    <AdminLayout>
      {toast && (
        <div style={{
          position: 'fixed', top: 80, right: 24, zIndex: 999,
          padding: '14px 20px', borderRadius: 12,
          background: toast.type === 'success' ? '#5cc8b022' : '#c94c4c22',
          border: `1px solid ${toast.type === 'success' ? '#5cc8b0' : '#c94c4c'}44`,
          color: toast.type === 'success' ? '#5cc8b0' : '#c94c4c',
          fontSize: 13, fontWeight: 600,
        }}>{toast.msg}</div>
      )}

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: '0 0 6px', fontSize: 26, fontFamily: "'Playfair Display', serif", color: C.text }}>
            Gestion Équipes & Accès
          </h1>
          <p style={{ margin: 0, color: C.muted, fontSize: 13 }}>{teams.length} équipes · RBAC Service-Based Isolation</p>
        </div>
        <button onClick={() => setInviteModal(true)} style={{
          padding: '12px 22px', borderRadius: 12,
          background: `linear-gradient(135deg, ${C.gold}, ${C.copper})`, border: 'none',
          color: C.bg, fontSize: 13, fontWeight: 700, cursor: 'pointer',
          boxShadow: `0 4px 20px ${C.gold}33`,
        }}>
          + Inviter un membre
        </button>
      </div>

      {/* ── Layout: Team List + Detail ─────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20 }}>
        {/* Team List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {teams.map(team => {
            const active = selectedTeam?.id === team.id
            const color = TEAM_COLORS[team.type] || C.gold
            return (
              <button key={team.id} onClick={() => setSelectedTeam(team)} style={{
                padding: '14px 16px', borderRadius: 14, border: `1px solid ${active ? color : C.border}`,
                background: active ? `${color}12` : C.surface,
                cursor: 'pointer', textAlign: 'left', transition: 'all .2s',
                borderLeft: `4px solid ${active ? color : 'transparent'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{TEAM_ICONS[team.type] || '👥'}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: active ? color : C.text }}>{team.name}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>{team.members_count || team.members?.length || 0} membre(s)</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Team Detail */}
        {selectedTeam && (() => {
          const color = TEAM_COLORS[selectedTeam.type] || C.gold
          return (
            <div>
              {/* Team Header */}
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 24, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
                    {TEAM_ICONS[selectedTeam.type]}
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: C.text, fontFamily: "'Playfair Display', serif" }}>{selectedTeam.name}</div>
                    <div style={{ fontSize: 13, color: C.muted }}>{selectedTeam.description}</div>
                  </div>
                </div>
              </div>

              {/* Roles & Permissions */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, fontWeight: 600 }}>Rôles & Permissions</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(selectedTeam.roles || []).map(role => (
                    <div key={role.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>🎭 {role.name}</div>
                        <span style={{ fontSize: 11, color: color, background: `${color}15`, border: `1px solid ${color}33`, padding: '3px 10px', borderRadius: 20 }}>
                          {role.permissions?.length || 0} permissions
                        </span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {(role.permissions || []).map(p => (
                          <span key={p.name} style={{
                            fontSize: 11, padding: '5px 12px', borderRadius: 20,
                            background: `${color}10`, border: `1px solid ${color}22`,
                            color: color, fontWeight: 500
                          }}>
                            ✓ {PERM_LABELS[p.name] || p.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Members */}
              <div>
                <div style={{ fontSize: 13, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 12, fontWeight: 600 }}>
                  Membres actifs ({selectedTeam.members?.length || 0})
                </div>
                <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' }}>
                  {(!selectedTeam.members || selectedTeam.members.length === 0) ? (
                    <div style={{ padding: 32, textAlign: 'center', color: C.muted }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>👋</div>
                      <div>Aucun membre assigné à cette équipe</div>
                      <button onClick={() => setInviteModal(true)} style={{ marginTop: 12, color: C.gold, background: 'none', border: `1px solid ${C.gold}44`, padding: '8px 16px', borderRadius: 20, cursor: 'pointer', fontSize: 12 }}>
                        + Inviter un membre
                      </button>
                    </div>
                  ) : selectedTeam.members.map((m, i) => (
                    <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: i < selectedTeam.members.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${color}44, ${color}22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color }}>
                          {m.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: C.muted }}>{m.email}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, color: '#5cc8b0', background: '#5cc8b015', padding: '4px 10px', borderRadius: 20, border: '1px solid #5cc8b033' }}>
                        ● Actif
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* ── Invite Modal ────────────────────────────────────────────── */}
      {inviteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, width: 420, maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 20, color: C.text }}>Inviter un membre</h2>
              <button onClick={() => setInviteModal(false)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleInvite}>
              {[
                { key: 'name', label: 'Nom complet', placeholder: 'Ahmed Alami' },
                { key: 'email', label: 'Email professionnel', placeholder: 'ahmed@souk.ma', type: 'email' },
                { key: 'password', label: 'Mot de passe temporaire', placeholder: '••••••••', type: 'password' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>{field.label}</div>
                  <input
                    type={field.type || 'text'}
                    value={inviteForm[field.key]}
                    onChange={e => setInviteForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '12px 14px',
                      borderRadius: 10, border: `1px solid ${C.border}`,
                      background: '#0a0a10', color: C.text, fontSize: 14, outline: 'none',
                    }}
                    onFocus={e => e.target.style.borderColor = C.gold}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
              ))}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Rôle (ID)</div>
                <select
                  value={inviteForm.role_id}
                  onChange={e => setInviteForm(f => ({ ...f, role_id: e.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `1px solid ${C.border}`, background: '#0a0a10', color: C.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                >
                  <option value="">Sélectionner un rôle</option>
                  {teams.flatMap(t => t.roles || []).map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={inviting} style={{
                width: '100%', padding: '13px', borderRadius: 12, border: 'none',
                background: `linear-gradient(135deg, ${C.gold}, ${C.copper})`,
                color: C.bg, fontWeight: 700, fontSize: 14, cursor: 'pointer',
                marginTop: 8, opacity: inviting ? 0.7 : 1,
              }}>
                {inviting ? 'Invitation...' : '✉️  Envoyer l\'invitation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
