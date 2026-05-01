import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { ArrowLeft, ShoppingBag, Trash2, Minus, Plus, Package, Shirt, Sparkles, Lamp, Footprints, Utensils, Coffee, ShieldCheck, ArrowRight } from 'lucide-react'
import { C, Arch, Ornament, ZelligeBg, GoldBtn } from '../../components/UI'

const KF = `
@keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes slideIn { from { opacity:0; transform:translateX(-12px); } to { opacity:1; transform:translateX(0); } }
@media (max-width: 992px) {
  .cart-grid { grid-template-columns: 1fr !important; }
  .cart-summary { position: static !important; width: 100% !important; box-sizing: border-box; }
  .cart-item { flex-direction: column; align-items: flex-start !important; }
  .cart-item-image { width: 100% !important; height: 200px !important; }
  .cart-item-price { text-align: left !important; width: 100%; margin-top: 15px; flex-direction: row !important; justify-content: space-between; align-items: center; }
  .cart-header { padding: 15px !important; }
  .cart-header-logo { display: none !important; }
  .cart-container { padding: 40px 20px !important; }
}
`
const CAT_ICON = { 
  'Vêtements': <Shirt size={40} />, 
  'Beauté': <Sparkles size={40} />, 
  'Artisanat': <Lamp size={40} />, 
  'Chaussures': <Footprints size={40} />, 
  'Cuisine': <Utensils size={40} />, 
  'Décoration': <Package size={40} />, 
  'Alimentaire': <Coffee size={40} />, 
  default: <Package size={40} /> 
}

export default function StoreCart() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getCart, removeFromCart, updateQty, cartTotal, clearCart } = useCart()
  const items = getCart(slug)
  const total = cartTotal(slug)

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Cairo', sans-serif" }}>
      <style>{KF}</style>
      <ZelligeBg height="100%" opacity={0.03} />

      {/* ── Header ── */}
      <header className="cart-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: `${C.bg}cc`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}`, padding: '15px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(`/store/${slug}`)} style={{ background: 'none', border: `1px solid ${C.gold}30`, color: C.gold, cursor: 'pointer', fontSize: 12, fontWeight: 700, padding:'10px 20px', borderRadius:30, display:'flex', alignItems:'center', gap:8 }}>
          <ArrowLeft size={16} /> CONTINUER MES ACHATS
        </button>
        <div className="cart-header-logo" onClick={() => navigate('/')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
           <img src="/logo.png" alt="SOUK" style={{ height: 35 }} />
           <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 900, color:C.gold }}>VOTRE PANIER</span>
        </div>
        <div style={{ minWidth: 100 }} />
      </header>

      <div className="cart-container" style={{ position:'relative', zIndex:1, maxWidth: 1000, margin: '0 auto', padding: '60px 30px 100px', animation: 'fadeUp 0.6s ease-out' }}>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
            <div style={{ color:C.gold, opacity: 0.1 }}><Package size={100} /></div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, color: '#fff', fontWeight:900 }}>Votre panier est vide</h2>
            <p style={{ color: C.muted, maxWidth: 400, lineHeight: 1.8, fontSize:18 }}>Découvrez les merveilles de notre boutique et remplissez votre souk personnel.</p>
            <GoldBtn onClick={() => navigate(`/store/${slug}`)} style={{ width:'auto' }}>
               DÉCOUVRIR LES PRODUITS
            </GoldBtn>
          </div>
        ) : (
          <div className="cart-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>

            {/* ── Items List ── */}
            <div style={{ display:'flex', flexDirection:'column', gap:25 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, margin: 0, fontWeight:900 }}>
                  {items.length} Article{items.length > 1 ? 's' : ''}
                </h1>
                <button onClick={() => clearCart(slug)} style={{ background: 'none', border: 'none', color: C.danger, cursor: 'pointer', fontSize: 12, fontWeight:700, letterSpacing:1, opacity:0.6 }}>
                  VIDER LE PANIER
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {items.map((item, i) => {
                  const icon = CAT_ICON[item.category] || CAT_ICON.default
                  return (
                    <div key={item.id} className="cart-item" style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 24, padding: '20px', display: 'flex', gap: 20, alignItems: 'center', animation: `slideIn 0.4s ease-out ${i * 0.1}s both`, transition: 'all 0.3s' }}>

                      {/* Image */}
                      <div className="cart-item-image" style={{ width: 100, height: 100, background: C.surface2, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                        {item.image_url ? <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ color:C.gold, opacity:0.2 }}>{icon}</div>}
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, minWidth: 0, display:'flex', flexDirection:'column', gap:8 }}>
                        <div style={{ fontWeight: 800, fontSize: 18, color: '#fff', fontFamily:"'Playfair Display', serif" }}>{item.name}</div>
                        <div style={{ fontSize: 14, color: C.gold, fontWeight:600 }}>{item.price} MAD · unité</div>
                        
                        {/* Qty controls */}
                        <div style={{ display: 'flex', alignItems: 'center', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, width: 'fit-content', overflow: 'hidden', marginTop:5 }}>
                          <button onClick={() => item.quantity === 1 ? removeFromCart(slug, item.id) : updateQty(slug, item.id, item.quantity - 1)} style={{ width: 40, height: 40, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Minus size={16} />
                          </button>
                          <div style={{ width: 40, textAlign: 'center', fontWeight: 900, fontSize: 16, color:C.gold }}>{item.quantity}</div>
                          <button onClick={() => updateQty(slug, item.id, item.quantity + 1)} style={{ width: 40, height: 40, background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Price + remove */}
                      <div className="cart-item-price" style={{ textAlign: 'right', flexShrink: 0, display:'flex', flexDirection:'column', gap:10 }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, color: '#fff' }}>{(item.price * item.quantity).toLocaleString()} MAD</div>
                        <button onClick={() => removeFromCart(slug, item.id)} style={{ background: 'none', border: `1px solid ${C.danger}40`, color: C.danger, padding:'8px', borderRadius:12, cursor: 'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                           <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── Order Summary ── */}
            <div className="cart-summary" style={{ position: 'sticky', top: 100 }}>
              <div style={{ background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`, border: `2px solid ${C.gold}30`, borderRadius: 30, padding: '30px', animation: 'fadeUp 0.6s ease-out 0.2s both', boxShadow:`0 20px 50px rgba(0,0,0,0.3)` }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 900, marginBottom: 25, color:'#fff' }}>RÉCAPITULATIF</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 15, marginBottom: 25 }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: C.muted }}>
                      <span>Sous-total</span><span style={{fontWeight:700, color:C.text}}>{total.toLocaleString()} MAD</span>
                   </div>
                   <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: C.muted }}>
                      <span>Livraison</span><span style={{ color: C.emeraldL, fontWeight:800 }}>GRATUITE</span>
                   </div>
                </div>

                <div style={{ height: 1, background: `linear-gradient(90deg, ${C.gold}40 0%, transparent 100%)`, margin: '20px 0' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 30 }}>
                  <span style={{ fontWeight: 800, fontSize:18, color:'#fff' }}>TOTAL</span>
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: C.gold }}>{total.toLocaleString()} MAD</span>
                </div>

                <GoldBtn onClick={() => navigate(`/store/${slug}/checkout`)} style={{ width: '100%', padding: '18px 0', fontSize: 16, display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
                  COMMANDER <ArrowRight size={20} />
                </GoldBtn>

                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 12, color: C.muted, fontWeight:600 }}>
                  <ShieldCheck size={14} /> PAIEMENT SÉCURISÉ
                </div>
              </div>
              <div style={{ marginTop:20, textAlign:'center' }}>
                 <Ornament />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
