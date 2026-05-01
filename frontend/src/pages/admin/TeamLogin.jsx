import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, FieldInput, GoldBtn, Ornament, Card, ZelligeBg } from '../../components/UI'
import { useAdminAuth } from '../../context/AdminAuthContext'

export default function TeamLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { loginAdmin } = useAdminAuth()
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await loginAdmin(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Erreur de connexion')
    }
  }

  return (
    <div style={{ position:'relative', minHeight:'100vh', background:C.bg, 
      display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <ZelligeBg />
      
      <div style={{ zIndex:1, width:'100%', maxWidth:400 }}>
        <div style={{ textAlign:'center', marginBottom:30 }}>
          <h1 style={{ color:C.gold, fontSize:32, fontWeight:300, 
            letterSpacing:8, margin:0, fontFamily:"'Cormorant Garamond',serif"}}>
            SOUK
          </h1>
          <Ornament />
          <div style={{ color:C.muted, fontSize:11, letterSpacing:4, 
            textTransform:'uppercase', marginTop:8}}>
            Espace Équipe
          </div>
        </div>

        <Card>
          <form onSubmit={handleLogin}>
            <FieldInput 
              label="Email Professionnel"
              type="email"
              value={email}
              onChange={e=>setEmail(e.target.value)}
              placeholder="admin@souk.ma"
            />
            
            <FieldInput 
              label="Mot de passe"
              type="password"
              value={password}
              onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && <div style={{ color: C.danger, fontSize: 13, marginBottom: 15, textAlign: 'center' }}>{error}</div>}
            
            <div style={{ marginTop: 24 }}>
              <GoldBtn type="submit" disabled={!email || !password}>
                CONNECTER AU PANNEAU
              </GoldBtn>
            </div>
          </form>
        </Card>
        
        <div style={{ textAlign:'center', marginTop:24, color:C.muted, fontSize:12 }}>
          Accès restreint. Monitoring actif.
        </div>
      </div>
    </div>
  )
}
