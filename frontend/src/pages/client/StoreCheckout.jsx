import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useClientAuth } from '../../context/ClientAuthContext'
import { Banknote, CreditCard, Package, ArrowLeft } from 'lucide-react'
import { C, FieldInput, Spinner, GoldBtn, Arch, Ornament, ZelligeBg, Glass, Pill } from '../../components/UI'
import { placeOrder, getStoreProducts } from '../../api/services'

const KF = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cairo:wght@400;700&display=swap');
@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
@media (max-width: 992px) {
  .checkout-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
  .checkout-summary { position: static !important; }
  .checkout-header { padding: 15px 20px !important; }
  .checkout-header-back { display: none !important; }
  .checkout-form-row { grid-template-columns: 1fr !important; gap: 10px !important; }
  .checkout-container { padding: 40px 20px !important; }
}
`

const CITIES = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Oujda', 'Meknès', 'Témara', 'Kénitra', 'Autre']

export default function StoreCheckout() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getCart, cartTotal, clearCart } = useCart()
  const { client } = useClientAuth()
  
  const [vendorData, setVendorData] = useState(null)
  const items = getCart(slug)
  const total = cartTotal(slug)
  const [loading, setLoading] = useState(false)
  const [fetchingStore, setFetchingStore] = useState(true)
  const [error, setError] = useState('')

  const [form, setForm] = useState({ 
    client_name: client ? client.name : '', 
    client_phone: '', 
    shipping_address: '', 
    shipping_city: 'Casablanca', 
    payment_method: 'cod', 
    delivery_method: 'standard',
    notes: '',
    points_to_use: 0
  })

  useEffect(() => {
    getStoreProducts(slug).then(res => {
      setVendorData(res.data.vendor)
      if (res.data.vendor.checkout_settings) {
        setForm(prev => ({
          ...prev,
          payment_method: res.data.vendor.checkout_settings.default_payment || 'cod'
        }))
      }
    })
    .catch(() => setError("Impossible de charger les informations."))
    .finally(() => setFetchingStore(false))
  }, [slug])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const finalTotal = total // Simplified for now

  if (items.length === 0 && !loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 30, color: C.text }}>
        <div style={{ color:C.gold, opacity: 0.2 }}><Package size={80} /></div>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32 }}>Votre panier est vide</h2>
        <GoldBtn onClick={() => navigate(`/store/${slug}`)} style={{ width: 'auto' }}>RETOUR À LA BOUTIQUE</GoldBtn>
      </div>
    )
  }

  if (fetchingStore) return <Spinner />

  const submit = async (e) => {
    e.preventDefault()
    if (!form.client_name || !form.client_phone || !form.shipping_address) return setError('Champs obligatoires manquants.')
    
    setError(''); setLoading(true)
    try {
      const payload = {
        store_id: vendorData.id,
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
        ...form
      }
      const r = await placeOrder(payload)
      clearCart(slug)
      navigate(`/store/${slug}/order/${r.data.order.order_number}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la commande.')
    } finally {
      setLoading(false)
    }
  }

  const ok = form.client_name && form.client_phone && form.shipping_address
  const themeGold = vendorData?.theme_settings?.primaryColor || C.gold

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Cairo', sans-serif" }}>
      <style>{KF}</style>
      <ZelligeBg opacity={0.03} />

      {/* ── Header ── */}
      <header className="checkout-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: `${C.bg}cc`, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}`, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="checkout-header-back" onClick={() => navigate(`/store/${slug}/cart`)} style={{ cursor: 'pointer', fontSize: 12, fontWeight: 800, color: themeGold, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 8 }}><ArrowLeft size={16} /> RETOUR AU PANIER</div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900 }}>FINALISER MA COMMANDE</div>
        <div style={{ width: 100 }} />
      </header>

      <form onSubmit={submit}>
        <div className="checkout-grid checkout-container" style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 30px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 60, animation: 'slideUp 0.8s ease-out' }}>
          
          {/* Left: Shipping & Payment */}
          <div style={{ display:'flex', flexDirection:'column', gap:40 }}>
             <section>
                <div style={{ display:'flex', alignItems:'center', gap:15, marginBottom:30 }}>
                   <div style={{ width:30, height:30, background:themeGold, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontWeight:900 }}>1</div>
                   <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin:0 }}>Informations de Livraison</h3>
                </div>
                
                <Glass style={{ padding:'20px 30px' }}>
                   <div className="checkout-form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                      <FieldInput label="Nom Complet" value={form.client_name} onChange={set('client_name')} placeholder="M. Mohamed Alami" />
                      <FieldInput label="Téléphone" value={form.client_phone} onChange={set('client_phone')} placeholder="06 00 00 00 00" />
                   </div>
                   <FieldInput label="Adresse de Livraison" value={form.shipping_address} onChange={set('shipping_address')} placeholder="N° 45, Rue des Oudayas..." />
                   
                   <div className="checkout-form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginTop:20 }}>
                      <div>
                        <div style={{ fontSize:12, color:themeGold, fontWeight:800, marginBottom:10, letterSpacing:1 }}>VILLE</div>
                        <select value={form.shipping_city} onChange={set('shipping_city')} style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:16, padding:'16px', color:'#fff', outline:'none' }}>
                           {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <FieldInput label="Notes (Optionnel)" value={form.notes} onChange={set('notes')} placeholder="Ex: Près de la mosquée..." />
                   </div>
                </Glass>
             </section>

             <section>
                <div style={{ display:'flex', alignItems:'center', gap:15, marginBottom:30 }}>
                   <div style={{ width:30, height:30, background:themeGold, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', color:'#000', fontWeight:900 }}>2</div>
                   <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, margin:0 }}>Méthode de Paiement</h3>
                </div>
                                <div className="checkout-form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                   {[
                     { id: 'cod', name: 'Cash à la Livraison', icon: <Banknote size={32} />, desc: 'Payez à la réception' },
                     { id: 'online', name: 'Paiement Sécurisé', icon: <CreditCard size={32} />, desc: 'Bientôt disponible' }
                   ].map(m => (
                     <div 
                       key={m.id}
                       onClick={() => m.id === 'cod' && setForm({...form, payment_method: m.id})}
                       style={{ 
                         padding:30, borderRadius:24, border: `2px solid ${form.payment_method === m.id ? themeGold : C.border}`,
                         background: form.payment_method === m.id ? `${themeGold}10` : C.surface,
                         cursor: m.id === 'cod' ? 'pointer' : 'not-allowed', opacity: m.id === 'online' ? 0.5 : 1,
                         transition:'all 0.3s'
                       }}>
                       <div style={{ marginBottom:10, color: form.payment_method === m.id ? themeGold : C.muted }}>{m.icon}</div>
                       <div style={{ fontWeight:800, fontSize:16, color: form.payment_method === m.id ? themeGold : '#fff' }}>{m.name}</div>
                       <div style={{ fontSize:12, color:C.muted, marginTop:5 }}>{m.desc}</div>
                     </div>
                   ))}
                </div>
             </section>
          </div>

          {/* Right: Summary */}
          <div className="checkout-summary" style={{ position:'sticky', top:120 }}>
             <Arch style={{ padding:40, border:`2px solid ${themeGold}40` }}>
                <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, textAlign:'center', marginBottom:30 }}>Votre Commande</h4>
                
                <div style={{ display:'flex', flexDirection:'column', gap:15, marginBottom:30 }}>
                   {items.map(item => (
                     <div key={item.id} style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
                        <span style={{ color:C.muted }}>{item.name} <small>×{item.quantity}</small></span>
                        <span style={{ fontWeight:700 }}>{(item.price * item.quantity).toLocaleString()} MAD</span>
                     </div>
                   ))}
                </div>

                <div style={{ height:1, background:`linear-gradient(90deg, transparent, ${C.border}, transparent)`, margin:'20px 0' }} />
                
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:15, fontSize:14 }}>
                   <span style={{ color:C.muted }}>Sous-total</span>
                   <span>{total.toLocaleString()} MAD</span>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:30, fontSize:14 }}>
                   <span style={{ color:C.muted }}>Livraison</span>
                   <span style={{ color:C.emeraldL, fontWeight:800 }}>GRATUITE</span>
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:40 }}>
                   <span style={{ fontSize:20, fontWeight:900 }}>TOTAL</span>
                   <span style={{ fontSize:28, fontWeight:900, color:themeGold, fontFamily:"'Playfair Display', serif" }}>{finalTotal.toLocaleString()} MAD</span>
                </div>

                {error && <div style={{ color:C.danger, fontSize:13, textAlign:'center', marginBottom:20, padding:10, background:`${C.danger}10`, borderRadius:10 }}>{error}</div>}

                <GoldBtn 
                  type="submit" 
                  disabled={!ok || loading} 
                  style={{ width:'100%', padding:'20px 0', fontSize:16 }}
                >
                  {loading ? 'CONFIRMATION...' : 'CONFIRMER MA COMMANDE'}
                </GoldBtn>

                <div style={{ marginTop:25, textAlign:'center' }}>
                   <Ornament />
                   <div style={{ fontSize:11, color:C.muted, marginTop:10 }}>PAIEMENT 100% SÉCURISÉ VIA SOUK DIGITAL</div>
                </div>
             </Arch>
          </div>

        </div>
      </form>
    </div>
  )
}
