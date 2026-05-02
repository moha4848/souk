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
@keyframes floatPhone { 
  0% { transform: translateY(0px) rotateY(-5deg) rotateX(10deg); }
  50% { transform: translateY(-25px) rotateY(5deg) rotateX(-5deg); }
  100% { transform: translateY(0px) rotateY(-5deg) rotateX(10deg); }
}
@keyframes glowemerald {
  0% { filter: drop-shadow(0 0 10px ${C.emerald}40); }
  50% { filter: drop-shadow(0 0 30px ${C.emerald}80); }
  100% { filter: drop-shadow(0 0 10px ${C.emerald}40); }
}
  @media (max-width: 992px) {
    .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
    .hero-copy { order: 2; }
    .hero-visual { order: 1; margin-bottom: 60px; }
    .hero-features { justify-content: center; flex-wrap: wrap; }
    .hero-title { font-size: 3.5rem !important; }
    .hero-search { max-width: 100% !important; }
  }
  @media (max-width: 768px) {
    .navbar { padding: 15px 25px !important; }
    .nav-links { display: none !important; }
    .trending-grid { grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important; gap: 30px !important; }
  }
`

  useEffect(() => {
    exploreMarketplace()
      .then(res => setProducts(res.data.trending_products || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, fontFamily: "'Outfit', sans-serif" }}>
      <style>{KF}</style>
      
      {/* ── Modern Navbar ── */}
      <header className="navbar" style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, 
        padding: '20px 80px', background: 'rgba(8,10,18,0.7)', backdropFilter: 'blur(30px)',
        borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        transition: 'all 0.4s'
      }}>
        <div onClick={() => navigate('/')} style={{ cursor:'pointer', display:'flex', alignItems:'center', gap:15 }}>
           <img src="/logo.png" alt="SOUK" style={{ height: 50, width: 'auto' }} />
        </div>
        
        <div style={{ display: 'flex', gap: 50, alignItems: 'center' }}>
          <LanguageSwitcher />
          <div className="nav-links" style={{ display:'flex', gap:35, fontSize:12, fontWeight:800, letterSpacing:1.5 }}>
             <span onClick={() => navigate('/explore')} style={{ cursor:'pointer', transition:'0.3s' }} onMouseOver={e=>e.target.style.color=C.emerald} onMouseOut={e=>e.target.style.color=C.text}>{t('explorer')}</span>
             <span onClick={() => navigate('/register')} style={{ cursor:'pointer', color:C.emerald }}>{t('sell')}</span>
          </div>
          <div 
            onClick={() => navigate('/client/dashboard')}
            style={{ 
              background: C.emerald, color: '#fff', 
              padding: '12px 28px', borderRadius: 100, fontWeight: 900, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12, boxShadow:`0 15px 30px ${C.emerald}30`,
              transition: '0.3s'
            }}
            onMouseOver={e=>e.currentTarget.style.transform='scale(1.05)'}
            onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}
          >
            <ShoppingBag size={22} /> {totalCartCount}
          </div>
        </div>
      </header>

      {/* ── Neo Hero ── */}
      <section style={{ 
        minHeight: '100vh', position: 'relative', overflow: 'hidden', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '140px 20px'
      }}>
        <ZelligeBg opacity={0.1} />
        
        <div className="hero-grid" style={{ maxWidth: 1400, width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 80, alignItems: 'center', position: 'relative', zIndex: 10 }}>
          
          <div className="hero-copy" style={{ animation: 'slideUp 1.2s cubic-bezier(0.23, 1, 0.32, 1)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:35 }}>
               <Pill color={C.gold} bg={`${C.gold}15`}>{t('new_generation')}</Pill>
               <div style={{ width:50, height:1, background:C.border }} />
            </div>
            
            <h1 className="hero-title" style={{ 
              fontFamily: "'Outfit', sans-serif", fontSize: 'clamp(3rem, 8vw, 6.5rem)', 
              margin: '0 0 35px 0', fontWeight: 800, lineHeight: 1, color: '#fff', letterSpacing:'-2px'
            }}>
              {t('artisanat')} <br/> 
              <span style={{ 
                background: `linear-gradient(135deg, ${C.emerald} 0%, ${C.gold} 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{t('reinvented')}</span>
            </h1>
            
            <p style={{ fontSize: 22, lineHeight: 1.7, color: C.muted, maxWidth: 600, marginBottom: 60, fontWeight:300 }}>
              {t('hero_subtitle')}
            </p>

            <div style={{ display: 'flex', gap: 20 }}>
               <Glass className="hero-search" style={{ padding: '10px', borderRadius: 100, display: 'flex', gap: 5, flex: 1, maxWidth: 500, border:`1px solid ${C.emerald}30` }}>
                  <input 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t('search_placeholder')}
                    style={{ flex:1, background:'none', border:'none', color:'#fff', padding:'0 30px', fontSize:17, outline:'none' }}
                  />
                  <GoldBtn style={{ width:'auto', padding:'18px 45px', borderRadius:100 }}>
                    {t('find')}
                  </GoldBtn>
               </Glass>
            </div>
          </div>

          {/* Right: Neo Phone Portal */}
          <div className="hero-visual" style={{ position: 'relative', display: 'flex', justifyContent: 'center', animation: 'fadeIn 2.5s ease-out' }}>
            <div style={{ position:'absolute', width:500, height:500, background:C.emerald, filter:'blur(180px)', opacity:0.15, top:'50%', left:'50%', transform:'translate(-50%, -50%)' }} />
            
            <div style={{ 
              width: 340, height: 680, background: '#000', borderRadius: 54, border: `12px solid ${C.surface2}`,
              boxShadow: `0 40px 120px rgba(0,0,0,0.9), 0 0 40px ${C.emerald}20`,
              position: 'relative', overflow: 'hidden', animation: 'floatPhone 8s ease-in-out infinite',
              perspective: 1200
            }}>
               <div style={{ height: '100%', background: C.bg, padding: 25, display:'flex', flexDirection:'column', gap:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                     <div style={{ width:40, height:40, background:C.emerald, borderRadius:12 }} />
                     <div style={{ width:100, height:12, background:C.surface2, borderRadius:6 }} />
                  </div>
                  
                  <div style={{ flex:1, position:'relative', borderRadius:28, overflow:'hidden', border:`1px solid ${C.emerald}20`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                     <ZelligeBg opacity={0.3} />
                     <img src="/logo.png" alt="SOUK" style={{ width: '80%', height: 'auto', filter: 'drop-shadow(0 0 20px rgba(16,185,129,0.4))', animation: 'glowemerald 3s infinite' }} />
                  </div>
                  
                  <div style={{ height:100, background:C.surface, borderRadius:20, padding:20 }}>
                     <div style={{ width:'70%', height:10, background:C.emerald, borderRadius:5, marginBottom:12 }} />
                     <div style={{ width:'40%', height:8, background:C.surface2, borderRadius:4 }} />
                  </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Collection ── */}
      <section style={{ maxWidth: 1400, margin: '0 auto', padding: '120px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 100 }}>
          <Ornament />
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 56, color: '#fff', fontWeight:800, letterSpacing:'-1px' }}>{t('curated_collection')}</h2>
          <p style={{ color: C.muted, fontSize: 20, maxWidth:650, margin:'25px auto', fontWeight:300 }}>{t('collection_subtitle')}</p>
        </div>

        {loading ? <Spinner /> : (
          <div className="responsive-grid">
            {products.map((prod, i) => (
              <Card key={prod.id} hover onClick={() => navigate(`/store/${prod.vendor?.store_slug}/product/${prod.id}`)} style={{ padding: 0, height: '100%', display:'flex', flexDirection:'column' }}>
                <div style={{ height: 380, background: C.surface2, position: 'relative', overflow:'hidden', flexShrink:0 }}>
                  {prod.image_url ? (
                    <img src={prod.image_url} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition:'0.5s' }} className="prod-img" />
                  ) : (
                    <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:C.emerald, opacity: 0.15 }}><Package size={80} /></div>
                  )}
                  <div style={{ 
                    position: 'absolute', bottom: 25, right: 25, background: 'rgba(255,255,255,0.95)', 
                    color: '#000', padding: '10px 20px', 
                    borderRadius: 100, fontWeight: 900, fontSize: 16, boxShadow:'0 10px 20px rgba(0,0,0,0.2)'
                  }}>
                    {prod.price} <span style={{ fontSize: 10, opacity:0.6 }}>MAD</span>
                  </div>
                </div>
                
                <div style={{ padding: 30, display: 'flex', flexDirection: 'column', gap: 20, flex:1, justifyContent:'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: 24, margin: 0, color: '#fff', fontWeight:800, lineHeight:1.2, display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{prod.name}</h3>
                    <div style={{ display:'flex', gap:12, marginTop:15 }}>
                       <Pill color={C.emerald}>{t('premium')}</Pill>
                       <Pill color={C.gold} bg={`${C.gold}15`}>{t('morocco')}</Pill>
                    </div>
                  </div>
                  <GoldBtn style={{ marginTop: 10, width:'100%' }}>{t('discover')}</GoldBtn>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ── Neo Footer ── */}
      <footer style={{ background: '#050505', padding: '140px 80px', borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign:'center' }}>
           <img src="/logo.png" alt="SOUK" style={{ height: 80, width: 'auto', marginBottom: 40 }} />
           <p style={{ color: C.muted, maxWidth: 650, margin: '0 auto 60px', lineHeight: 1.8, fontSize:20, fontWeight:300 }}>{t('footer_text')}</p>
           <div style={{ display:'flex', justifyContent:'center', gap:50, color:C.emerald, fontWeight:800, fontSize:13, letterSpacing:2 }}>
              <span style={{ cursor:'pointer' }}>INSTAGRAM</span>
              <span style={{ cursor:'pointer' }}>LINKEDIN</span>
              <span style={{ cursor:'pointer' }}>{t('contact')}</span>
           </div>
           <div style={{ marginTop:80, opacity:0.2, fontSize:12, letterSpacing:1 }}>© 2026 SOUK SaaS EMERALD PLATFORM.</div>
        </div>
      </footer>
    </div>
  );
}
