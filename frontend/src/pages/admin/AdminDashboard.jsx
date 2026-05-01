import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { 
  getAdminStats, getPendingUsers, approveUser, rejectUser, 
  getPendingSubscriptions, approveSubscription, rejectSubscription, 
  getCommissions 
} from '../../api/services'
import { C, Spinner } from '../../components/UI'
import AdminLayout from '../../components/AdminLayout'

export default function AdminDashboard() {
  const { admin, logoutAdmin } = useAdminAuth()
  const navigate = useNavigate()

  const [stats, setStats] = useState(null)
  const [pendingUsers, setPendingUsers] = useState([])
  const [pendingSubs, setPendingSubs] = useState([])
  const [commissions, setCommissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    refreshData()
  }, [])

  const refreshData = async () => {
    try {
      const [s, u, sub, com] = await Promise.all([
        getAdminStats(),
        getPendingUsers(),
        getPendingSubscriptions(),
        getCommissions()
      ])
      setStats(s.data)
      setPendingUsers(u.data)
      setPendingSubs(sub.data)
      setCommissions(com.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (fn, id) => {
    try {
      await fn(id)
      refreshData()
    } catch (err) {
      alert("Erreur lors de l'action")
    }
  }


  const [sellers] = useState([
    { id: 1, name: 'Artisanat Fès', plan: 'pro', sales: 12400 },
    { id: 2, name: 'Zellige Master', plan: 'gratuit', sales: 4500 },
    { id: 3, name: 'Argan Bio', plan: 'premium', sales: 32000 },
    { id: 4, name: 'Caftan Luxe', plan: 'pro', sales: 18900 },
    { id: 5, name: 'Deco Marrakech', plan: 'gratuit', sales: 2100 },
  ])

  if (loading) return <AdminLayout><div style={{padding:80, textAlign:'center'}}><Spinner /></div></AdminLayout>

  // ── Team Based Content Switcher ──
  const renderRolePanel = () => {
    if (admin?.is_super_admin || admin?.role === 'superadmin') {
        return <SuperAdminPanel stats={stats} pendingUsers={pendingUsers} pendingSubs={pendingSubs} commissions={commissions} handleAction={handleAction} />
    }
    const primaryMembership = admin?.memberships?.[0]
    const teamType = primaryMembership?.team?.type
    switch (teamType) {
      case 'finance':    return <FinancePanel commissions={commissions} stats={stats} pendingSubs={pendingSubs} handleAction={handleAction} />
      case 'moderation':
      case 'marketplace': return <ModerationPanel pendingUsers={pendingUsers} handleAction={handleAction} />
      case 'support':   return <SupportPanel stats={stats} />
      case 'system':    return <SuperAdminPanel stats={stats} pendingUsers={pendingUsers} pendingSubs={pendingSubs} commissions={commissions} handleAction={handleAction} />
      default: return (
        <div style={{padding:60, textAlign:'center', background:C.surface, borderRadius:20, border:`1px solid ${C.border}`}}>
          <div style={{fontSize:40, marginBottom:20}}>🔒</div>
          <h2 style={{margin:0}}>Accès Restreint</h2>
          <p style={{color:C.muted}}>Votre compte n'est assigné à aucune équipe active.</p>
          <div style={{fontSize:12, marginTop:20, color:C.gold}}>{admin?.email} | {admin?.role}</div>
        </div>
      )
    }
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: 1100 }}>
        {renderRolePanel()}
      </div>
    </AdminLayout>
  )
}

// ── Role Specific Panels ──

const SuperAdminPanel = ({ stats, pendingUsers, pendingSubs, commissions, handleAction }) => (
    <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
          <StatCard title="Total Utilisateurs" val={stats?.total_users} icon="👥" color={C.teal} />
          <StatCard title="Vendeurs en attente" val={stats?.pending_users} icon="⏳" color={C.gold} />
          <StatCard title="Forfaits en attente" val={stats?.pending_subscriptions} icon="🛡️" color={C.copper} />
          <StatCard title="Total Commissions" val={`${stats?.total_commissions} MAD`} icon="💰" color={C.gold} />
        </div>

        <SectionTitle title="Validation de Comptes" />
        <Table data={pendingUsers} columns={['Vendeur', 'Email', 'Date']} actions={(u) => (
            <div style={{display:'flex', gap:8}}>
                <ActionBtn color={C.teal} onClick={() => handleAction(approveUser, u.id)}>Approuver</ActionBtn>
                <ActionBtn color={C.danger} onClick={() => handleAction(rejectUser, u.id)}>Rejeter</ActionBtn>
            </div>
        )} />

        <SectionTitle title="Validation de Forfaits" />
        <Table data={pendingSubs} columns={['Boutique', 'Forfait', 'Prix']} actions={(s) => (
            <div style={{display:'flex', gap:8}}>
                <ActionBtn color={C.teal} onClick={() => handleAction(approveSubscription, s.id)}>Activer</ActionBtn>
                <ActionBtn color={C.danger} onClick={() => handleAction(rejectSubscription, s.id)}>Rejeter</ActionBtn>
            </div>
        )} />
    </>
)

const FinancePanel = ({ commissions, stats, pendingSubs, handleAction }) => (
    <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
            <StatCard title="Revenus SOUK" val={`${stats?.total_commissions} MAD`} icon="💎" color={C.gold} />
            <StatCard title="Volume d'affaires" val="1.2M MAD" icon="📈" color={C.teal} />
        </div>

        <SectionTitle title="Validation de Forfaits (Paiements reçus)" />
        <Table data={pendingSubs} columns={['Boutique', 'Forfait', 'Prix']} actions={(s) => (
            <div style={{display:'flex', gap:8}}>
                <ActionBtn color={C.teal} onClick={() => handleAction(approveSubscription, s.id)}>Activer</ActionBtn>
                <ActionBtn color={C.danger} onClick={() => handleAction(rejectSubscription, s.id)}>Rejeter</ActionBtn>
            </div>
        )} />

        <SectionTitle title="Journal des Commissions" />
        <Table data={commissions} columns={['Commande', 'Vendeur', 'Commission', 'Date']} />
    </>
)

const ModerationPanel = ({ pendingUsers, handleAction }) => (
    <>
        <SectionTitle title="Files de Modération Boutiques" />
        <Table data={pendingUsers} columns={['Boutique', 'Email', 'Date']} actions={(u) => (
            <div style={{display:'flex', gap:8}}>
                <ActionBtn color={C.teal} onClick={() => handleAction(approveUser, u.id)}>Vérifier & Activer</ActionBtn>
                <ActionBtn color={C.danger} onClick={() => handleAction(rejectUser, u.id)}>Signaler</ActionBtn>
            </div>
        )} />
    </>
)

const SupportPanel = ({ stats }) => (
    <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 40 }}>
            <StatCard title="Boutiques Actives" val={stats?.total_users} icon="🏢" color={C.teal} />
            <StatCard title="Tickets Ouverts" val="12" icon="🎟️" color={C.gold} />
            <StatCard title="Support Vendeurs" val="OK" icon="💬" color={C.copper} />
        </div>
        <SectionTitle title="Système de Support & Assistance" />
        <div style={{background:C.surface, border:`1px solid ${C.border}`, padding:40, borderRadius:16, textAlign:'center', color:C.muted}}>
            Le module de chat en direct et de gestion des tickets est en cours de déploiement.
        </div>
    </>
)

// ── UI Helpers ──
const Table = ({ data, columns, actions }) => (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', marginBottom: 40 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${C.border}` }}>
            {columns.map(c => <th key={c} style={THStyle}>{c}</th>)}
            {actions && <th style={THStyle}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && <tr><td colSpan={columns.length + (actions ? 1 : 0)} style={{padding:40, textAlign:'center', color:C.muted}}>Aucune donnée disponible</td></tr>}
          {data.map((item, idx) => (
            <tr key={idx} style={{ borderBottom: `1px solid ${C.border}` }}>
              {columns.map(col => {
                  let val = ''
                  if (col === 'Vendeur' || col === 'Boutique' || col === 'Commande') {
                    val = item.vendor?.shop_name || item.user?.vendor?.shop_name || item.name || (item.order_id ? `#${item.order_id}` : 'N/A')
                  }
                  else if (col === 'Email') val = item.email || item.vendor?.email
                  else if (col === 'Date') val = new Date(item.created_at).toLocaleDateString()
                  else if (col === 'Forfait') val = item.package?.name
                  else if (col === 'Prix') val = `${item.package?.price} MAD`
                  else if (col === 'Commission') val = `${item.amount} MAD`
                  return <td key={col} style={TDStyle}>{val}</td>
              })}
              {actions && <td style={TDStyle}>{actions(item)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
)

// ── Shared UI Components ──
const StatCard = ({ title, val, icon, color }) => (
  <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: '24px', position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', right: -10, top: -10, fontSize: 60, opacity: 0.05 }}>{icon}</div>
    <div style={{ color: C.muted, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{title}</div>
    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color }}>{val ?? '...'}</div>
  </div>
)

const SectionTitle = ({ title }) => <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, marginBottom: 20, marginTop: 40 }}>{title}</h2>

const THStyle = { padding: '16px 24px', color: C.muted, fontWeight: 500, fontSize: 13 }
const TDStyle = { padding: '16px 24px', fontSize: 14 }

const ActionBtn = ({ children, color, onClick }) => (
  <button onClick={onClick} style={{ 
    padding: '6px 14px', borderRadius: 8, border: `1px solid ${color}44`, 
    background: `${color}11`, color: color, fontSize: 12, cursor: 'pointer',
    transition: 'all 0.2s', fontWeight: 600
  }} onMouseOver={e => e.currentTarget.style.background = `${color}22`}>
    {children}
  </button>
)

