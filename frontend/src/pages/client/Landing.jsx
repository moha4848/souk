import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Sparkles, Tag, Truck, ShieldCheck, Package } from 'lucide-react';
import { C, Card, Ornament, ZelligeBg, Spinner, Arch, GoldBtn, Glass, Pill } from '../../components/UI';
import { useCart } from '../../context/CartContext';
import { exploreMarketplace } from '../../api/services';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';

export default function Landing() {
  const navigate = useNavigate();
  const { totalCartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { t, i18n } = useTranslation();

  const KF = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Outfit:wght@300;400;600;800&display=swap');

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideRight { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
@keyframes float { 
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}
@keyframes glowemerald {
  0% { filter: drop-shadow(0 0 10px ${C.emerald}40); }
  50% { filter: drop-shadow(0 0 30px ${C.emerald}80); }
  100% { filter: drop-shadow(0 0 10px ${C.emerald}40); }
}

  .hero-title { font-family: 'Playfair Display', serif !important; }
  
  @media (max-width: 992px) {
    .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
    .hero-copy { order: 2; display: flex; flexDirection: column; alignItems: center; }
    .hero-visual { order: 1; margin-bottom: 60px; display: block !important; }
    .hero-search { max-width: 100% !important; flex-direction: column !important; background: transparent !important; border: none !important; gap: 15px !important; }
    .hero-search-inner { width: 100% !important; background: rgba(255,255,255,0.03) !important; border: 1px solid ${C.emerald}30 !important; border-radius: 100px !important; display: flex !important; }
    .hero-search button { width: 100% !important; }
    .hero-title { font-size: 3rem !important; }
    .hero-stats { flex-direction: column !important; gap: 20px !important; align-items: center !important; }
    .nav-header { padding: 10px 15px !important; gap: 10px !important; }
    .nav-links { display: none !important; }
    .hero-title { font-size: 2.2rem !important; line-height: 1.2 !important; letter-spacing: -1px !important; }
    .section-padding { padding: 40px 15px !important; }
    .footer-padding { padding: 40px 15px !important; }
    .luxury-img-stack { height: 350px !important; }
    .stack-item { border-radius: 20px !important; }
    .recap-card { display: none !important; }
  }
  
  .luxury-img-stack {
    position: relative;
    width: 100%;
    height: 600px;
  }
  .stack-item {
    position: absolute;
    border-radius: 40px;
    overflow: hidden;
    box-shadow: 0 30px 60px rgba(0,0,0,0.5);
    border: 1px solid ${C.border};
    transition: 0.5s;
  }
  .stack-item:hover { transform: scale(1.05) translateY(-10px); z-index: 10 !important; }
  
  .nav-blur {
    background: rgba(8, 10, 18, 0.4) !important;
    backdrop-filter: blur(20px) !important;
  }
`

  useEffect(() => {
    exploreMarketplace()
      .then(res => setProducts(res.data.trending_products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Outfit', sans-serif", overflowX: 'hidden' }}>
      <style>{KF}</style>
      
      {/* ── Modern Navbar ── */}
      <header className="navbar nav-blur nav-header" style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        padding: '20px 80px', 
        borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'all 0.4s'
      }}>
        <div onClick={() => navigate('/')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:15 }}>
           <img src="/logo.png" alt="SOUK" style={{ height: 45, width: 'auto' }} />
           <span style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, color: '#fff' }}>SOUK<span style={{ color: C.emerald }}>✦</span></span>
        </div>
        
        <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
          <div className="nav-links hide-mobile" style={{ display:'flex', gap:20, fontSize:11, fontWeight:800, letterSpacing:1 }}>
             <span onClick={() => navigate('/explore')} style={{ cursor:'pointer', transition:'0.3s' }} onMouseOver={e=>e.target.style.color=C.emerald} onMouseOut={e=>e.target.style.color=C.text}>{t('explorer')}</span>
             <span onClick={() => navigate('/register')} style={{ cursor:'pointer', color:C.emerald }}>{t('sell')}</span>
          </div>
          <LanguageSwitcher />
          <div 
            onClick={() => navigate('/client/dashboard')}
            style={{ 
              background: C.emerald, color: '#fff', 
              padding: '10px 18px', borderRadius: 100, fontWeight: 900, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, boxShadow:`0 10px 20px ${C.emerald}30`,
              transition: '0.3s'
            }}
            onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'}
            onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
          >
            <ShoppingBag size={18} /> {totalCartCount}
          </div>
        </div>
      </header>

      {/* ── Ultra-Premium Hero ── */}
      <section className="section-padding" style={{ 
        minHeight: '100vh', position: 'relative', overflow: 'hidden', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 20px'
      }}>
        <ZelligeBg opacity={0.12} />
        
        {/* Abstract Glows */}
        <div style={{ position:'absolute', width:600, height:600, background:C.emerald, filter:'blur(200px)', opacity:0.1, top:'-10%', right:'-5%' }} />
        <div style={{ position:'absolute', width:400, height:400, background:C.gold, filter:'blur(180px)', opacity:0.05, bottom:'10%', left:'-5%' }} />

        <div className="hero-grid" style={{ maxWidth: 1400, width: '100%', display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 60, alignItems: 'center', position: 'relative', zIndex: 10 }}>
          
          <div className="hero-copy" style={{ animation: 'slideRight 1.2s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:35 }}>
               <Pill color={C.gold} bg={`${C.gold}15`}>{t('new_generation')}</Pill>
               <div style={{ width:50, height:1, background:C.border }} />
            </div>
            
            <h1 className="hero-title" style={{ 
              fontSize: 'clamp(3.5rem, 8vw, 6rem)', 
              margin: '0 0 35px 0', fontWeight: 900, lineHeight: 1.05, color: '#fff', letterSpacing:'-2px'
            }}>
              {t('artisanat')} <br/> 
              <span style={{ 
                background: `linear-gradient(135deg, ${C.emerald} 0%, ${C.gold} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{t('reinvented')}</span>
            </h1>

            <div className="recap-card" style={{ 
                   background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)`, 
                   backdropFilter:'blur(20px)',
                   border: `1.5px solid ${C.gold}30`, borderRadius: 32, padding: '35px', 
                   animation: 'fadeUp 0.6s ease-out 0.2s both', boxShadow:`0 30px 60px rgba(0,0,0,0.4)`,
                   marginBottom: 40
                 }}>
                   <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, marginBottom: 25, color:'#fff', letterSpacing:'-1px' }}>RÉCAPITULATIF</div>
              {t('hero_subtitle')}
            </div>
            
            <p style={{ fontSize: 22, lineHeight: 1.7, color: C.muted, maxWidth: 650, marginBottom: 60, fontWeight:300 }}>
              {t('hero_subtitle')}
            </p>

            <div style={{ display: 'flex', gap: 20 }}>
               <div className="hero-search" style={{ 
                 padding: '5px', borderRadius: 100, display: 'flex', gap: 5, flex: 1, maxWidth: 550,
                 background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(15px)',
                 border: `1px solid ${C.emerald}30`, position:'relative'
               }}>
                  <div className="hero-search-inner" style={{ display:'flex', flex:1, alignItems:'center', borderRadius: 100 }}>
                    <div style={{ display:'flex', alignItems:'center', paddingLeft:25, color:C.emerald }}><Search size={20} /></div>
                    <input 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder={t('search_placeholder')}
                      style={{ flex:1, background:'none', border:'none', color:'#fff', padding:'15px 20px', fontSize:17, outline:'none', fontFamily:"'Outfit', sans-serif" }}
                    />
                  </div>
                  <GoldBtn style={{ width:'auto', padding:'15px 40px', borderRadius:100, fontSize:13 }}>
                    {t('find')}
                  </GoldBtn>
               </div>
            </div>

            <div className="hero-stats" style={{ marginTop: 60, display: 'flex', gap: 40, opacity: 0.7 }}>
               {[
                 { label: 'Artisans', val: '500+' },
                 { label: 'Produits', val: '12k+' },
                 { label: 'Satisfaction', val: '99%' }
               ].map(s => (
                 <div key={s.label}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{s.val}</div>
                    <div style={{ fontSize: 12, color: C.muted, letterSpacing: 1, textTransform: 'uppercase' }}>{s.label}</div>
                 </div>
               ))}
            </div>
          </div>

          {/* Right: Artistic Composition */}
          <div className="hero-visual" style={{ animation: 'fadeIn 2s ease-out' }}>
             <div className="luxury-img-stack">
                <div className="stack-item" style={{ top: 0, right: 0, width: '70%', height: '70%', zIndex: 1, animation: 'float 6s infinite ease-in-out', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
                   <img src="/logo.png" style={{ width:'60%', height:'auto', objectFit:'contain', filter: `drop-shadow(0 0 20px ${C.emerald}50)` }} alt="SOUK" />
                </div>
                <div className="stack-item" style={{ bottom: 0, left: 0, width: '60%', height: '60%', zIndex: 2, animation: 'float 8s infinite ease-in-out reverse' }}>
                   <img src="https://images.unsplash.com/photo-1617957718614-8c23f060c2d0?auto=format&fit=crop&q=80&w=1000" style={{ width:'100%', height:'100%', objectFit:'cover' }} alt="Pottery" />
                </div>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%, -50%)', zIndex:3 }}>
                   <div style={{ 
                 padding:'14px 28px', borderRadius:100, background:'rgba(255,255,255,0.03)', 
                 backdropFilter:'blur(10px)', border:`1px solid ${C.border}`, 
                 display:'flex', alignItems:'center', gap:10 
               }}>
                  <div style={{ width:8, height:8, borderRadius:'50%', background:C.emerald, boxShadow:`0 0 10px ${C.emerald}` }} />
                  <span style={{ fontSize:14, fontWeight:800, color:'#fff' }}>{'500+'}</span>
                  <span style={{ fontSize:11, color:C.muted, textTransform:'uppercase', letterSpacing:1 }}>Suiveurs</span>
               </div>
                </div>
             </div>
          </div>

        </div>
      </section>

      {/* ── Curated Collection ── */}
      <section className="section-padding" style={{ maxWidth: 1500, margin: '0 auto', padding: '120px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 100 }}>
          <Ornament />
          <h2 className="hero-title" style={{ fontSize: 64, color: '#fff', fontWeight:900, letterSpacing:'-1px' }}>{t('curated_collection')}</h2>
          <p style={{ color: C.muted, fontSize: 20, maxWidth:700, margin:'25px auto', fontWeight:300, lineHeight:1.6 }}>{t('collection_subtitle')}</p>
        </div>

        {loading ? <Spinner /> : (
          <div className="responsive-grid">
            {products.map((prod, i) => (
              <Card key={prod.id} hover onClick={() => navigate(`/store/${prod.vendor?.store_slug}/product/${prod.id}`)} style={{ padding: 0, height: '100%', display:'flex', flexDirection:'column', background: C.surface, border:`1px solid ${C.border}` }}>
                <div style={{ height: 420, background: C.surface2, position: 'relative', overflow:'hidden', flexShrink:0 }}>
                  {prod.image_url ? (
                    <img src={prod.image_url} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition:'0.8s cubic-bezier(0.23, 1, 0.32, 1)' }} className="prod-img" />
                  ) : (
                    <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:C.emerald, opacity: 0.15 }}><Package size={100} /></div>
                  )}
                  
                  {/* Floating Price Tag */}
                  <div style={{ 
                    position: 'absolute', top: 30, right: 30, background: 'rgba(10,10,10,0.8)', 
                    backdropFilter: 'blur(10px)', color: C.emerald, padding: '10px 20px', 
                    borderRadius: 100, fontWeight: 900, fontSize: 16, border: `1px solid ${C.emerald}40`
                  }}>
                    {prod.price} <span style={{ fontSize: 10, opacity:0.6 }}>MAD</span>
                  </div>
                </div>
                
                <div style={{ padding: 35, display: 'flex', flexDirection: 'column', gap: 25, flex:1, justifyContent:'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 26, margin: 0, color: '#fff', fontWeight:800, lineHeight:1.2, fontFamily: "'Outfit', sans-serif" }}>{prod.name}</h3>
                    <div style={{ display:'flex', gap:12, marginTop:20 }}>
                       <Pill color={C.emerald}>{t('premium')}</Pill>
                       <Pill color={C.gold} bg={`${C.gold}15`}>{t('morocco')}</Pill>
                    </div>
                  </div>
                  <GoldBtn style={{ marginTop: 10, width:'100%', fontSize:12 }}>{t('discover')}</GoldBtn>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── Brand Promise Section ── */}
      <section className="section-padding" style={{ padding: '120px 20px', background: `${C.surface}80`, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
         <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 60 }}>
            {[
              { icon: <ShieldCheck size={40} />, title: 'Paiement Sécurisé', desc: 'Transactions protégées par cryptage SSL de pointe.' },
              { icon: <Truck size={40} />, title: 'Livraison Express', desc: 'Partout au Maroc et à l\'international avec suivi temps réel.' },
              { icon: <Sparkles size={40} />, title: 'Authenticité Garantie', desc: 'Chaque produit est vérifié pour son origine et sa qualité.' }
            ].map((f, idx) => (
              <div key={idx} style={{ textAlign:'center' }}>
                 <div style={{ color:C.emerald, marginBottom:25, display:'flex', justifyContent:'center' }}>{f.icon}</div>
                 <h4 style={{ fontSize:22, fontWeight:900, color:'#fff', marginBottom:15 }}>{f.title}</h4>
                 <p style={{ color:C.muted, lineHeight:1.6, fontWeight:300 }}>{f.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* ── Neo Footer ── */}
      <footer className="footer-padding" style={{ background: '#050505', padding: '140px 80px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign:'center' }}>
           <img src="/logo.png" alt="SOUK" style={{ height: 70, width: 'auto', marginBottom: 40 }} />
           <p style={{ color: C.muted, maxWidth: 650, margin: '0 auto 60px', lineHeight: 1.8, fontSize:20, fontWeight:300 }}>{t('footer_text')}</p>
           <div style={{ display:'flex', justifyContent:'center', gap:50, color:C.emerald, fontWeight:800, fontSize:12, letterSpacing:2 }}>
              <span style={{ cursor:'pointer', transition:'0.3s' }} onMouseOver={e=>e.target.style.color=C.gold} onMouseOut={e=>e.target.style.color=C.emerald}>INSTAGRAM</span>
              <span style={{ cursor:'pointer', transition:'0.3s' }} onMouseOver={e=>e.target.style.color=C.gold} onMouseOut={e=>e.target.style.color=C.emerald}>LINKEDIN</span>
              <span style={{ cursor:'pointer', transition:'0.3s' }} onMouseOver={e=>e.target.style.color=C.gold} onMouseOut={e=>e.target.style.color=C.emerald}>{t('contact')}</span>
           </div>
           <div style={{ marginTop:80, opacity:0.3, fontSize:11, letterSpacing:2, fontWeight:800 }}>© 2026 SOUK ✦ LUXURY SAAS PLATFORM. MADE IN MOROCCO.</div>
        </div>
      </footer>
    </div>
  );
}
