import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, deleteProduct } from '../../api/services'
import { C, GoldBtn, Spinner, Ornament } from '../../components/UI'

const CATS = ['Tous','Artisanat','Maroquinerie','Céramique','Textile']

export default function Products() {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState('Tous')

  const load = () => {
    setLoading(true)
    getProducts({ search, category: filter === 'Tous' ? '' : filter })
      .then(r => setProducts(r.data.data ?? r.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [search, filter])

  const handleDelete = async (id, name) => {
    if (!confirm(`Supprimer "${name}" ?`)) return
    await deleteProduct(id)
    load()
  }

  return (
    <div style={{ paddingBottom:16, animation:'fadeUp .35s ease' }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ padding:'20px clamp(16px, 3vw, 32px) 0' }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, marginBottom:18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span>Mes <span style={{ color:C.gold }}>Produits</span></span>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Limite Forfait Gratuit</div>
            <div style={{ width: 120, height: 6, background: C.surface2, borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${Math.min((products.length / 9) * 100, 100)}%`, background: products.length >= 9 ? C.danger : `linear-gradient(90deg, ${C.teal}, ${C.tealL})`, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ fontSize: 10, color: products.length >= 9 ? C.danger : C.muted, marginTop: 4 }}>{products.length} / 9 produits</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ position:'relative', marginBottom:12 }}>
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:C.muted, fontSize:14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Chercher un produit…"
            style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12,
              padding:'12px 14px 12px 40px', color:C.text, fontFamily:"'DM Sans',sans-serif",
              fontSize:13, outline:'none', transition:'border .2s' }}
            onFocus={e=>e.target.style.borderColor=C.gold}
            onBlur={e=>e.target.style.borderColor=C.border}
          />
        </div>

        {/* Category filters */}
        <div style={{ display:'flex', gap:7, overflowX:'auto', paddingBottom:4 }}>
          {CATS.map(c => (
            <button key={c} onClick={() => setFilter(c)} style={{
              flexShrink:0, cursor:'pointer', fontFamily:"'DM Sans',sans-serif",
              background: filter===c ? `linear-gradient(135deg,${C.gold},${C.copper})` : 'transparent',
              border: `1px solid ${filter===c ? C.gold : C.border}`,
              borderRadius:20, padding:'6px 14px', fontSize:11,
              fontWeight: filter===c ? 600 : 400,
              color: filter===c ? C.bg : C.muted, transition:'all .2s',
            }}>{c}</button>
          ))}
        </div>
      </div>

      <Ornament />

      {/* List */}
      <div style={{ padding:'0 clamp(16px, 3vw, 32px)' }}>
        {loading ? <Spinner /> : products.length === 0 ? (
          <div style={{ textAlign:'center', color:C.muted, padding:'40px 0',
            fontFamily:"'Cormorant Garamond',serif", fontSize:18 }}>Aucun produit ◇</div>
        ) : products.map((p, i) => (
          <div key={p.id} style={{
            background:C.surface, border:`1px solid ${C.border}`, borderRadius:16,
            padding:14, marginBottom:10, transition:'border .2s',
            animation:`fadeUp .28s ease ${i*0.05}s both`,
          }}
          onMouseOver={e=>e.currentTarget.style.borderColor=C.borderH}
          onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{ display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:52, height:52, borderRadius:12, background:'rgba(201,168,76,0.08)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0, overflow: 'hidden' }}>
                {p.emoji?.startsWith('http') || p.image_url ? (
                  <img src={p.emoji?.startsWith('http') ? p.emoji : p.image_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: 24, opacity: 0.3 }}>📦</div>
                )}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:500, whiteSpace:'nowrap',
                  overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:2, letterSpacing:1, textTransform:'uppercase' }}>
                  {p.category}
                </div>
                <div style={{ display:'flex', gap:12, marginTop:6 }}>
                  <span style={{ fontSize:10, color: p.stock <= 3 ? C.danger : C.tealL }}>
                    ● {p.stock} en stock
                  </span>
                  <span style={{ fontSize:10, color:C.muted }}>↑ {p.sold} vendus</span>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:18, fontWeight:700, color:C.goldL }}>
                  {p.price}
                </div>
                <div style={{ fontSize:10, color:C.muted }}>MAD</div>
                <div style={{ display:'flex', gap:6, marginTop:6, justifyContent:'flex-end' }}>
                  <button onClick={() => navigate(`/products/${p.id}`)} style={{
                    background:'transparent', border:`1px solid ${C.border}`, borderRadius:8,
                    padding:'3px 8px', fontSize:10, color:C.gold, cursor:'pointer' }}>Éditer</button>
                  <button onClick={() => handleDelete(p.id, p.name)} style={{
                    background:'transparent', border:`1px solid ${C.danger}40`, borderRadius:8,
                    padding:'3px 8px', fontSize:10, color:C.danger, cursor:'pointer' }}>✕</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:'8px clamp(16px, 3vw, 32px) 0' }}>
        <GoldBtn onClick={() => navigate('/products/new')}>✦ Ajouter un produit</GoldBtn>
      </div>
    </div>
  )
}
