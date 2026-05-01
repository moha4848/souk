import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShoppingBag, Package } from 'lucide-react'
import { C, Card, Ornament, ZelligeBg, Spinner, Arch, GoldBtn, Pill, Glass } from '../../components/UI'
import { getStoreProducts, followStore } from '../../api/services'
import { useCart } from '../../context/CartContext'

const keyframes = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cairo:wght@400;700;900&display=swap');
@keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@media (max-width: 768px) {
  .store-header { height: auto !important; padding: 120px 20px 60px !important; }
  .store-nav { left: 20px !important; right: 20px !important; flex-direction: column; gap: 15px; align-items: flex-start !important; }
  .store-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important; gap: 20px !important; }
  .store-arch { padding: 30px 20px !important; width: 100%; box-sizing: border-box; }
}
`

export default function StoreFront() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart, cartCount } = useCart()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  const count = cartCount(slug)

  useEffect(() => {
    getStoreProducts(slug)
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [slug])

  const handleFollow = async () => {
    try {
      const res = await followStore(data.vendor.id)
      setIsFollowing(res.data.is_following)
      setData({ ...data, vendor: { ...data.vendor, followers_count: res.data.follower_count } })
    } catch (err) { console.error(err) }
  }

  if (loading) return <Spinner />
  if (!data || !data.vendor) return (
    <div style={{ background:C.bg, minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:C.text }}>
       <h2 style={{ fontFamily:"'Playfair Display',serif" }}>Boutique Introuvable</h2>
       <GoldBtn onClick={() => navigate('/')} style={{ width:'auto', marginTop:20 }}>RETOUR À L'ACCUEIL</GoldBtn>
    </div>
  )

  const { vendor: store, products } = data
  const themeColor = store.theme_settings?.primaryColor || C.gold
  const themeBg = store.theme_settings?.backgroundColor || C.bg

  return (
    <div style={{ background:themeBg, minHeight:'100vh', color:C.text, fontFamily:"'Cairo', sans-serif" }}>
      <style>{keyframes}</style>
      
      {/* ── Store Header ── */}
      <section className="store-header" style={{ 
        height: 450, position: 'relative', overflow: 'hidden', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`
      }}>
        <ZelligeBg opacity={0.1} />
        
        {/* Nav Overlays */}
        <div className="store-nav" style={{ position:'absolute', top:30, left:40, right:40, display:'flex', justifyContent:'space-between', zIndex:100, alignItems:'center' }}>
           <button onClick={() => navigate('/')} style={{ background:'none', border:`1px solid ${themeColor}40`, color:themeColor, padding:'10px 20px', borderRadius:30, cursor:'pointer', fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
              <ArrowLeft size={16} /> ACCUEIL
           </button>
           <button onClick={() => navigate(`/store/${slug}/cart`)} style={{ background:themeColor, color:'#000', padding:'10px 24px', borderRadius:30, border:'none', fontWeight:900, cursor:'pointer', boxShadow:`0 10px 30px ${themeColor}40`, display:'flex', alignItems:'center', gap:10 }}>
             <ShoppingBag size={18} /> PANIER ({count})
           </button>
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', animation: 'slideUp 1s ease-out', width:'100%', maxWidth:600 }}>
           <Arch className="store-arch" style={{ padding: '40px 60px' }}>
              <Pill bg={`${C.gold}15`}>BOUTIQUE VÉRIFIÉE</Pill>
              <h1 style={{ 
                fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', 
                margin: '15px 0', fontWeight: 900, color: '#fff' 
              }}>
                {store.shop_name}
              </h1>
              <Ornament />
              <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:20 }}>
                 <GoldBtn onClick={handleFollow} style={{ width:'auto', padding:'10px 30px', fontSize:12, background: themeColor }}>
                   {isFollowing ? '✓ ABONNÉ' : '+ S\'ABONNER'}
                 </GoldBtn>
                 <Glass style={{ padding:'10px 20px', borderRadius:30, fontSize:13, fontWeight:700, color:themeColor }}>
                   {store.followers_count || 0} SUIVEURS
                 </Glass>
              </div>
           </Arch>
        </div>
      </section>

      {/* ── Product Catalog ── */}
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '100px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
           <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: '#fff' }}>Nos Créations</h2>
           <div style={{ width:60, height:3, background:C.gold, margin:'20px auto' }} />
        </div>

        <div className="store-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 40 }}>
          {products.map((product, i) => (
            <Card key={product.id} hover onClick={() => navigate(`/store/${slug}/product/${product.id}`)} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 350, background: C.surface2, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ color:C.gold, opacity: 0.2 }}><Package size={60} /></div>
                )}
                <div style={{ position: 'absolute', bottom: 20, left: 20, background: 'rgba(0,0,0,0.8)', color: themeColor, padding: '8px 18px', borderRadius: 15, fontWeight: 900, fontSize: 18, border: `1px solid ${themeColor}40` }}>
                  {product.price} MAD
                </div>
              </div>
              
              <div style={{ padding: 25, display:'flex', flexDirection:'column', gap:12 }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: 0, color: '#fff' }}>{product.name}</h3>
                <p style={{ color: C.muted, margin: 0, fontSize: 14, lineHeight: 1.6 }}>{product.description?.substring(0, 80)}...</p>
                <GoldBtn style={{ marginTop: 10 }}>DÉCOUVRIR</GoldBtn>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <footer style={{ padding: '80px 40px', borderTop: `1px solid ${C.border}`, textAlign: 'center', background: C.surface }}>
         <div style={{ fontSize: 24, fontWeight: 900, color: C.gold, fontFamily: "'Playfair Display', serif" }}>{store.shop_name.toUpperCase()}</div>
         <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, marginTop:15 }}>
            <span style={{ color: C.muted }}>Propulsé par</span>
            <img src="/logo.png" alt="SOUK" style={{ height: 25 }} />
         </div>
      </footer>
    </div>
  )
}
