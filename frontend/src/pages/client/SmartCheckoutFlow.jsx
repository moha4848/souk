import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useClientAuth } from '../../context/ClientAuthContext'
import { Check, Truck, CreditCard, ShoppingBag, MapPin, Phone, User, ArrowRight, ArrowLeft } from 'lucide-react'
import { C, GoldBtn, Glass, Spinner, ZelligeBg, Arch, Pill, Ornament } from '../../components/UI'
import { placeOrder, getStoreProducts } from '../../api/services'

const KF = `
@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes stepPop { 0% { transform: scale(0.8); } 100% { transform: scale(1); } }
`

const STEPS = ['Panier', 'Livraison', 'Paiement', 'Confirmation']

export default function SmartCheckoutFlow() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { getCart, cartTotal, clearCart } = useCart()
  const { client } = useClientAuth()

  const [step, setStep] = useState(1) // Start at Step 1: Shipping (since cart is separate)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [vendor, setVendor] = useState(null)
  const [error, setError] = useState('')

  const items = getCart(slug)
  const total = cartTotal(slug)

  const [form, setForm] = useState({
    client_name: client?.name || '',
    client_phone: '',
    client_email: client?.email || '',
    shipping_address: '',
    shipping_city: 'Casablanca',
    payment_method: 'cod',
    notes: ''
  })

  useEffect(() => {
    getStoreProducts(slug)
      .then(res => setVendor(res.data.vendor))
      .catch(() => setError("Impossible de charger la boutique"))
      .finally(() => setFetching(true)) // Wait, fetching should be false
  }, [slug])

  // Fix fetching state
  useEffect(() => { if (vendor) setFetching(false) }, [vendor])

  const next = () => {
    if (step === 1 && (!form.client_name || !form.client_phone || !form.shipping_address)) {
      return setError('Veuillez remplir tous les champs de livraison.')
    }
    setError('')
    setStep(s => s + 1)
  }

  const prev = () => setStep(s => s - 1)

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = {
        store_id: vendor.id,
        items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
        ...form
      }
      const res = await placeOrder(payload)
      clearCart(slug)
      navigate(`/store/${slug}/order/${res.data.order.order_number}`)
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la validation")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return (
    <div style={{ minHeight:'100vh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
      <Glass style={{ padding:40, textAlign:'center' }}>
        <ShoppingBag size={64} style={{ color:C.gold, marginBottom:20 }} />
        <h2>Votre panier est vide</h2>
        <GoldBtn onClick={() => navigate(`/store/${slug}`)}>Retour à la boutique</GoldBtn>
      </Glass>
    </div>
  )

  if (fetching && !vendor) return <div style={{ background:C.bg, minHeight:'100vh' }}><Spinner /></div>

  const themeGold = vendor?.theme_settings?.primaryColor || C.gold

  return (
    <div style={{ minHeight:'100vh', background:C.bg, color:'#fff', fontFamily:"'Cairo', sans-serif" }}>
      <style>{KF}</style>
      <ZelligeBg opacity={0.05} />
      
      {/* ── Progress Bar ── */}
      <div style={{ padding: '40px 20px', background: `${C.surface}80`, backdropFilter: 'blur(10px)', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: C.border, zIndex: 0, transform: 'translateY(-50%)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, width: `${(step / (STEPS.length - 1)) * 100}%`, height: 2, background: themeGold, zIndex: 1, transform: 'translateY(-50%)', transition: 'width 0.5s ease' }} />
          
          {STEPS.map((s, i) => (
            <div key={s} style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <div style={{ 
                width: 40, height: 40, borderRadius: '50%', background: step > i ? themeGold : (step === i ? C.bg : C.surface),
                border: `2px solid ${step >= i ? themeGold : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: step > i ? '#000' : '#fff',
                fontWeight: 900, transition: 'all 0.3s', animation: step === i ? 'stepPop 0.5s ease' : 'none'
              }}>
                {step > i ? <Check size={20} /> : i + 1}
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: step >= i ? themeGold : C.muted, textTransform: 'uppercase' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '60px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 400px', gap: 60 }}>
        
        {/* ── Left Content ── */}
        <div style={{ animation: 'slideIn 0.5s ease-out' }}>
          {step === 1 && (
            <section>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 40 }}>Où devons-nous livrer ?</h2>
              <Glass style={{ padding: 40, display: 'flex', flexDirection: 'column', gap: 25 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                  <Input label="NOM COMPLET" icon={<User size={18}/>} value={form.client_name} onChange={v => setForm({...form, client_name: v})} placeholder="Mohamed Alami" />
                  <Input label="TÉLÉPHONE" icon={<Phone size={18}/>} value={form.client_phone} onChange={v => setForm({...form, client_phone: v})} placeholder="06 12 34 56 78" />
                </div>
                <Input label="ADRESSE EXACTE" icon={<MapPin size={18}/>} value={form.shipping_address} onChange={v => setForm({...form, shipping_address: v})} placeholder="N° 24, Rue Atlas, Quartier Royal..." />
                <div>
                  <label style={{ fontSize:10, fontWeight:900, color:themeGold, letterSpacing:2, display:'block', marginBottom:10 }}>VILLE</label>
                  <select 
                    value={form.shipping_city} 
                    onChange={e => setForm({...form, shipping_city: e.target.value})}
                    style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, padding:15, color:'#fff', outline:'none' }}
                  >
                    {['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </Glass>
            </section>
          )}

          {step === 2 && (
            <section>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 40 }}>Mode de paiement</h2>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                <PaymentCard 
                  active={form.payment_method === 'cod'} 
                  onClick={() => setForm({...form, payment_method: 'cod'})}
                  icon={<Truck size={32}/>} 
                  title="Cash à la Livraison" 
                  desc="Payez en espèces lors de la réception de votre colis."
                  theme={themeGold}
                />
                <PaymentCard 
                  active={form.payment_method === 'card'} 
                  icon={<CreditCard size={32}/>} 
                  title="Carte Bancaire" 
                  desc="Paiement en ligne bientôt disponible pour cette boutique."
                  theme={themeGold}
                  disabled
                />
              </div>
            </section>
          )}

          {error && <div style={{ marginTop:20, color:C.danger, background:`${C.danger}15`, padding:15, borderRadius:12, border:`1px solid ${C.danger}30`, fontSize:14 }}>{error}</div>}

          <div style={{ marginTop: 60, display: 'flex', justifyContent: 'space-between' }}>
            {step > 1 && <button onClick={prev} style={{ background:'none', border:'none', color:C.muted, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}><ArrowLeft size={18}/> PRÉCÉDENT</button>}
            <div style={{ flex: 1 }} />
            {step < 2 ? (
              <GoldBtn onClick={next} style={{ width: 250 }}>ÉTAPE SUIVANTE <ArrowRight size={18} /></GoldBtn>
            ) : (
              <GoldBtn onClick={submit} disabled={loading} style={{ width: 300 }}>{loading ? 'CONFIRMATION...' : 'CONFIRMER MA COMMANDE'}</GoldBtn>
            )}
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div>
          <Arch style={{ padding: 40, border: `1px solid ${themeGold}30` }}>
             <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, textAlign: 'center', marginBottom: 30 }}>Récapitulatif</h3>
             <div style={{ display:'flex', flexDirection:'column', gap:15, marginBottom:30 }}>
                {items.map(item => (
                  <div key={item.id} style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
                    <span style={{ color:C.muted }}>{item.name} <small>x{item.quantity}</small></span>
                    <span style={{ fontWeight:700 }}>{item.price * item.quantity} MAD</span>
                  </div>
                ))}
             </div>
             <div style={{ height:1, background:C.border, margin:'20px 0' }} />
             <div style={{ display:'flex', justifyContent:'space-between', marginBottom:15 }}>
                <span style={{ color:C.muted }}>Sous-total</span>
                <span>{total} MAD</span>
             </div>
             <div style={{ display:'flex', justifyContent:'space-between', marginBottom:30 }}>
                <span style={{ color:C.muted }}>Livraison</span>
                <span style={{ color:C.emeraldL, fontWeight:800 }}>OFFERTE</span>
             </div>
             <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:40 }}>
                <span style={{ fontWeight:900, fontSize:18 }}>TOTAL</span>
                <span style={{ fontSize:32, fontWeight:900, color:themeGold }}>{total} <small style={{ fontSize:12 }}>MAD</small></span>
             </div>
             <Ornament />
             <p style={{ fontSize:10, color:C.muted, textAlign:'center', marginTop:20 }}>LOGISTIQUE SÉCURISÉE PAR SOUK ✦ ATLAS</p>
          </Arch>
        </div>

      </div>
    </div>
  )
}

function Input({ label, value, onChange, placeholder, icon }) {
  return (
    <div style={{ flex: 1 }}>
      <label style={{ fontSize:10, fontWeight:900, color:C.gold, letterSpacing:2, display:'block', marginBottom:10 }}>{label}</label>
      <div style={{ position: 'relative' }}>
        <div style={{ position:'absolute', left:15, top:'50%', transform:'translateY(-50%)', color:C.muted }}>{icon}</div>
        <input 
          value={value} 
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, padding:'15px 15px 15px 45px', color:'#fff', outline:'none' }}
        />
      </div>
    </div>
  )
}

function PaymentCard({ active, onClick, icon, title, desc, theme, disabled }) {
  return (
    <div 
      onClick={!disabled ? onClick : null}
      style={{ 
        padding: 30, borderRadius: 24, border: `2px solid ${active ? theme : C.border}`,
        background: active ? `${theme}10` : C.surface,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        transition: 'all 0.3s'
      }}
    >
      <div style={{ color: active ? theme : C.muted, marginBottom: 15 }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 18, color: active ? theme : '#fff' }}>{title}</div>
      <p style={{ fontSize: 12, color: C.muted, marginTop: 5 }}>{desc}</p>
    </div>
  )
}
