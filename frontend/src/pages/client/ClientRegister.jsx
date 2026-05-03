import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useClientAuth } from '../../context/ClientAuthContext'
import { C, FieldInput, ZelligeBg, GoldBtn, FieldSelect } from '../../components/UI'

const KF = `
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin   { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
`

export default function ClientRegister() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || '/client/dashboard'
  
  const { registerClient } = useClientAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await registerClient({ name, email, password, newsletter })
      navigate(returnUrl)
    } catch (err) {
      setError('Une erreur est survenue lors de l\'inscription.')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = email && password.length >= 6 && name

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
            Rejoignez l'élite <br/> de la <span style={{ color: C.gold }}>Communauté</span>.
          </h1>
          
          <div style={{ width:80, height:2, background:C.gold, margin:'0 auto 30px' }} />
          
          <p style={{ color: C.muted, fontSize: 18, maxWidth: 450, margin: '0 auto', lineHeight: 1.8, fontWeight: 300 }}>
            Inscrivez-vous dès aujourd'hui pour bénéficier d'un accès exclusif aux meilleures créations du royaume.
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
        background: `radial-gradient(circle at 70% 30%, ${C.emerald}05 0%, transparent 50%)`
      }}>
        <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }}>
          {/* Logo only on mobile */}
          <div className="show-mobile" style={{ textAlign: 'center', marginBottom: 50 }}>
             <img src="/logo.png" alt="SOUK" style={{ height: 80, width: 'auto' }} />
          </div>

          <div style={{ marginBottom: 45 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:15 }}>
               <div style={{ width:24, height:1, background:C.gold }} />
               <span style={{ fontSize:12, fontWeight: 900, color:C.gold, letterSpacing:3, textTransform:'uppercase' }}>Inscription</span>
            </div>
            <h2 style={{ fontSize: 42, margin: '0 0 12px', fontWeight: 900, color:'#fff', letterSpacing:'-2px', lineHeight: 1.1 }}>Créer votre compte</h2>
            <p style={{ color: C.muted, margin: 0, fontSize: 17, fontWeight: 300 }}>Commencez votre voyage sur SOUK ✦</p>
          </div>

          <form onSubmit={submit}>
            <div style={{ marginBottom: 20 }}>
               <FieldInput label="Nom Complet" value={name} onChange={e => setName(e.target.value)} placeholder="Amira El Mansouri" />
            </div>
            <div style={{ marginBottom: 20 }}>
               <FieldInput label="Adresse Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" />
            </div>
            <div style={{ marginBottom: 30 }}>
               <FieldInput label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            
            <div onClick={() => setNewsletter(!newsletter)} style={{ 
              display: 'flex', gap: 15, alignItems: 'flex-start', marginBottom: 35, cursor: 'pointer', 
              background: newsletter ? `${C.emerald}08` : C.surface2, 
              padding: '18px', borderRadius: 20, 
              border: `1px solid ${newsletter ? `${C.emerald}30` : C.border}`, 
              transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
            }}>
              <div style={{ 
                width: 24, height: 24, borderRadius: 10, 
                border: `2px solid ${newsletter ? C.emerald : C.border}`, 
                background: newsletter ? C.emerald : 'transparent', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: 12, color: '#fff', flexShrink: 0, marginTop: 1, transition: 'all 0.3s' 
              }}>
                {newsletter ? '✓' : ''}
              </div>
              <div>
                 <div style={{ fontSize: 14, color: '#fff', fontWeight: 700, marginBottom: 4 }}>Newsletter Exclusive</div>
                 <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>Recevez nos invitations aux ventes privées.</div>
              </div>
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
              {loading ? 'CRÉATION DU PROFIL...' : 'REJOINDRE LE SOUK'}
            </GoldBtn>
          </form>

          <div style={{ textAlign: 'center', marginTop: 45, fontSize: 14, color: C.muted }}>
            Déjà parmi nous ?{' '}
            <Link to={`/client/login?returnUrl=${encodeURIComponent(returnUrl)}`} style={{ 
              color: C.emerald, textDecoration: 'none', fontWeight: 900, marginLeft:5,
              borderBottom: `1px solid ${C.emerald}30`
            }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
