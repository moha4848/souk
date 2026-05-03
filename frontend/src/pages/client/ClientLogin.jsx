import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useClientAuth } from '../../context/ClientAuthContext'
import { C, GoldBtn, FieldInput, ZelligeBg, FieldSelect } from '../../components/UI'

const KF = `
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
`

export default function ClientLogin() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/client/dashboard'
  
  const { loginClient } = useClientAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await loginClient(email, password)
      navigate(returnUrl)
    } catch (err) {
      setError('Identifiants incorrects.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = email && password

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
             <img src="/logo.png" alt="SOUK" style={{ height: 120, width: 'auto', filter: 'drop-shadow(0 0 40px rgba(16,185,129,0.4))' }} />
          </div>
          
          <h1 style={{ 
            fontSize: 62, fontWeight: 900, margin: '0 0 25px', letterSpacing: '-3px', 
            fontFamily:"'Playfair Display', serif", color:'#fff', lineHeight: 1
          }}>
            L'Excellence à portée <br/> de <span style={{ color: C.emerald }}>votre main</span>.
          </h1>
          
          <div style={{ width:80, height:2, background:C.gold, margin:'0 auto 30px' }} />
          
          <p style={{ color: C.muted, fontSize: 18, maxWidth: 450, margin: '0 auto', lineHeight: 1.8, fontWeight: 300 }}>
            Accédez à votre univers SOUK ✦ et retrouvez vos créations d'exception sélectionnées avec soin.
          </p>

          <div style={{ marginTop:60, display:'flex', gap:20, justifyContent:'center' }}>
             {[1,2,3].map(i => (
               <div key={i} style={{ 
                 width:100, height:130, borderRadius:24, background:C.surface2, 
                 border:`1px solid ${C.border}`, overflow:'hidden', 
                 transform: `translateY(${i*15}px)`, boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                 display:'flex', alignItems:'center', justifyContent:'center', color:C.emerald, opacity:0.2
               }}>
                  <div style={{ width:40, height:40, background:C.emerald, borderRadius:10, filter:'blur(20px)' }} />
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
        background: `radial-gradient(circle at 30% 70%, ${C.gold}05 0%, transparent 50%)`
      }}>
        <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }}>
          {/* Logo only on mobile */}
          <div className="show-mobile" style={{ textAlign: 'center', marginBottom: 50 }}>
             <img src="/logo.png" alt="SOUK" style={{ height: 80, width: 'auto' }} />
          </div>

          <div style={{ marginBottom: 45 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:15 }}>
               <div style={{ width:24, height:1, background:C.emerald }} />
               <span style={{ fontSize:12, fontWeight: 900, color:C.emerald, letterSpacing:3, textTransform:'uppercase' }}>Accès Client</span>
            </div>
            <h2 style={{ fontSize: 42, margin: '0 0 12px', fontWeight: 900, color:'#fff', letterSpacing:'-2px', lineHeight: 1.1 }}>Bon retour</h2>
            <p style={{ color: C.muted, margin: 0, fontSize: 17, fontWeight: 300 }}>Reconnectez-vous à votre espace privilégié.</p>
          </div>

          <form onSubmit={submit}>
            <div style={{ marginBottom: 25 }}>
               <FieldInput label="Adresse Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" />
            </div>
            <div style={{ marginBottom: 15 }}>
               <FieldInput label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 35 }}>
              <span style={{ fontSize: 13, color: C.emerald, cursor: 'pointer', fontWeight:900, letterSpacing:0.5, borderBottom:`1px solid ${C.emerald}30` }}>Mot de passe oublié ?</span>
            </div>

            {error && (
              <div style={{ 
                background: 'rgba(201,76,76,0.1)', border: `1px solid ${C.danger}30`, 
                borderRadius: 20, padding: '16px 24px', fontSize: 13, color: C.danger, 
                marginBottom: 25, fontWeight:600, animation: 'fadeUp 0.3s ease-out' 
              }}>
                {error}
              </div>
            )}

            <GoldBtn type="submit" disabled={!isFormValid || loading} style={{ 
              width: '100%', padding:'22px', borderRadius:24, fontSize:15, fontWeight:900,
              boxShadow: isFormValid ? `0 20px 40px ${C.gold}20` : 'none'
            }}>
              {loading ? 'SÉCURISATION DU COMPTE...' : 'ACCÉDER À MON ESPACE'}
            </GoldBtn>
          </form>

          <div style={{ textAlign: 'center', marginTop: 45, fontSize: 14, color: C.muted }}>
            Nouvel acquéreur sur SOUK ?{' '}
            <Link to={`/client/register?returnUrl=${encodeURIComponent(returnUrl)}`} style={{ 
              color: C.emerald, textDecoration: 'none', fontWeight: 900, marginLeft:5,
              borderBottom: `1px solid ${C.emerald}30`
            }}>Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
