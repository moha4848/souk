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
    <div style={{ background:themeBg, minHeight:'100vh', color:C.text, fontFamily:"'Outfit', sans-serif" }}>
      <style>{keyframes}</style>
      
      {/* ── High-End Store Header ── */}
      <section className="store-header" style={{ 
        height: 500, position: 'relative', overflow: 'hidden', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: `linear-gradient(180deg, ${C.surface} 0%, ${themeBg} 100%)`
      }}>
        <ZelligeBg opacity={0.15} />
        
        {/* Glow Effects */}
        <div style={{ position:'absolute', top:'-10%', right:'-10%', width:500, height:500, background:themeColor, filter:'blur(180px)', opacity:0.1 }} />

        {/* Floating Navigation */}
        <div className="store-nav" style={{ position:'absolute', top:40, left:60, right:60, display:'flex', justifyContent:'space-between', zIndex:100, alignItems:'center' }}>
           <button onClick={() => navigate('/')} style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(10px)', border:`1px solid ${C.border}`, color:'#fff', padding:'12px 24px', borderRadius:100, cursor:'pointer', fontWeight:800, display:'flex', alignItems:'center', gap:10, fontSize:12, letterSpacing:1 }} onMouseOver={e=>e.target.style.borderColor=themeColor}>
              <ArrowLeft size={18} /> RETOUR
           </button>
           <button onClick={() => navigate(`/store/${slug}/cart`)} style={{ background:themeColor, color:'#000', padding:'12px 28px', borderRadius:100, border:'none', fontWeight:900, cursor:'pointer', boxShadow:`0 15px 35px ${themeColor}40`, display:'flex', alignItems:'center', gap:12, fontSize:13 }}>
             <ShoppingBag size={20} /> PANIER <span style={{ background:'rgba(0,0,0,0.1)', padding:'2px 8px', borderRadius:8, fontSize:11 }}>{count}</span>
           </button>
        </div>

        <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', animation: 'slideUp 1s cubic-bezier(0.23, 1, 0.32, 1)', width:'100%', maxWidth:700 }}>
           <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}><Ornament /></div>
           <Pill color={themeColor} bg={`${themeColor}15`}>BOUTIQUE CERTIFIÉE SOUK ✦</Pill>
           
           <h1 style={{ 
             fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 7vw, 5.5rem)', 
             margin: '25px 0', fontWeight: 900, color: '#fff', letterSpacing:'-2px', lineHeight:1.1
           }}>
             {store.shop_name}
           </h1>
           
           <div style={{ display:'flex', justifyContent:'center', gap:25, marginTop:40 }}>
              <button 
                onClick={handleFollow} 
                style={{ 
                  background: isFollowing ? 'transparent' : themeColor,
                  color: isFollowing ? themeColor : '#000',
                  border: isFollowing ? `2px solid ${themeColor}` : 'none',
                  padding: '16px 40px', borderRadius: 100, fontWeight: 900, cursor: 'pointer',
                  fontSize: 13, letterSpacing: 1, transition: '0.4s',
                  boxShadow: isFollowing ? 'none' : `0 15px 30px ${themeColor}30`
                }}
                onMouseOver={e => !isFollowing && (e.target.style.transform='translateY(-4px)')}
                onMouseOut={e => e.target.style.transform='translateY(0)'}
              >
                {isFollowing ? '✓ ABONNÉ' : '+ S\'ABONNER'}
              </button>
              
               <div style={{ 
                 padding:'14px 28px', borderRadius:100, background:'rgba(255,255,255,0.03)', 
                 backdropFilter:'blur(10px)', border:`1px solid ${C.border}`, 
                 display:'flex', alignItems:'center', gap:10 
               }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:themeColor, boxShadow:`0 0 10px ${themeColor}` }} />
                  <span style={{ fontSize:14, fontWeight:800, color:'#fff' }}>{store.followers_count || 0}</span>
                  <span style={{ fontSize:11, color:C.muted, textTransform:'uppercase', letterSpacing:1 }}>Suiveurs</span>
               </div>
           </div>
        </div>
      </section>

      {/* ── Product Catalog Grid ── */}
      <div style={{ maxWidth: 1500, margin: '0 auto', padding: '120px 40px' }}>
        <div style={{ display:'flex', alignItems:'flex-end', gap:20, marginBottom:80 }}>
           <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 42, color: '#fff', margin:0, fontWeight:900 }}>Nos Créations</h2>
           <div style={{ height:1, flex:1, background:C.border, marginBottom:15, opacity:0.5 }} />
           <Pill color={themeColor} bg={`${themeColor}10`}>{products.length} ARTICLES</Pill>
        </div>

        <div className="responsive-grid">
          {products.map((product, i) => (
            <Card key={product.id} hover onClick={() => navigate(`/store/${slug}/product/${product.id}`)} style={{ padding: 0, overflow: 'hidden', background: C.surface, border:`1px solid ${C.border}` }}>
              <div style={{ height: 400, background: C.surface2, position: 'relative', overflow:'hidden' }}>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition:'0.8s cubic-bezier(0.23, 1, 0.32, 1)' }} />
                ) : (
                  <div style={{ color:themeColor, opacity: 0.15, height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}><Package size={80} /></div>
                )}
                
                {/* Price Tag Overlay */}
                <div style={{ 
                  position: 'absolute', top: 25, right: 25, background: 'rgba(10,10,10,0.8)', 
                  backdropFilter: 'blur(12px)', color: themeColor, padding: '10px 22px', 
                  borderRadius: 100, fontWeight: 900, fontSize: 18, border: `1px solid ${themeColor}40` 
                }}>
                  {product.price} <span style={{ fontSize:11, opacity:0.6 }}>MAD</span>
                </div>
              </div>
              
              <div style={{ padding: 35, display:'flex', flexDirection:'column', gap:20 }}>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 24, margin: 0, color: '#fff', fontWeight:800 }}>{product.name}</h3>
                <p style={{ color: C.muted, margin: 0, fontSize: 14, lineHeight: 1.7, fontWeight:300, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {product.description || "Une pièce d'exception conçue avec passion et savoir-faire traditionnel."}
                </p>
                <button style={{ 
                  marginTop: 15, width:'100%', padding:'16px', borderRadius:16, border:`1px solid ${C.border}`,
                  background:'transparent', color:'#fff', fontSize:12, fontWeight:800, letterSpacing:1.5,
                  transition:'0.4s', textTransform:'uppercase', cursor:'pointer'
                }}
                onMouseOver={e=>{e.target.style.background=themeColor; e.target.style.borderColor=themeColor; e.target.style.color='#000'; e.target.style.transform='translateY(-4px)'; e.target.style.boxShadow=`0 10px 25px ${themeColor}30`}}
                onMouseOut={e=>{e.target.style.background='transparent'; e.target.style.borderColor=C.border; e.target.style.color='#fff'; e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none'}}
                >
                  Détails de l'article
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Store Footer ── */}
      <footer style={{ padding: '120px 40px', borderTop: `1px solid ${C.border}`, textAlign: 'center', background: '#050505' }}>
         <div style={{ fontSize: 32, fontWeight: 900, color: themeColor, fontFamily: "'Playfair Display', serif", letterSpacing:-1 }}>{store.shop_name.toUpperCase()}</div>
         <p style={{ color:C.muted, fontSize:14, marginTop:15, maxWidth:500, margin:'15px auto' }}>L'excellence marocaine, livrée chez vous avec passion et authenticité.</p>
         <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:15, marginTop:40, opacity:0.6 }}>
            <span style={{ fontSize:11, color: C.muted, letterSpacing:1, fontWeight:800 }}>PROPULSÉ PAR</span>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
               <img src="/logo.png" alt="SOUK" style={{ height: 28 }} />
               <span style={{ color:'#fff', fontWeight:900, fontSize:16, letterSpacing:-0.5 }}>SOUK<span style={{ color:C.emerald }}>✦</span></span>
            </div>
         </div>
      </footer>
    </div>
  )
}
