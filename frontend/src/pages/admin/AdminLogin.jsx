import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { C, FieldInput, GoldBtn } from '../../components/UI'

const KF = `
@keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(201,168,76,0.1); } 50% { box-shadow: 0 0 40px rgba(201,168,76,0.3); } }
@keyframes dropIn { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
`

export default function AdminLogin() {
  const navigate = useNavigate()
  const { loginAdmin } = useAdminAuth()
  
  const [form, setForm] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      await loginAdmin(form.email, form.password)
      navigate('/admin/dashboard')
    } catch (e) {
      setErr('Accès refusé. Réservé au SuperAdmin SOUK.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: C.bg,
      color: C.text,
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden'
    }}>
      <style>{KF}</style>

      {/* ── Left Side: Artistic Branding ── */}
      <div className="hide-mobile" style={{
        flex: 1.2,
        background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRight: `1px solid ${C.gold}20`,
        overflow: 'hidden'
      }}>
        <div style={{ position:'absolute', top:'-10%', left:'-10%', width:500, height:500, background:C.gold, filter:'blur(200px)', opacity:0.05 }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 60, animation: 'fadeUp 1s ease-out' }}>
          <div style={{ width: 80, height: 80, margin: '0 auto 30px', borderRadius: 24, background: `linear-gradient(135deg, ${C.gold}, ${C.copper})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, boxShadow: `0 20px 40px ${C.gold}30` }}>
            👑
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 900, margin: '0 0 20px', letterSpacing: '-2px', fontFamily:"'Playfair Display', serif", color:'#fff', lineHeight: 1.1 }}>
            Contrôle <br/> <span style={{ color: C.gold }}>Suprême</span>.
          </h1>
          <p style={{ color: C.muted, fontSize: 18, maxWidth: 400, margin: '0 auto', lineHeight: 1.8, fontWeight: 300 }}>
            Interface de gestion centralisée pour l'écosystème SOUK ✦. Accès réservé au personnel autorisé.
          </p>
        </div>
      </div>

      {/* ── Right Side: Form ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 40px' }}>
        <div style={{ width: '100%', maxWidth: 400, animation: 'fadeUp 0.8s ease-out' }}>
          <div style={{ marginBottom: 45 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:15 }}>
               <div style={{ width:24, height:1, background:C.gold }} />
               <span style={{ fontSize:11, fontWeight:900, color:C.gold, letterSpacing:2, textTransform:'uppercase' }}>Administration</span>
            </div>
            <h2 style={{ fontSize: 32, margin: '0 0 10px', fontWeight: 900, color:'#fff' }}>Accès SuperAdmin</h2>
            <p style={{ color: C.muted, margin: 0, fontSize: 15, fontWeight: 300 }}>Authentification de sécurité requise.</p>
          </div>

          {err && (
            <div style={{ background: 'rgba(201,76,76,0.1)', border: `1px solid ${C.danger}30`, color: C.danger, padding: '16px', borderRadius: 16, fontSize: 13, marginBottom: 25, fontWeight: 600 }}>
              {err}
            </div>
          )}

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column' }}>
            <FieldInput label="Identifiant SuperAdmin" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="admin@souk.ma" />
            <FieldInput label="Mot de passe" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
            
            <button type="submit" disabled={loading} style={{ 
              marginTop: 20, padding: '20px', background: `linear-gradient(135deg, ${C.gold}, ${C.copper})`, 
              border: 'none', borderRadius: 20, color: C.bg, fontSize: 15, fontWeight: 900, 
              cursor: loading ? 'wait' : 'pointer', transition: 'all 0.3s', 
              boxShadow: `0 15px 30px ${C.gold}30` 
            }}>
              {loading ? 'DÉCRYPTAGE...' : 'ENTRER DANS LE SYSTÈME'}
            </button>
          </form>
          
          <div style={{ marginTop: 40, textAlign: 'center', fontSize: 12, color: C.muted, letterSpacing:0.5 }}>
             MODULE SÉCURISÉ · TOUTES LES ACTIONS SONT ENREGISTRÉES
          </div>
        </div>
      </div>
    </div>
  )
}
