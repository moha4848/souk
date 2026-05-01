import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useClientAuth } from '../../context/ClientAuthContext'
import { C, GoldBtn, FieldInput, ZelligeBg } from '../../components/UI'

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
      background: `radial-gradient(ellipse at 30% 0%, rgba(16,185,129,0.06) 0%, ${C.bg} 55%)`,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 16px',
    }}>
      <style>{KF}</style>
      
      <div style={{
        width: '100%', maxWidth: 400, background: C.bg, borderRadius: 32,
        border: `1.5px solid ${C.border}`, overflow: 'hidden',
        boxShadow: `0 0 80px rgba(92,200,176,0.05), 0 40px 80px rgba(0,0,0,0.5)`,
        animation: 'fadeUp 0.5s ease-out',
      }}>
        {/* Header */}
        <div style={{ position: 'relative', padding: '28px 28px 0' }}>
          <ZelligeBg height={120} />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 20 }}>
            <img src="/logo.png" alt="SOUK Logo" style={{ height: 60, objectFit: 'contain', marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3, letterSpacing: 1 }}>Espace Acheteur</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '0 28px 32px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, textAlign: 'center', marginBottom: 24 }}>
            Bon retour parmi nous
          </div>

          <form onSubmit={submit}>
            <FieldInput label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" />
            <FieldInput label="Mot de passe" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 24 }}>
              <span style={{ fontSize: 11, color: C.tealL, cursor: 'pointer' }}>Mot de passe oublié ?</span>
            </div>

            {error && (
              <div style={{ background: 'rgba(201,76,76,0.1)', border: `1px solid ${C.danger}40`, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: C.danger, marginBottom: 14 }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={!isFormValid || loading} style={{
              width: '100%', padding: '14px 24px', borderRadius: 14,
              background: `linear-gradient(135deg, ${C.teal}, ${C.tealL})`, border: 'none',
              color: C.bg, fontSize: 14, fontWeight: 600, cursor: isFormValid && !loading ? 'pointer' : 'not-allowed',
              opacity: isFormValid && !loading ? 1 : 0.6,
              transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: `0 8px 24px ${C.teal}30`,
            }}>
              {loading ? (
                <span style={{ display: 'inline-block', width: 14, height: 14, border: `2px solid ${C.bg}`, borderTop: `2px solid transparent`, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              ) : 'Se connecter'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: C.muted }}>
            Nouveau sur SOUK ?{' '}
            <Link to={`/client/register?returnUrl=${encodeURIComponent(returnUrl)}`} style={{ color: C.tealL, textDecoration: 'none', fontWeight: 600 }}>Créer un compte</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
