import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { C, GoldBtn, FieldInput, ZelligeBg, Ornament, FieldSelect } from '../../components/UI'

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
      minHeight: '100vh',
      display: 'flex',
      background: C.bg,
      color: C.text,
      fontFamily: "'Outfit', sans-serif",
      overflow: 'hidden'
    }}>
      <style>{KF}</style>

      {/* ── Left Side: Artistic Branding (Desktop Only) ── */}
      <div className="hide-mobile" style={{
        flex: 1.2,
        background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRight: `1px solid ${C.border}`,
        overflow: 'hidden'
      }}>
        <ZelligeBg opacity={0.15} />
        
        {/* Glow Effects */}
        <div style={{ position:'absolute', top:'-10%', left:'-10%', width:500, height:500, background:C.emerald, filter:'blur(200px)', opacity:0.1 }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:400, height:400, background:C.gold, filter:'blur(150px)', opacity:0.05 }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 60, animation: 'fadeUp 1s ease-out' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:40 }}>
             <img src="/logo.png" alt="SOUK" style={{ height: 130, width: 'auto', filter: 'drop-shadow(0 0 50px rgba(16,185,129,0.4))' }} />
          </div>
          
          <h1 style={{ 
            fontSize: 62, fontWeight: 900, margin: '0 0 25px', letterSpacing: '-3px', 
            fontFamily:"'Playfair Display', serif", color:'#fff', lineHeight: 1
          }}>
            Propulsez votre <br/> <span style={{ color: C.emerald }}>Génie Digital</span>.
          </h1>
          
          <div style={{ width:100, height:2, background:C.gold, margin:'0 auto 35px' }} />
          
          <p style={{ color: C.muted, fontSize: 18, maxWidth: 480, margin: '0 auto', lineHeight: 1.8, fontWeight: 300 }}>
            Rejoignez l'élite des artisans marocains. Transformez votre savoir-faire en une marque de renommée mondiale.
          </p>

          <div style={{ marginTop:60, display:'flex', gap:25, justifyContent:'center' }}>
             {[1,2,3,4].map(i => (
               <div key={i} style={{ 
                 width:80, height:110, borderRadius:24, background:C.surface2, 
                 border:`1px solid ${C.border}`, overflow:'hidden', 
                 transform: `translateY(${i*12}px)`, opacity: 1 - (i*0.1),
                 boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                 display:'flex', alignItems:'center', justifyContent:'center', color:C.emerald
               }}>
                  <div style={{ width:30, height:30, background:C.emerald, borderRadius:8, filter:'blur(15px)', opacity:0.3 }} />
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* ── Right Side: Form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        position: 'relative',
        background: `radial-gradient(circle at 70% 30%, ${C.emerald}05 0%, transparent 50%)`
      }}>
        <div style={{ width: '100%', maxWidth: 440, animation: 'fadeUp 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }}>
          {/* Logo only on mobile */}
          <div className="show-mobile" style={{ textAlign: 'center', marginBottom: 50 }}>
             <img src="/logo.png" alt="SOUK" style={{ height: 80, width: 'auto' }} />
          </div>

          <div style={{ marginBottom: 50 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:15 }}>
               <div style={{ width:24, height:1, background:C.emerald }} />
               <span style={{ fontSize:12, fontWeight: 900, color:C.emerald, letterSpacing:3, textTransform:'uppercase' }}>Portail Vendeur</span>
            </div>
            <h2 style={{ fontSize: 42, margin: '0 0 12px', fontWeight: 900, color:'#fff', letterSpacing:'-2px', lineHeight: 1.1 }}>Espace Artisan</h2>
            <p style={{ color: C.muted, margin: 0, fontSize: 17, fontWeight: 300 }}>Gérez votre boutique et vos commandes SOUK ✦</p>
          </div>

          <form onSubmit={submit}>
            <div style={{ marginBottom: 25 }}>
               <FieldInput label="Email Professionnel" type="email" value={form.email}
                 onChange={set('email')} placeholder="artisan@souk.ma" />
            </div>
            <div style={{ marginBottom: 35 }}>
               <FieldInput label="Mot de passe" type="password" value={form.password}
                 onChange={set('password')} placeholder="••••••••" />
            </div>

            {error && (
              <div style={{ 
                background: `${C.danger}15`, border: `1px solid ${C.danger}30`,
                borderRadius: 20, padding: '16px 24px', fontSize: 13, color: C.danger, 
                marginBottom: 30, fontWeight: 600, animation: 'fadeUp 0.3s ease-out' 
              }}>
                {error}
              </div>
            )}

            <GoldBtn type="submit" disabled={loading} style={{ 
              width: '100%', padding: '22px', borderRadius:24, fontSize:15, fontWeight:900,
              boxShadow: `0 20px 40px ${C.gold}20`
            }}>
              {loading ? 'AUTHENTIFICATION EN COURS…' : 'ACCÉDER AU DASHBOARD'}
            </GoldBtn>

            <div style={{ textAlign: 'center', marginTop: 45, fontSize: 14, color: C.muted }}>
              Vous n'avez pas encore de boutique ?{' '}
              <Link to="/register" style={{ 
                color: C.emerald, textDecoration: 'none', fontWeight: 900, marginLeft:5,
                borderBottom: `1px solid ${C.emerald}30`
              }}>Ouvrir mon échoppe</Link>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
