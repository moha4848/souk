import { useState, useEffect } from 'react'
import { C, Card, GoldBtn, Ornament, ZelligeBg, FieldInput, FieldSelect, Spinner } from '../../components/UI'
import { me, updateStoreTheme } from '../../api/services'

const PRESETS = [
  { 
    id: 'sahara', 
    name: 'Sahara Gold', 
    primary: '#D4AF37', 
    secondary: '#121212', 
    font: "'Cormorant Garamond', serif",
    glass: true,
    border: 'gold' 
  },
  { 
    id: 'atlas', 
    name: 'Atlas Night', 
    primary: '#2A6B6B', 
    secondary: '#0D0D0D', 
    font: "'Outfit', sans-serif",
    glass: false,
    border: 'simple' 
  },
  { 
    id: 'copper', 
    name: 'Marrakech Copper', 
    primary: '#B87333', 
    secondary: '#1A1A1A', 
    font: "'Playfair Display', serif",
    glass: true,
    border: 'gold' 
  },
  { 
    id: 'royal', 
    name: 'Royal Teal', 
    primary: '#5CC8B0', 
    secondary: '#111118', 
    font: "'DM Sans', sans-serif",
    glass: true,
    border: 'simple' 
  }
]

export default function CustomizationBuilder() {
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState({
    primaryColor: '#D4AF37',
    secondaryColor: '#121212',
    fontFamily: "'Cormorant Garamond', serif",
    glassmorphism: true,
    goldBorders: true,
    fontSize: '16px'
  })
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    me().then(res => {
      setUser(res.data)
      if(res.data.theme_settings) setTheme(res.data.theme_settings)
    })
  }, [])

  const applyPreset = (p) => {
    setTheme({
      ...theme,
      primaryColor: p.primary,
      secondaryColor: p.secondary,
      fontFamily: p.font,
      glassmorphism: p.glass,
      goldBorders: p.border === 'gold'
    })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateStoreTheme({
        theme_settings: theme
      })
      setMessage('Configuration enregistrée avec succès !')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
      setMessage('Erreur lors de la sauvegarde.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) return <Spinner />

  return (
    <div style={{ display:'grid', gridTemplateColumns:'440px 1fr', minHeight:'100vh', background:C.bg }}>
      
      {/* Sidebar Editor */}
      <div style={{ background:C.surface, borderRight:`1px solid ${C.border}`, padding:'30px 20px', zIndex:2, overflowY:'auto' }}>
        <h2 style={{ color:C.gold, fontFamily:"'Cormorant Garamond', serif", fontSize:26, margin:'0 0 10px 0' }}>
          Store Customizer ✦
        </h2>
        <p style={{ color:C.muted, fontSize:13, marginBottom:30 }}>L'excellence visuelle pour votre artisanat.</p>

        <div style={{ fontSize:10, color:C.gold, letterSpacing:2, textTransform:'uppercase', marginBottom:16, fontWeight:700 }}>
          Thèmes Prédéfinis
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:30 }}>
          {PRESETS.map(p => (
            <div 
              key={p.id}
              onClick={() => applyPreset(p)}
              style={{ 
                background:C.surface2, 
                border:`1px solid ${theme.primaryColor === p.primary ? C.gold : C.border}`,
                padding:12,
                borderRadius:12,
                cursor:'pointer',
                transition:'all 0.2s',
                textAlign:'center'
              }}>
              <div style={{ 
                height:30, 
                background:`linear-gradient(135deg, ${p.primary}, ${p.secondary})`,
                borderRadius:6,
                marginBottom:8
              }} />
              <div style={{ fontSize:10, color:C.text, fontWeight:600 }}>{p.name}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize:10, color:C.gold, letterSpacing:2, textTransform:'uppercase', marginBottom:16, fontWeight:700 }}>
          Ajustements Précis
        </div>
        <Card style={{ marginBottom:20 }}>
          <FieldInput 
            label="Couleur Primaire"
            type="color"
            value={theme.primaryColor}
            onChange={e => setTheme({...theme, primaryColor: e.target.value})}
          />
          <FieldInput 
            label="Couleur de Fond"
            type="color"
            value={theme.secondaryColor}
            onChange={e => setTheme({...theme, secondaryColor: e.target.value})}
          />
          <FieldSelect 
            label="Police de Caractère"
            value={theme.fontFamily}
            onChange={e => setTheme({...theme, fontFamily: e.target.value})}
            options={[
              { value: "'Cormorant Garamond', serif", label: 'Luxe Saharien (Cormorant)' },
              { value: "'DM Sans', sans-serif", label: 'Moderne (DM Sans)' },
              { value: "'Outfit', sans-serif", label: 'Minimaliste (Outfit)' },
              { value: "'Playfair Display', serif", label: 'Héritage (Playfair)' }
            ]}
          />

          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
            <input 
              type="checkbox" 
              checked={theme.glassmorphism}
              onChange={e => setTheme({...theme, glassmorphism: e.target.checked})}
              id="glass"
            />
            <label htmlFor="glass" style={{ fontSize:12, color:C.text }}>Effet Verre (Glassmorphism)</label>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginTop:10 }}>
            <input 
              type="checkbox" 
              checked={theme.goldBorders}
              onChange={e => setTheme({...theme, goldBorders: e.target.checked})}
              id="goldB"
            />
            <label htmlFor="goldB" style={{ fontSize:12, color:C.text }}>Bordures Dorées</label>
          </div>
        </Card>

        <GoldBtn onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'ENREGISTREMENT...' : 'SAUVEGARDER L\'IDENTITÉ'}
        </GoldBtn>

        {message && (
          <div style={{ marginTop:20, padding:12, background:'rgba(212,175,55,0.1)', color:C.gold, borderRadius:12, fontSize:13, textAlign:'center', border:`1px solid ${C.gold}40` }}>
            {message}
          </div>
        )}
      </div>

      {/* Live Preview Area */}
      <div style={{ position:'relative', padding:60, display:'flex', justifyContent:'center', alignItems:'flex-start', overflowY:'auto', background:theme.secondaryColor }}>
        <ZelligeBg />
        
        <div style={{ 
          position:'relative', 
          width:'100%', 
          maxWidth:800, 
          background: theme.glassmorphism ? 'rgba(255,255,255,0.03)' : C.surface, 
          backdropFilter: theme.glassmorphism ? 'blur(20px)' : 'none',
          borderRadius:24, 
          boxShadow:'0 30px 60px rgba(0,0,0,0.5)',
          overflow:'hidden',
          border: theme.goldBorders ? `1px solid ${C.gold}40` : `1px solid ${C.border}`,
          zIndex:1
        }}>
          {/* Mock Storefront Preview */}
          <div style={{ 
            height:260, 
            background:`linear-gradient(135deg, ${theme.primaryColor}20, ${theme.primaryColor}05)`, 
            display:'flex', 
            flexDirection:'column',
            alignItems:'center', 
            justifyContent:'center', 
            color:C.text,
            borderBottom:`1px solid ${theme.primaryColor}20`
          }}>
             <div style={{ padding:12, border:`1px solid ${theme.primaryColor}`, borderRadius:'50%', marginBottom:20 }}>
               <div style={{ width:40, height:40, background:theme.primaryColor, borderRadius:'50%' }} />
             </div>
             <h1 style={{ fontFamily: theme.fontFamily, fontSize:48, margin:0, fontWeight:300, letterSpacing:2 }}>
               {user.vendor?.shop_name || user.shop_name || 'Ma Boutique'}
             </h1>
             <p style={{ fontFamily: theme.fontFamily, fontSize:16, color:C.gold, marginTop:10, fontStyle:'italic' }}>
               L'Art de l'excellence Marocaine
             </p>
          </div>
          
          <div style={{ padding:60, textAlign:'center' }}>
            <Ornament />
            <h2 style={{ fontFamily: theme.fontFamily, color:theme.primaryColor, marginTop:30, fontSize:28, fontWeight:400 }}>
              Collections Signature
            </h2>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24, marginTop:50 }}>
              {[1,2,3].map(i => (
                <div key={i} style={{ 
                  background: theme.glassmorphism ? 'rgba(255,255,255,0.02)' : C.surface2, 
                  height:220, 
                  borderRadius:16, 
                  border: theme.goldBorders ? `1px solid ${C.gold}20` : `1px solid ${C.border}`,
                  padding:15
                }}>
                  <div style={{ height:140, background:`${theme.primaryColor}10`, borderRadius:10 }}></div>
                  <div style={{ height:4, width:'50%', background:theme.primaryColor, margin:'20px auto 0' }}></div>
                  <div style={{ height:2, width:'30%', background:C.border, margin:'10px auto' }}></div>
                </div>
              ))}
            </div>
            
            <div style={{ 
              marginTop:80, 
              padding:'16px 50px', 
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.primaryColor}CC)`, 
              color: '#fff', 
              display:'inline-block', 
              borderRadius:4,
              fontSize:11,
              fontWeight:700,
              letterSpacing:3,
              fontFamily: theme.fontFamily,
              boxShadow:`0 10px 30px ${theme.primaryColor}30`,
              cursor:'pointer'
            }}>
              DÉCOUVRIR L'HÉRITAGE
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
