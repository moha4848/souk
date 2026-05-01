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
      display:'flex', flexDirection:'column', alignItems:'center', padding:40 }}>
      <ZelligeBg height={400} />
      
      <div style={{ zIndex:1, width:'100%', maxWidth:600, marginTop:40 }}>
        
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ color:C.gold, fontSize:12, letterSpacing:4, textTransform:'uppercase', marginBottom:12 }}>
            SOUK ✦ AI Magic
          </div>
          <h1 style={{ color:C.text, fontSize:28, fontWeight:300, 
            margin:0, fontFamily:"'Cormorant Garamond',serif"}}>
            Décrivez votre boutique de rêve
          </h1>
          <p style={{ color:C.muted, marginTop:12, fontSize:15 }}>
            L'Intelligence Artificielle va générer votre identité visuelle, vos catégories, et votre copywriting en 10 secondes.
          </p>
        </div>

        {!result && !isGenerating && (
          <Card style={{ padding: 30 }}>
            <FieldInput 
              label="Que vendez-vous ?"
              value={prompt}
              onChange={e=>setPrompt(e.target.value)}
              placeholder="Ex: Des tapis berbères tissés à la main avec une touche moderne..."
              style={{ marginBottom: 24 }}
            />
            {error && (
              <div style={{ color: '#ff4d4d', fontSize: 13, marginBottom: 16, textAlign: 'center' }}>
                {error}
              </div>
            )}
            <GoldBtn onClick={handleGenerate} disabled={!prompt}>
              ✨ GÉNÉRER MA BOUTIQUE
            </GoldBtn>
          </Card>
        )}

        {isGenerating && (
          <div style={{ textAlign:'center', padding:40 }}>
            <Spinner />
            <div style={{ color:C.gold, marginTop:20, letterSpacing:2, fontSize:13 }}>
              L'IA CONÇOIT VOTRE IDENTITÉ VISUELLE...
            </div>
            <p style={{ color:C.muted, fontSize:12, marginTop:10 }}>Création des palettes de couleurs et du logo.</p>
          </div>
        )}

        {result && !isGenerating && (
          <Card style={{ border:`1px solid ${C.goldL}30`, padding:0, overflow:'hidden' }}>
            <div style={{ background:C.surface2, padding:30, textAlign:'center' }}>
              <h2 style={{ fontFamily:"'Cormorant Garamond', serif", color:C.gold, fontSize:32, margin:0 }}>
                {result.storeName}
              </h2>
              <Ornament />
              <p style={{ color:C.text, fontSize:14, lineHeight:1.6, marginTop:10 }}>
                {result.description}
              </p>
            </div>
            
            <div style={{ padding:30 }}>
              <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>
                Couleurs Suggérées
              </div>
              <div style={{ display:'flex', gap:10, marginBottom:30 }}>
                <div style={{ width:40, height:40, borderRadius:'50%', background:result.colors.primary }} />
                <div style={{ width:40, height:40, borderRadius:'50%', background:result.colors.background, border:`1px solid ${C.border}` }} />
                <div style={{ width:40, height:40, borderRadius:'50%', background:C.teal }} />
              </div>

              <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:16 }}>
                Catégories auto-créées
              </div>
              <div style={{ display:'flex', gap:10, marginBottom:30 }}>
                {result.categories.map(c => (
                  <span key={c} style={{ background:C.surface2, padding:'6px 12px', borderRadius:20, fontSize:12, color:C.text, border:`1px solid ${C.border}` }}>
                    {c}
                  </span>
                ))}
              </div>

              <div style={{ display:'flex', gap:16, marginTop:20 }}>
                <GoldBtn outline onClick={() => setResult(null)}>
                  RÉGÉNÉRER
                </GoldBtn>
                <GoldBtn onClick={handleSave}>
                  LANCER MA BOUTIQUE
                </GoldBtn>
              </div>
            </div>
          </Card>
        )}

      </div>
    </div>
  )
}
