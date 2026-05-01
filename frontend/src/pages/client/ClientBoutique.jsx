import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts } from '../../api/services';
import { C, Card, Spinner, Pill, GoldBtn } from '../../components/UI';

export default function ClientBoutique() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Panier simulé pour le design
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getProducts();
      // En fonction de la réponse de l'API (Laravel paginé ou datas brut)
      const data = res.data?.data || res.data || [];
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erreur lors du chargement des produits.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setCartCount(prev => prev + 1);
    // Ici on ajouterait la vraie logique de panier plus tard
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* ── Navbar ── */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: `rgba(8, 8, 13, 0.85)`,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        padding: '15px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div 
          onClick={() => navigate('/')}
          style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: C.gold, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span>SOUK ✦</span>
          <span style={{ fontSize: '0.8rem', color: C.muted, fontWeight: 'normal', marginTop: '5px' }}>Boutique Client</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: '24px' }}>🛒</span>
            {cartCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-10px',
                background: C.copper,
                color: '#fff',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </div>
            )}
          </div>
          <button 
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: `1px solid ${C.muted}`,
              color: C.muted,
              borderRadius: '20px',
              padding: '6px 15px',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.text; }}
            onMouseOut={e => { e.currentTarget.style.color = C.muted; e.currentTarget.style.borderColor = C.muted; }}
          >
            Espace Vendeur
          </button>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section style={{
        padding: '60px 40px',
        textAlign: 'center',
        background: `linear-gradient(180deg, rgba(201,168,76,0.05) 0%, transparent 100%)`
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>Découvrez nos collections</h1>
        <p style={{ color: C.muted, maxWidth: '600px', margin: '0 auto' }}>
          Explorez des produits de qualité proposés par nos vendeurs partenaires. Trouvez exactement ce que vous cherchez.
        </p>
      </section>

      {/* ── Product Grid ── */}
      <main style={{ padding: '0 40px 60px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <div style={{ color: C.danger, textAlign: 'center', padding: '40px' }}>{error}</div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', color: C.muted, padding: '60px' }}>
            Aucun produit disponible pour le moment.
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {products.map((prod) => (
              <Card key={prod.id} hover={true} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '0', overflow: 'hidden' }}>
                <div style={{
                  height: '200px',
                  background: C.surface2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: `1px solid ${C.border}`,
                  position: 'relative'
                }}>
                  {/* Image placeholder ou vraie image */}
                  {prod.image_url ? (
                    <img src={prod.image_url} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '40px', opacity: 0.2 }}>📦</span>
                  )}
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <Pill>{prod.price} MAD</Pill>
                  </div>
                </div>
                
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', color: C.text }}>{prod.name}</h3>
                  <p style={{ color: C.muted, fontSize: '0.9rem', marginBottom: '20px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {prod.description || 'Aucune description fournie.'}
                  </p>
                  
                  <GoldBtn outline={true} onClick={handleAddToCart} style={{ padding: '10px 0', fontSize: '13px' }}>
                    Ajouter au panier
                  </GoldBtn>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
