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
    <div style={{ background:C.bg, minHeight:'100vh', paddingBottom:100 }}>
      {/* Hero Exploration */}
      <div style={{ position:'relative', padding:'80px 20px', textAlign:'center', background:C.surface, borderBottom:`1px solid ${C.border}` }}>
        <ZelligeBg height={260} />
        <div style={{ position:'relative', zIndex:1 }}>
          <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:48, color:C.gold, margin:0 }}>
            Découvrez l'Excellence du SOUK ✦
          </h1>
          <p style={{ color:C.muted, fontSize:18, marginTop:10, letterSpacing:1 }}>
            Artisanat, Mode & Créations Marocaines Originales
          </p>
          <div style={{ marginTop:30, display:'flex', justifyContent:'center', gap:10 }}>
            {['Artisan', 'Fashion', 'Product', 'Digital'].map(type => (
              <Pill key={type} color={C.goldL} bg={`${C.gold}15`}>{type}</Pill>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 20px' }}>
        
        {/* Featured Stores */}
        <section style={{ marginBottom:60 }}>
          <h2 style={{ color:C.text, fontFamily:"'Cormorant Garamond', serif", fontSize:28, marginBottom:24 }}>
            Boutiques Vedettes
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(180px, 1fr))', gap:20 }}>
            {data.featured_stores.map(store => (
              <Link key={store.id} to={`/store/${store.store_slug}`} style={{ textDecoration:'none' }}>
                <Card hover style={{ textAlign:'center', padding:24 }}>
                  <div style={{ width:60, height:60, borderRadius:'50%', background:C.surface2, margin:'0 auto 12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, border:`1px solid ${C.gold}30`, color: C.emerald }}>
                    {store.shop_name[0]}
                  </div>
                  <div style={{ color:C.text, fontWeight:600, fontSize:14 }}>{store.shop_name}</div>
                  <div style={{ color:C.muted, fontSize:10, textTransform:'uppercase', letterSpacing:1, marginTop:4 }}>{store.vendor_type}</div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Trending Products */}
        <section>
          <h2 style={{ color:C.text, fontFamily:"'Cormorant Garamond', serif", fontSize:28, marginBottom:24 }}>
            Tendances Actuelles
          </h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:30 }}>
            {data.trending_products.map(product => (
              <ProductCard key={product.id} product={product} onLike={() => handleLike(product.id)} />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

function ProductCard({ product, onLike }) {
  return (
    <Card hover style={{ padding:0, overflow:'hidden', display:'flex', flexDirection:'column' }}>
       <div style={{ height:200, background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:64, position:'relative', overflow:'hidden' }}>
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          ) : (
            product.emoji || '📦'
          )}
          <div 
            onClick={(e) => { e.preventDefault(); onLike(); }}
            style={{ position:'absolute', top:15, right:15, background:'rgba(0,0,0,0.5)', padding:'6px 10px', borderRadius:20, color:C.gold, fontSize:12, cursor:'pointer', border:`1px solid ${C.gold}40` }}
          >
            ❤️ {product.likes_count || 0}
          </div>
       </div>
       <div style={{ padding:20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
            <div>
              <h3 style={{ margin:0, fontSize:16, color:C.text }}>{product.name}</h3>
              <div style={{ fontSize:11, color:C.muted, marginTop:4 }}>par {product.vendor?.shop_name}</div>
            </div>
            <div style={{ color:C.gold, fontWeight:600 }}>{product.price} MAD</div>
          </div>
          <p style={{ color:C.muted, fontSize:13, lineHeight:1.5, margin:'15px 0' }}>
            {product.description?.substring(0, 80)}...
          </p>
          <Link to={`/store/${product.vendor?.store_slug}/product/${product.id}`}>
            <button style={{ width:'100%', background:'transparent', border:`1px solid ${C.border}`, color:C.text, padding:'10px 0', borderRadius:8, cursor:'pointer', fontSize:12, letterSpacing:1 }}>
              VOIR LE PRODUIT
            </button>
          </Link>
       </div>
    </Card>
  )
}
