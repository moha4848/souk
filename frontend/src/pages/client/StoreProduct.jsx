import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Plus, Minus, ShieldCheck, Truck, Sparkles, Package } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { C, Arch, Ornament, ZelligeBg, Spinner, GoldBtn, Glass, Pill } from '../../components/UI'
import { getStoreProduct } from '../../api/services'

const KF = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cairo:wght@400;600;700&display=swap');
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes slideRight { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
@keyframes slideLeft { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
@media (max-width: 992px) {
  .prod-section { grid-template-columns: 1fr !important; }
  .prod-visual { padding: 100px 20px 40px !important; }
  .prod-visual > div { height: 60vh !important; border-radius: 24px !important; }
  .prod-info { padding: 40px 20px !important; }
  .prod-title { font-size: 2.5rem !important; }
  .nav-header { padding: 15px 20px !important; }
}
`

export default function StoreProduct() {
  const { slug, id } = useParams()
  const navigate = useNavigate()
  const { addToCart, totalCartCount } = useCart()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    getStoreProduct(slug, id)
      .then(r => setData(r.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [slug, id])

  const product = data?.product
  const vendor = data?.vendor
  const themeColor = vendor?.theme_settings?.primaryColor || C.gold
  const themeBg = vendor?.theme_settings?.backgroundColor || C.bg

  const handleAdd = () => {
    if (!product) return
    addToCart(slug, product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <Spinner />
  if (!product) return (
    <div style={{ background:C.bg, height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:20 }}>
      <Package size={80} color={C.gold} opacity={0.3} />
      <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:24 }}>PIÈCE INTROUVABLE</h2>
      <GoldBtn onClick={() => navigate('/')}>RETOUR À L'ACCUEIL</GoldBtn>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: themeBg, color: C.text, fontFamily: "'Cairo', sans-serif", position:'relative' }}>
      <style>{KF}</style>
      <ZelligeBg opacity={0.03} />

      {/* ── Navbar ── */}
      <nav className="nav-header" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '30px 60px', display: 'flex', justifyContent: 'space-between', alignItems:'center', background:'linear-gradient(to bottom, rgba(10,10,15,0.8), transparent)', backdropFilter:'blur(5px)' }}>
        <div onClick={() => navigate(`/store/${slug}`)} style={{ cursor: 'pointer', display:'flex', alignItems:'center', gap:10, fontSize: 12, fontWeight:800, color:themeColor, letterSpacing:2 }}>
           <ArrowLeft size={18} /> RETOUR À LA COLLECTION
        </div>
        <div onClick={() => navigate(`/store/${slug}/cart`)} style={{ cursor: 'pointer', display:'flex', alignItems:'center', gap:12, background:C.surface, padding:'10px 20px', borderRadius:30, border:`1px solid ${C.border}`, fontWeight:800, fontSize:12 }}>
           <ShoppingBag size={18} color={themeColor} /> PANIER ({totalCartCount})
        </div>
      </nav>

      {/* ── Product Section ── */}
      <div className="prod-section" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', minHeight: '100vh', animation: 'fadeIn 1s ease-out' }}>
        
        {/* Left: Product Visual */}
        <div className="prod-visual" style={{ position: 'relative', display:'flex', alignItems:'center', justifyContent:'center', padding:60, animation: 'slideRight 1s ease-out' }}>
           <div style={{ position:'relative', width:'100%', height:'80vh', borderRadius:40, overflow:'hidden', boxShadow:`0 40px 100px rgba(0,0,0,0.5)`, border:`1px solid ${C.border}` }}>
             {product.image_url ? (
               <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             ) : (
               <div style={{ height:'100%', background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center', color:themeColor, opacity:0.1 }}>
                 <Package size={200} />
               </div>
             )}
             
             {/* Category Float */}
             <div style={{ position:'absolute', top:40, left:40 }}>
                <Pill bg="rgba(0,0,0,0.6)" color="#fff">{product.category || 'ARTISANAT'}</Pill>
             </div>
           </div>
        </div>

        {/* Right: Product Info */}
        <div className="prod-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '120px 80px 80px', animation: 'slideLeft 1s ease-out' }}>
           <div style={{ maxWidth: 550, width:'100%' }}>
              <div style={{ display:'flex', alignItems:'center', gap:15, marginBottom:20 }}>
                 <Sparkles size={18} color={themeColor} />
                 <span style={{ fontSize: 13, letterSpacing: 4, fontWeight:800, color: themeColor }}>PIÈCE D'EXCEPTION</span>
              </div>
              
              <h1 className="prod-title" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(40px, 5vw, 72px)', margin: '0 0 20px 0', fontWeight:900, lineHeight: 1.1 }}>{product.name}</h1>
              
              <Ornament />

              <div style={{ fontSize: 36, fontWeight: 900, color:themeColor, marginBottom: 40, fontFamily:"'Playfair Display', serif" }}>
                 {product.price} <span style={{fontSize:16, fontWeight:400, color:C.muted}}>MAD</span>
              </div>
              
              <p style={{ fontSize: 18, lineHeight: 1.8, color:C.muted, marginBottom: 50 }}>
                {product.description || "Un chef-d'œuvre de l'artisanat marocain, façonné avec passion et dévouement. Cette pièce unique capture l'essence même de notre patrimoine séculaire."}
              </p>

              <div style={{ display:'flex', alignItems:'center', gap:40, marginBottom:50 }}>
                 <div>
                    <div style={{ fontSize:12, fontWeight:800, color:themeColor, letterSpacing:2, marginBottom:15 }}>QUANTITÉ</div>
                    <div style={{ display:'flex', alignItems:'center', gap:25, background:C.surface, padding:'10px 25px', borderRadius:20, border:`1px solid ${C.border}` }}>
                       <Minus size={18} onClick={() => setQty(q => Math.max(1, q-1))} style={{ cursor:'pointer', opacity: qty > 1 ? 1 : 0.2 }} />
                       <span style={{ fontSize:20, fontWeight:900, width:30, textAlign:'center' }}>{qty}</span>
                       <Plus size={18} onClick={() => setQty(q => q+1)} style={{ cursor:'pointer' }} />
                    </div>
                 </div>
              </div>

              <GoldBtn 
                onClick={handleAdd}
                style={{ width: '100%', padding: '24px 0', fontSize:16, background: themeColor }}
              >
                {added ? 'PIÈCE AJOUTÉE AU PANIER' : 'ACQUÉRIR CETTE PIÈCE'}
              </GoldBtn>

              {/* Trust Indicators */}
              <div style={{ marginTop: 50, display: 'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                 <Glass style={{ padding:'15px 20px', display:'flex', alignItems:'center', gap:12, borderRadius:15 }}>
                    <Truck size={20} color={themeColor} />
                    <div style={{ fontSize:11, fontWeight:700 }}>LIVRAISON ROYALE</div>
                 </Glass>
                 <Glass style={{ padding:'15px 20px', display:'flex', alignItems:'center', gap:12, borderRadius:15 }}>
                    <ShieldCheck size={20} color={themeColor} />
                    <div style={{ fontSize:11, fontWeight:700 }}>PAIEMENT SÉCURISÉ</div>
                 </Glass>
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
