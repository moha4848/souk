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
    <div style={{ 
      position:'relative', minHeight:'100vh', background:C.bg, 
      display:'flex', alignItems:'center', justifyContent:'center', padding:40,
      fontFamily: "'Outfit', sans-serif", overflow:'hidden'
    }}>
      {/* Background Decor */}
      <div style={{ position:'absolute', top:'-10%', left:'-10%', width:500, height:500, background:C.gold, filter:'blur(180px)', opacity:0.1 }} />
      <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:400, height:400, background:C.emerald, filter:'blur(150px)', opacity:0.05 }} />
      <ZelligeBg opacity={0.1} />
      
      <div style={{ zIndex:1, width:'100%', maxWidth:440, animation: 'fadeUp 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }}>
        <div style={{ textAlign:'center', marginBottom:45 }}>
          <img src="/logo.png" alt="SOUK" style={{ height: 100, marginBottom: 25, filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.3))' }} />
          <h1 style={{ 
            color:'#fff', fontSize:42, fontWeight:900, letterSpacing:-1.5, 
            margin:'0 0 10px', fontFamily:"'Playfair Display', serif"
          }}>
            SOUK <span style={{ color:C.gold }}>CORP</span>
          </h1>
          <Ornament />
          <div style={{ 
            color:C.gold, fontSize:12, letterSpacing:4, 
            textTransform:'uppercase', marginTop:15, fontWeight:900
          }}>
            Protocol d'accès équipe
          </div>
        </div>

        <div style={{ 
          background:'rgba(255,255,255,0.02)', backdropFilter:'blur(20px)', 
          border:`1px solid ${C.border}`, borderRadius:32, padding:40,
          boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
        }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:25 }}>
               <FieldInput 
                 label="Identifiant Professionnel"
                 type="email"
                 value={email}
                 onChange={e=>setEmail(e.target.value)}
                 placeholder="admin@souk.ma"
               />
            </div>
            
            <div style={{ marginBottom:35 }}>
               <FieldInput 
                 label="Clé de Sécurité"
                 type="password"
                 value={password}
                 onChange={e=>setPassword(e.target.value)}
                 placeholder="••••••••"
               />
            </div>

            {error && (
              <div style={{ 
                background:`${C.danger}15`, border:`1px solid ${C.danger}30`, 
                color: C.danger, fontSize: 13, padding: '15px 20px', borderRadius:16,
                marginBottom: 25, textAlign: 'center', fontWeight:600 
              }}>
                {error}
              </div>
            )}
            
            <GoldBtn type="submit" disabled={!email || !password} style={{ width:'100%', padding:'20px', borderRadius:20, fontSize:14, fontWeight:900 }}>
              DÉVERROUILLER L'ACCÈS
            </GoldBtn>
          </form>
        </div>
        
        <div style={{ textAlign:'center', marginTop:35, color:C.muted, fontSize:12, letterSpacing:1, fontWeight:500 }}>
           SYSTÈME DE SURVEILLANCE ACTIF • ACCÈS RÉSERVÉ
        </div>
      </div>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}
