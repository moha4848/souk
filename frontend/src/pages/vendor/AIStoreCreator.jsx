import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, FieldInput, GoldBtn, Ornament, Card, ZelligeBg, Spinner } from '../../components/UI'
import { generateAIStore } from '../../api/services'

export default function AIStoreCreator() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleGenerate = async () => {
    if(!prompt) return
    setIsGenerating(true)
    setError('')
    
    try {
      const r = await generateAIStore(prompt)
      const data = r.data
      setResult({
        storeName: data.shop_name,
        description: data.description,
        colors: { 
          primary: data.theme_settings.primaryColor, 
          background: data.theme_settings.secondaryColor 
        },
        categories: data.categories
      })
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.error || "Erreur lors de la génération. Vérifiez votre clé API.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = async () => {
    if(!result) return
    setIsGenerating(true)
    try {
      await updateStoreTheme({
        shop_name: result.storeName,
        store_description: result.description,
        theme_settings: {
          primaryColor: result.colors.primary,
          secondaryColor: result.colors.background,
          fontFamily: "'Cormorant Garamond', serif"
        }
      })
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError("Erreur lors de la sauvegarde de votre boutique.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div style={{ position:'relative', minHeight:'100vh', background:C.bg, 
      display:'flex', flexDirection:'column', alignItems:'center', padding:40,
      fontFamily: "'Outfit', sans-serif", overflow:'hidden' }}>
      
      {/* Magical Background Decor */}
      <div style={{ position:'absolute', top:'-10%', left:'-10%', width:600, height:600, background:C.emerald, filter:'blur(200px)', opacity:0.05 }} />
      <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:500, height:500, background:C.gold, filter:'blur(150px)', opacity:0.03 }} />
      <ZelligeBg opacity={0.1} />
      
      <div style={{ zIndex:1, width:'100%', maxWidth:700, marginTop:40, animation: 'fadeUp 1s cubic-bezier(0.23, 1, 0.32, 1)' }}>
        
        <div style={{ textAlign:'center', marginBottom:50 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:10, padding:'8px 20px', borderRadius:100, background:`${C.gold}10`, border:`1px solid ${C.gold}30`, marginBottom:20 }}>
             <Sparkles size={14} color={C.gold} />
             <span style={{ color:C.gold, fontSize:11, letterSpacing:3, textTransform:'uppercase', fontWeight:900 }}>SOUK ✦ AI Magic</span>
          </div>
          <h1 style={{ color:'#fff', fontSize:'clamp(2rem, 5vw, 3.5rem)', fontWeight:900, 
            margin:0, fontFamily:"'Playfair Display',serif", lineHeight:1.1 }}>
            Donnez vie à votre <br/> <span style={{ color: C.emerald }}>Boutique de Rêve</span>.
          </h1>
          <p style={{ color:C.muted, marginTop:20, fontSize:17, maxWidth:550, margin:'20px auto', fontWeight:300 }}>
            L'Intelligence Artificielle de SOUK conçoit votre identité visuelle, vos catégories et votre storytelling en quelques secondes.
          </p>
        </div>

        {!result && !isGenerating && (
          <div style={{ background:'rgba(255,255,255,0.02)', backdropFilter:'blur(20px)', border:`1px solid ${C.border}`, borderRadius:32, padding:40, boxShadow:'0 40px 100px rgba(0,0,0,0.6)' }}>
            <FieldInput 
              label="Quel est votre concept ?"
              value={prompt}
              onChange={e=>setPrompt(e.target.value)}
              placeholder="Ex: Une boutique de cosmétiques bio à base d'huile d'argan, avec une esthétique zen et épurée..."
            />
            {error && (
              <div style={{ background:`${C.danger}10`, border:`1px solid ${C.danger}20`, color: C.danger, fontSize: 13, padding:'15px', borderRadius:16, marginBottom: 20, textAlign: 'center', fontWeight:600 }}>
                {error}
              </div>
            )}
            <div style={{ marginTop:30 }}>
              <GoldBtn onClick={handleGenerate} disabled={!prompt} style={{ width:'100%', padding:'22px', borderRadius:20, fontSize:15, fontWeight:900 }}>
                ✨ LANCER LE SORTILÈGE GÉNÉRATIF
              </GoldBtn>
            </div>
          </div>
        )}

        {isGenerating && (
          <div style={{ textAlign:'center', padding:'60px 40px', background:'rgba(255,255,255,0.02)', borderRadius:32, border:`1px solid ${C.border}` }}>
            <div style={{ position:'relative', display:'inline-block' }}>
               <div style={{ position:'absolute', inset:-20, background:C.emerald, filter:'blur(40px)', opacity:0.2, animation:'pulseGlow 2s infinite' }} />
               <Spinner />
            </div>
            <div style={{ color:C.gold, marginTop:35, letterSpacing:4, fontSize:14, fontWeight:900 }}>
              L'IA CONÇOIT VOTRE UNIVERS...
            </div>
            <p style={{ color:C.muted, fontSize:13, marginTop:12, fontWeight:400 }}>Extraction des palettes chromatiques et génération du copywriting.</p>
          </div>
        )}

        {result && !isGenerating && (
          <div style={{ 
            background:C.surface, border:`1px solid ${C.emerald}30`, borderRadius:40, 
            overflow:'hidden', boxShadow:'0 50px 120px rgba(0,0,0,0.8)', animation: 'fadeUp 0.8s ease-out' 
          }}>
            <div style={{ background:`linear-gradient(135deg, ${C.surface2} 0%, ${C.bg} 100%)`, padding:50, textAlign:'center', position:'relative' }}>
              <ZelligeBg opacity={0.05} />
              <div style={{ position:'relative', zIndex:1 }}>
                <div style={{ fontSize:11, color:C.emerald, fontWeight:900, letterSpacing:3, marginBottom:15 }}>NOM DE L'ENSEIGNE GÉNÉRÉ</div>
                <h2 style={{ fontFamily:"'Playfair Display', serif", color:'#fff', fontSize:48, margin:0, fontWeight:900 }}>
                  {result.storeName}
                </h2>
                <div style={{ width:60, height:2, background:C.gold, margin:'25px auto' }} />
                <p style={{ color:C.muted, fontSize:16, lineHeight:1.8, maxWidth:500, margin:'0 auto', fontWeight:300 }}>
                  {result.description}
                </p>
              </div>
            </div>
            
            <div style={{ padding:50, background:C.bg }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:40 }}>
                <div>
                   <div style={{ fontSize:11, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:20, fontWeight:800 }}>Palette Chromatique</div>
                   <div style={{ display:'flex', gap:15 }}>
                     <div style={{ width:50, height:50, borderRadius:16, background:result.colors.primary, boxShadow:`0 10px 20px ${result.colors.primary}40` }} title="Couleur Primaire" />
                     <div style={{ width:50, height:50, borderRadius:16, background:result.colors.background, border:`1px solid ${C.border}` }} title="Couleur de Fond" />
                     <div style={{ width:50, height:50, borderRadius:16, background:C.emerald }} title="Accent SOUK" />
                   </div>
                </div>

                <div>
                   <div style={{ fontSize:11, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:20, fontWeight:800 }}>Rayons Automatisés</div>
                   <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
                     {result.categories.map(c => (
                       <span key={c} style={{ background:`${C.emerald}10`, padding:'8px 18px', borderRadius:100, fontSize:12, color:C.emerald, border:`1px solid ${C.emerald}30`, fontWeight:700 }}>
                         {c}
                       </span>
                     ))}
                   </div>
                </div>
              </div>

              <div style={{ display:'flex', gap:20, marginTop:50, borderTop:`1px solid ${C.border}`, paddingTop:40 }}>
                <button onClick={() => setResult(null)} style={{ flex:0.4, padding:'20px', borderRadius:20, border:`1px solid ${C.border}`, background:C.surface, color:C.text, fontWeight:800, cursor:'pointer', fontSize:14 }}>
                  RÉGÉNÉRER
                </button>
                <GoldBtn onClick={handleSave} style={{ flex:1, borderRadius:20, padding:'20px', fontSize:15, fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
                   ADOPTER CETTE IDENTITÉ <ArrowRight size={20} />
                </GoldBtn>
              </div>
            </div>
          </div>
        )}

      </div>
      <style>{`
        @keyframes pulseGlow { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.1); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
    </div>
  )
}
