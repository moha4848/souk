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
    <div style={{ minHeight: '100vh', background: '#020203', color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{KF}</style>
      
      {/* Absolute Admin Emblem Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(201,168,76,0.02) 0%, transparent 60%)', borderRadius: '50%' }} />
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 480, padding: 'clamp(28px, 4vw, 40px)', background: 'rgba(8,8,12,0.9)', backdropFilter: 'blur(20px)', border: `1px solid ${C.gold}40`, borderRadius: 24, animation: 'dropIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: `0 20px 60px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)` }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ width: 60, height: 60, margin: '0 auto 20px', borderRadius: 16, background: `linear-gradient(135deg, ${C.gold}, ${C.copper})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, boxShadow: `0 10px 20px ${C.gold}40`, fontWeight: 'bold', color: C.bg, animation: 'glow 3s infinite ease-in-out' }}>
            👑
          </div>
          <h1 style={{ margin: 0, fontFamily: "'Playfair Display', serif", fontSize: 28, color: '#fff' }}>SOUK SuperAdmin</h1>
          <p style={{ margin: '8px 0 0', color: C.muted, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' }}>Portail de gestion centralisé</p>
        </div>

        {err && (
          <div style={{ background: 'rgba(201,76,76,0.1)', border: `1px solid ${C.danger}50`, color: C.danger, padding: '12px', borderRadius: 12, fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
            {err}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <FieldInput label="Identifiant SuperAdmin" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="admin@souk.ma" />
          <FieldInput label="Mot de passe" type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
          
          <button type="submit" disabled={loading} style={{ marginTop: 10, padding: '16px', background: `linear-gradient(135deg, ${C.gold}, ${C.copper})`, border: 'none', borderRadius: 14, color: C.bg, fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer', transition: 'all 0.2s', boxShadow: loading ? 'none' : `0 8px 24px ${C.gold}40` }}>
            {loading ? 'Authentification...' : 'Accéder au contrôle absolu'}
          </button>
        </form>
        
        <div style={{ marginTop: 30, textAlign: 'center', fontSize: 12, color: C.muted }}>
          Module hautement sécurisé. Connexion tracée.
        </div>
      </div>
    </div>
  )
}
