import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { C, Card, Ornament, ZelligeBg, Pill, Spinner } from '../../components/UI'
import { exploreMarketplace, likeProduct } from '../../api/services'

export default function GlobalFeed() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    exploreMarketplace()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleLike = async (id) => {
    try {
      const res = await likeProduct(id)
      setData({
        ...data,
        trending_products: data.trending_products.map(p => 
          p.id === id ? { ...p, likes_count: res.data.likes_count } : p
        )
      })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ background:C.bg, minHeight:'100vh', paddingBottom:120, fontFamily: "'Outfit', sans-serif" }}>
      
      {/* ── Exploratory Hero ── */}
      <div style={{ position:'relative', padding:'120px 20px', textAlign:'center', background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom:`1px solid ${C.border}`, overflow:'hidden' }}>
        <ZelligeBg opacity={0.12} />
        
        {/* Glows */}
        <div style={{ position:'absolute', top:'-10%', right:'20%', width:400, height:400, background:C.emerald, filter:'blur(150px)', opacity:0.1 }} />
        <div style={{ position:'absolute', bottom:'-10%', left:'20%', width:300, height:300, background:C.gold, filter:'blur(120px)', opacity:0.05 }} />

        <div style={{ position:'relative', zIndex:1, animation: 'fadeUp 1s ease-out' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:25 }}><Ornament /></div>
          <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(2.5rem, 6vw, 4rem)', color:'#fff', margin:0, fontWeight:900, letterSpacing:'-1px' }}>
            L'Excellence du <span style={{ color:C.emerald }}>SOUK ✦</span>
          </h1>
          <p style={{ color:C.muted, fontSize:20, marginTop:15, letterSpacing:1.5, fontWeight:300, maxWidth:800, margin:'15px auto 40px' }}>
            Découvrez une sélection curatée d'artisanat, de mode et de créations marocaines d'élite.
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:15, flexWrap:'wrap' }}>
            {['Artisanat', 'Mode', 'Design', 'Gastronomie'].map(type => (
              <Pill key={type} color={C.gold} bg={`${C.gold}10`}>{type}</Pill>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1400, margin:'0 auto', padding:'80px 40px' }}>
        
        {/* ── Featured Curators (Stores) ── */}
        <section style={{ marginBottom:100 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40 }}>
             <div>
                <h2 style={{ color:'#fff', fontFamily:"'Playfair Display', serif", fontSize:32, margin:0, fontWeight:900 }}>Boutiques d'Exception</h2>
                <p style={{ color:C.muted, fontSize:14, marginTop:8 }}>Les créateurs les plus influents du moment</p>
             </div>
             <div style={{ height:1, flex:1, background:C.border, margin:'0 40px 15px', opacity:0.5 }} className="hide-mobile" />
          </div>

          <div className="responsive-grid" style={{ gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:25 }}>
            {data.featured_stores.map(store => (
              <Link key={store.id} to={`/store/${store.store_slug}`} style={{ textDecoration:'none' }}>
                <Card hover style={{ textAlign:'center', padding:40, background:C.surface, border:`1px solid ${C.border}` }}>
                  <div style={{ width:80, height:80, borderRadius:28, background:C.surface2, margin:'0 auto 25px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, border:`1px solid ${C.emerald}30`, color: C.emerald, fontWeight:900, boxShadow:`0 10px 25px rgba(0,0,0,0.2)` }}>
                    {store.shop_name[0]}
                  </div>
                  <div style={{ color:'#fff', fontWeight:800, fontSize:18, marginBottom:8 }}>{store.shop_name}</div>
                  <Pill color={C.emerald} bg={`${C.emerald}10`}>{store.vendor_type}</Pill>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Trending Masterpieces ── */}
        <section>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:40 }}>
             <div>
                <h2 style={{ color:'#fff', fontFamily:"'Playfair Display', serif", fontSize:32, margin:0, fontWeight:900 }}>Tendances du Moment</h2>
                <p style={{ color:C.muted, fontSize:14, marginTop:8 }}>Pièces uniques sélectionnées pour leur excellence</p>
             </div>
             <div style={{ height:1, flex:1, background:C.border, margin:'0 40px 15px', opacity:0.5 }} className="hide-mobile" />
          </div>

          <div className="responsive-grid">
            {data.trending_products.map(product => (
              <ProductCard key={product.id} product={product} onLike={() => handleLike(product.id)} />
            ))}
          </div>
        </section>

      </div>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}

function ProductCard({ product, onLike }) {
  return (
    <Card hover style={{ padding:0, overflow:'hidden', display:'flex', flexDirection:'column', height:'100%', background:C.surface, border:`1px solid ${C.border}` }}>
       <div style={{ height:320, background:C.surface2, position:'relative', overflow:'hidden' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'0.8s cubic-bezier(0.23, 1, 0.32, 1)' }} />
          ) : (
            <div style={{ color:C.gold, opacity:0.2, height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:80 }}>📦</div>
          )}
          
          {/* Like Overlay */}
          <div 
            onClick={(e) => { e.preventDefault(); onLike(); }}
            style={{ position:'absolute', top:25, right:25, background:'rgba(10,10,10,0.8)', backdropFilter:'blur(12px)', padding:'8px 16px', borderRadius:100, color:C.gold, fontSize:12, cursor:'pointer', border:`1px solid ${C.gold}40`, zIndex:10, fontWeight:900, display:'flex', alignItems:'center', gap:8 }}
          >
            <span style={{ fontSize:16 }}>❤️</span> {product.likes_count || 0}
          </div>

          {/* Price Tag */}
          <div style={{ position:'absolute', bottom:25, left:25, background:C.emerald, color:'#fff', padding:'8px 18px', borderRadius:100, fontWeight:900, fontSize:14, boxShadow:`0 10px 20px ${C.emerald}40` }}>
             {product.price} <span style={{ fontSize:10, opacity:0.8 }}>MAD</span>
          </div>
       </div>

       <div style={{ padding:30, flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:10, marginBottom:15 }}>
               <h3 style={{ margin:0, fontSize:22, color:'#fff', fontWeight:800, lineHeight:1.2, fontFamily: "'Outfit', sans-serif" }}>{product.name}</h3>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
               <div style={{ width:24, height:24, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, color:C.emerald, fontWeight:900 }}>{product.vendor?.shop_name[0]}</div>
               <div style={{ fontSize:12, color:C.muted, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>{product.vendor?.shop_name}</div>
            </div>
            
            <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, margin:'0 0 30px', fontWeight:300, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {product.description || "Une création d'exception alliant savoir-faire traditionnel et design contemporain."}
            </p>
          </div>
          
          <Link to={`/store/${product.vendor?.store_slug}/product/${product.id}`} style={{ textDecoration:'none' }}>
             <button style={{ 
               width:'100%', background:'transparent', border:`1px solid ${C.border}`, color:C.text, 
               padding:'16px 0', borderRadius:16, cursor:'pointer', fontSize:12, fontWeight:800, 
               letterSpacing:1.5, transition:'0.4s', textTransform:'uppercase'
             }}
             onMouseOver={e => { e.target.style.background = C.emerald; e.target.style.borderColor = C.emerald; e.target.style.color = '#fff'; e.target.style.transform='translateY(-4px)'; e.target.style.boxShadow=`0 10px 25px ${C.emerald}30`; }}
             onMouseOut={e => { e.target.style.background = 'transparent'; e.target.style.borderColor = C.border; e.target.style.color = C.text; e.target.style.transform='translateY(0)'; e.target.style.boxShadow='none'; }}
             >
               Explorer la Création
             </button>
          </Link>
       </div>
    </Card>
  )
}
