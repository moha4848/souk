import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { C, GoldBtn, FieldInput, ZelligeBg, Ornament } from '../../components/UI'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email:'', password:'' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:'100vh',
      background:`radial-gradient(ellipse at 30% 0%,rgba(255,215,0,0.05) 0%,${C.bg} 60%)`,
      display:'flex', justifyContent:'center', alignItems:'center', padding:'20px',
    }}>
      <div style={{
        width:'100%', maxWidth:480, background:C.bg, borderRadius:48,
        border:`1px solid ${C.border}`, overflow:'hidden',
        boxShadow:'0 40px 100px rgba(0,0,0,0.8)',
      }}>
        <div style={{ position:'relative', padding:'60px 40px' }}>
          <ZelligeBg opacity={0.12} />

          {/* Logo */}
          <div style={{ textAlign:'center', marginBottom:40, position:'relative', zIndex:1 }}>
             <img src="/logo.png" alt="SOUK" style={{ height: 100, width: 'auto', marginBottom: 20 }} />
          </div>

          <Ornament />

          {/* Form */}
          <form onSubmit={submit} style={{ position:'relative', zIndex:1, marginTop:32 }}>
            <FieldInput label="Email de l'Artisan" type="email" value={form.email}
              onChange={set('email')} placeholder="monnom@souk.ma" />
            <FieldInput label="Mot de passe" type="password" value={form.password}
              onChange={set('password')} placeholder="••••••••" />

            {error && (
              <div style={{ background:`${C.danger}15`, border:`1px solid ${C.danger}30`,
                borderRadius:15, padding:'12px 18px', fontSize:13, color:C.danger, marginBottom:20, fontWeight:500 }}>
                {error}
              </div>
            )}

            <GoldBtn type="submit" disabled={loading} style={{ width:'100%', borderRadius:100 }}>
              {loading ? 'Connexion en cours…' : 'SE CONNECTER'}
            </GoldBtn>

            <div style={{ textAlign:'center', marginTop:25, fontSize:13, color:C.muted }}>
              Pas encore de boutique ?{' '}
              <Link to="/register" style={{ color:C.emerald, textDecoration:'none', fontWeight:700 }}>Ouvrir une boutique</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
