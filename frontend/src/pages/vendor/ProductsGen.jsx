import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { C, Card, GoldBtn, Ornament, ZelligeBg, FieldInput, Spinner } from '../../components/UI'
import { generateAIProduct, createProduct } from '../../api/services'

export default function ProductsGen() {
  const [name, setName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [finalProduct, setFinalProduct] = useState({
    price: 0,
    stock: 10,
    category: 'Artisanat',
    image_url: ''
  })
  const navigate = useNavigate()

  const handleGenerate = async () => {
    if(!name) return
    setIsGenerating(true)
    try {
      const res = await generateAIProduct(name)
      setAiResult(res.data)
      setFinalProduct({
        ...finalProduct,
        price: res.data.suggested_price,
        image_url: res.data.suggested_image_url
      })
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleFinish = async () => {
    try {
      await createProduct({
        name: aiResult.title,
        description: aiResult.description,
        price: finalProduct.price,
        stock: finalProduct.stock,
        category: aiResult.category,
        image_url: finalProduct.image_url,
        emoji: '🏺'
      })
      navigate('/products')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ position:'relative', minHeight:'100vh', background:C.bg, padding:40 }}>
      <ZelligeBg height={300} />
      
      <div style={{ position:'relative', zIndex:1, maxWidth:800, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <h1 style={{ color:C.gold, fontFamily:"'Cormorant Garamond', serif", fontSize:32 }}>
            Création Assistée par IA ✦
          </h1>
          <Ornament />
          <p style={{ color:C.muted, marginTop:10 }}>Décrivez simplement votre produit, SOUK IA s'occupe du reste.</p>
        </div>

        {!aiResult && !isGenerating && (
          <Card style={{ maxWidth:500, margin:'0 auto' }}>
            <FieldInput 
              label="Nom du produit"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Tapis Berbère en laine rouge"
            />
            <GoldBtn onClick={handleGenerate} disabled={!name}>
              GÉNÉRER AVEC L'IA
            </GoldBtn>
          </Card>
        )}

        {isGenerating && (
          <div style={{ textAlign:'center', padding:60 }}>
            <Spinner />
            <div style={{ color:C.gold, marginTop:20, letterSpacing:2 }}>CRÉATION DU STORYTELLING EN COURS...</div>
          </div>
        )}

        {aiResult && !isGenerating && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:30, animation: 'fadeUp 0.5s ease' }}>
            
            {/* AI Result Card - Creative Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Card style={{ border:`1px solid ${C.gold}40`, overflow: 'hidden', padding: 0 }}>
                 {/* AI Generated Image */}
                 <div style={{ height: 300, background: C.surface2, position: 'relative', overflow: 'hidden' }}>
                    <img src={finalProduct.image_url} alt="AI Generated" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.8)' }} />
                    <div style={{ position: 'absolute', bottom: 12, right: 12, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: 20, fontSize: 10, color: C.gold, border: `1px solid ${C.gold}40` }}>
                       ✨ VISION IA GÉNÉRÉE
                    </div>
                 </div>
                 
                 <div style={{ padding: 24 }}>
                    <div style={{ fontSize:10, color:C.gold, letterSpacing:2, textTransform:'uppercase', marginBottom:14, fontWeight: 700 }}>
                      Propulsion Storytelling SOUK ✦
                    </div>
                    <h2 style={{ color:C.text, fontSize:24, margin:'0 0 10px 0', fontFamily: "'Cormorant Garamond', serif" }}>{aiResult.title}</h2>
                    <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, fontStyle: 'italic' }}>"{aiResult.description}"</p>
                    
                    <div style={{ marginTop:24 }}>
                      <div style={{ fontSize:10, color:C.muted, letterSpacing:1, marginBottom:10 }}>TAGS DE RÉFÉRENCEMENT</div>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        {aiResult.tags.map(t => (
                          <span key={t} style={{ background:`${C.gold}10`, border: `1px solid ${C.gold}20`, padding:'4px 12px', borderRadius:20, fontSize:11, color:C.goldL }}>
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                 </div>
              </Card>

              {/* Refresh Option */}
              <button 
                onClick={() => setAiResult(null)}
                style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${C.border}`, color:C.muted, padding: '12px', borderRadius: 12, fontSize:12, cursor:'pointer', transition: 'all 0.3s' }}
                onMouseOver={e => e.currentTarget.style.borderColor = C.gold}
                onMouseOut={e => e.currentTarget.style.borderColor = C.border}
              >
                ← Refaire une proposition IA
              </button>
            </div>

            {/* Inventory Form & Finalization */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <Card style={{ padding: 30 }}>
                <h3 style={{ color:C.text, marginTop:0, fontFamily: "'Cormorant Garamond', serif", fontSize: 20 }}>Détails Commerciaux</h3>
                <div style={{ marginBottom: 20 }}>
                   <FieldInput 
                    label="Prix de vente conseillé (MAD)"
                    type="number"
                    value={finalProduct.price}
                    onChange={e => setFinalProduct({...finalProduct, price: e.target.value})}
                  />
                  <div style={{ fontSize: 10, color: C.tealL, marginTop: -10, marginBottom: 15 }}>
                    💡 Suggéré par l'IA basé sur le marché actuel
                  </div>
                </div>

                <FieldInput 
                  label="Stock initial"
                  type="number"
                  value={finalProduct.stock}
                  onChange={e => setFinalProduct({...finalProduct, stock: e.target.value})}
                />

                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Catégorie</div>
                  <div style={{ background: C.surface2, padding: '12px 16px', borderRadius: 12, border: `1px solid ${C.border}`, color: C.text, fontSize: 14 }}>
                    {aiResult.category}
                  </div>
                </div>

                <div style={{ height:20 }} />
                
                <GoldBtn onClick={handleFinish} style={{ padding: '18px 0', fontSize: 14 }}>
                  CONFIRMER ET PUBLIER AU SOUK ✦
                </GoldBtn>
                
                <p style={{ textAlign: 'center', fontSize: 11, color: C.muted, marginTop: 15 }}>
                  En publiant, ce produit sera immédiatement visible sur votre boutique.
                </p>
              </Card>

              {/* Tips */}
              <Card style={{ background: `${C.teal}05`, border: `1px solid ${C.teal}20` }}>
                 <div style={{ display: 'flex', gap: 12, alignItems: 'center', color: C.tealL }}>
                    <span style={{ fontSize: 20 }}>💡</span>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>Conseil Artisan</div>
                 </div>
                 <p style={{ fontSize: 11, color: C.muted, marginTop: 10, lineHeight: 1.5 }}>
                   Les clients SOUK préfèrent les descriptions racontant l'histoire de l'objet. L'IA a déjà inclus ces éléments pour vous.
                 </p>
              </Card>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
