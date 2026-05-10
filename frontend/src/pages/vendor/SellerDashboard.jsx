import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { 
  DollarSign, Landmark, Shield, Package, Brain, 
  Rocket, CheckCircle, Palette, TrendingUp, Plus, ArrowRight, Sparkles 
} from 'lucide-react'
import { C, Card, Ornament, ZelligeBg, Pill, Spinner, StatusBadge, GoldBtn, Glass } from '../../components/UI'
import { getSellerDashboard } from '../../api/services'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function SellerDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // We use getSellerDashboard which we will ensure points to the right analytics endpoint
    getSellerDashboard()
      .then(res => setData(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', justifyContent:'center', alignItems:'center', background:C.bg }}>
      <Spinner />
    </div>
  )
  if (!data) return <div style={{ color:C.text, padding:40 }}>Erreur de chargement des données.</div>

  const { stats, recent_orders, weekly_sales, store_info } = data

  // Chart Data preparation
  const chartData = {
    labels: weekly_sales?.map(s => s.day) || [],
    datasets: [
      {
        fill: true,
        label: 'Revenus (MAD)',
        data: weekly_sales?.map(s => s.revenue) || [],
        borderColor: C.emerald,
        backgroundColor: `${C.emerald}15`,
        tension: 0.4,
        pointBackgroundColor: C.emerald,
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(8, 10, 18, 0.95)',
        titleColor: C.emerald,
        bodyColor: '#fff',
        borderColor: `${C.emerald}30`,
        borderWidth: 1,
        padding: 14,
        cornerRadius: 12,
        displayColors: false,
        titleFont: { family: "'Outfit', sans-serif", weight: 'bold' },
        bodyFont: { family: "'Outfit', sans-serif" }
      }
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: { color: C.muted, font: { family: "'Outfit', sans-serif", size: 10 } }
      },
      x: {
        grid: { display: false },
        ticks: { color: C.muted, font: { family: "'Outfit', sans-serif", size: 10 } }
      }
    }
  }

  return (
    <div style={{ padding: '0 0 80px 0', minHeight:'100vh', background:C.bg, animation: 'fadeUp 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 992px) {
          .dash-header { padding: 40px 25px !important; flex-direction: column; gap: 30px; align-items: flex-start !important; }
          .dash-grid { grid-template-areas: "left" "right" !important; grid-template-columns: 1fr !important; }
          .dash-container { padding: 25px !important; }
          .dash-title { font-size: 32px !important; }
          .dash-actions { width: 100%; justify-content: flex-start; }
          .dash-actions button { flex: 1; justify-content: center; }
        }
        @media (max-width: 600px) {
          .stat-grid { grid-template-columns: 1fr !important; }
          .dash-actions { flex-direction: column; }
        }
      `}</style>
      
      {/* ── Premium Header ── */}
      <div style={{ position:'relative', padding:'100px 60px 80px', background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, borderBottom:`1px solid ${C.border}`, overflow:'hidden' }}>
        <ZelligeBg opacity={0.15} />
        
        {/* Glow Effects */}
        <div style={{ position:'absolute', right: '5%', top: '-20%', width: 500, height: 500, background: C.emerald, filter: 'blur(200px)', opacity: 0.1 }} />
        <div style={{ position:'absolute', left: '-5%', bottom: '-10%', width: 300, height: 300, background: C.gold, filter: 'blur(150px)', opacity: 0.05 }} />
        
        <div className="dash-header" style={{ position:'relative', zIndex:1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
               <Pill color={C.emerald} bg={`${C.emerald}15`}>SOUK ✦ EMERALD</Pill>
               <div style={{ width:40, height:1, background:C.border }} />
            </div>
            <h1 className="dash-title" style={{ color:'#fff', fontSize:52, margin:0, fontFamily:"'Outfit', sans-serif", fontWeight: 900, letterSpacing:'-2px' }}>
              Marhba, {store_info?.name || 'Artisan'}
            </h1>
            <div style={{ marginTop:20, display:'flex', gap:15, alignItems:'center' }}>
              <Glass style={{ padding:'8px 20px', borderRadius:100, border:`1px solid ${C.emerald}40` }}>
                 <span style={{ fontSize:13, fontWeight:700, color:C.emerald }}>{store_info?.slug}.souk.ma</span>
              </Glass>
              <StatusBadge status="active" />
            </div>
          </div>
          
          <div className="dash-actions" style={{ display: 'flex', gap: 15 }}>
            <button onClick={() => navigate('/products/new')} style={{ padding: '16px 28px', borderRadius: 20, background: C.surface, border: `1px solid ${C.border}`, color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 12, transition: 'all 0.3s', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }} onMouseOver={e=>{e.currentTarget.style.borderColor=C.emerald; e.currentTarget.style.transform='translateY(-4px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='translateY(0)'}}>
              <Plus size={20} /> Nouveau Produit
            </button>
            <GoldBtn onClick={() => navigate('/customize')} style={{ padding: '16px 28px', borderRadius: 20 }}>
              <Palette size={20} /> Éditer Thème
            </GoldBtn>
          </div>
        </div>
      </div>

      <div className="dash-container" style={{ padding: '60px', maxWidth: 1600, margin: '0 auto' }}>
        
        {/* ── Key Metrics ── */}
        <div className="stat-grid" style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap:30, marginBottom:50 }}>
          <StatCard label="Chiffre d'Affaires" value={`${stats?.total_revenue || 0} MAD`} icon={<DollarSign size={24} />} color={C.gold} trend="+12%" />
          <StatCard label="Ventes Nettes" value={`${(stats?.total_revenue - (data?.total_commissions || 0)).toFixed(2)} MAD`} icon={<Landmark size={24} />} color={C.emeraldL} trend="Après Comm." />
          <StatCard label="Commission SOUK" value={`${data?.total_commissions || 0} MAD`} icon={<Shield size={24} />} color={C.emerald} trend={`${store_info?.commission_rate || 5}% rate`} />
          <StatCard label="Commandes" value={stats?.total_orders || 0} icon={<Package size={24} />} color={C.text} trend="+5" />
        </div>

        <div className="dash-grid" style={{ display:'grid', gridTemplateColumns: '1.8fr 1fr', gap:40 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* ── Activity Analytics ── */}
            <Card style={{ padding: 40, background:C.surface, border:`1px solid ${C.border}` }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                  <div>
                    <h3 style={{ margin:0, color:'#fff', fontSize:24, fontWeight:900, letterSpacing:'-0.5px' }}>Performance Hebdomadaire</h3>
                    <p style={{ fontSize: 14, color: C.muted, marginTop: 8, fontWeight:400 }}>Analyse des revenus en temps réel</p>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize: 32, fontWeight: 900, color: C.emerald }}>
                      {weekly_sales?.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString() || 0} <span style={{ fontSize:14, opacity:0.6 }}>MAD</span>
                    </div>
                    <div style={{ fontSize:11, color:C.muted, fontWeight:800, textTransform:'uppercase', letterSpacing:1 }}>Total 7 Jours</div>
                  </div>
               </div>
               <div style={{ height: 350 }}>
                  <Line data={chartData} options={chartOptions} />
               </div>
            </Card>

            {/* ── Latest Transactions ── */}
            <Card style={{ padding: 40 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:40 }}>
                <h3 style={{ margin:0, color:'#fff', fontSize:24, fontWeight:900, letterSpacing:'-0.5px' }}>Commandes Récentes</h3>
                <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', color: C.emerald, cursor: 'pointer', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, transition:'0.3s' }} onMouseOver={e=>e.target.style.background=`${C.emerald}10`}>Voir tout <ArrowRight size={18} /></button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth: 700 }}>
                  <thead>
                    <tr style={{ textAlign:'left', borderBottom:`1px solid ${C.border}`, color:C.muted, fontSize:11, textTransform:'uppercase', letterSpacing:1.5, fontWeight:800 }}>
                      <th style={{ padding:'0 15px 20px' }}>Client & ID</th>
                      <th style={{ padding:'0 15px 20px' }}>Date</th>
                      <th style={{ padding:'0 15px 20px' }}>Montant</th>
                      <th style={{ padding:'0 15px 20px' }}>État</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!recent_orders || recent_orders.length === 0 ? (
                      <tr><td colSpan="4" style={{ padding:80, textAlign:'center', color:C.muted, fontSize: 16 }}>Aucune commande pour le moment.</td></tr>
                    ) : recent_orders.map(order => (
                      <tr key={order.id} style={{ borderBottom:`1px solid ${C.border}`, fontSize:15, color:C.text, transition:'0.3s' }} className="table-row">
                        <td style={{ padding:'25px 15px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                              <div style={{ width: 42, height: 42, borderRadius: 14, background: C.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: C.emerald, fontWeight:900, border:`1px solid ${C.border}` }}>{order.client_name?.charAt(0)}</div>
                              <div>
                                 <div style={{ fontWeight: 800, color:'#fff' }}>{order.client_name}</div>
                                 <div style={{ fontSize: 11, color: C.muted, marginTop:4 }}>Order ID: #{order.id}</div>
                              </div>
                           </div>
                        </td>
                        <td style={{ padding:'25px 15px', color:C.muted }}>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td style={{ padding:'25px 15px', fontWeight:900, color: '#fff', fontSize:17 }}>{order.total} <span style={{ fontSize:10, opacity:0.5 }}>MAD</span></td>
                        <td style={{ padding:'25px 15px' }}><StatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
             {/* ── AI Intelligence Box ── */}
            <Card style={{ background:`linear-gradient(145deg, ${C.surface} 0%, ${C.emerald}08 100%)`, position: 'relative', overflow: 'hidden', border:`1px solid ${C.emerald}20`, padding: 40 }}>
              <div style={{ position: 'absolute', top: -40, right: -40, fontSize: 160, color: C.emerald, opacity: 0.05, pointerEvents: 'none' }}>✦</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
                 <div style={{ color: C.emerald, background:`${C.emerald}15`, borderRadius:16, width:50, height:50, display:'flex', alignItems:'center', justifyContent:'center' }}><Brain size={32} /></div>
                 <h3 style={{ color:C.emerald, margin: 0, fontSize: 20, fontWeight:900, letterSpacing:'-0.5px' }}>SOUK Insight AI</h3>
              </div>
              <Ornament />
              <p style={{ color:C.text, fontSize:16, lineHeight:1.8, marginTop:35, fontWeight: 400 }}>
                "Votre boutique a reçu <b style={{ color:C.emerald }}>18%</b> de visiteurs en plus cette semaine. Les clients s'attardent particulièrement sur votre collection <b style={{ color:C.gold }}>Artisanat</b>."
              </p>
              <Glass style={{ marginTop:40, padding:30, border:`1px solid ${C.emerald}25`, borderRadius:24 }}>
                 <div style={{ fontSize:13, color:C.emerald, fontWeight: 900, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10, textTransform:'uppercase', letterSpacing:1.5 }}>
                    <Rocket size={18} /> Action Stratégique
                 </div>
                 <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: 0 }}>
                   Lancez une <b>Vente Flash</b> de 24h sur vos best-sellers pour convertir ce surplus de trafic en revenus immédiats.
                 </p>
                 <button style={{ marginTop: 25, width: '100%', padding: '16px', borderRadius: 16, background: C.emerald, border: 'none', color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer', transition:'0.4s', boxShadow:`0 10px 25px ${C.emerald}40` }} onMouseOver={e=>e.target.style.transform='scale(1.02)'} onMouseOut={e=>e.target.style.transform='scale(1)'}>
                   ACTIVER LA PROMO
                 </button>
              </Glass>
            </Card>

            {/* ── Inventory & Health ── */}
            <Card style={{ padding: 40, border:`1px solid ${C.emerald}33`, background:`linear-gradient(180deg, ${C.surface} 0%, ${C.emerald}05 100%)` }}>
               <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:25 }}>
                  <Package size={20} color={C.emerald} />
                  <h3 style={{ fontSize: 18, color: '#fff', margin:0, fontWeight:900 }}>Santé de l'Inventaire</h3>
               </div>
               
               <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 12, fontWeight:700 }}>
                    <span style={{ color:C.text }}>Produits Actifs</span>
                    <span style={{ color:C.emerald }}>{stats?.total_products || 0} / {store_info?.max_products || 10}</span>
                  </div>
                  <div style={{ height: 8, background: C.surface2, borderRadius: 10, overflow: 'hidden', marginBottom: 30 }}>
                     <div style={{ height: '100%', width: `${Math.min(100, (stats?.total_products / (store_info?.max_products || 10)) * 100)}%`, background: `linear-gradient(90deg, ${C.emerald}, ${C.emeraldL})`, boxShadow:`0 0 15px ${C.emerald}50` }} />
                  </div>
                  
                  <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
                    <div style={{ color: C.emeraldL, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle size={16} /> Support Premium Activé</div>
                    <div style={{ color: C.emeraldL, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}><CheckCircle size={16} /> Analytics Temps Réel</div>
                    <div style={{ color: C.gold, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}><Sparkles size={16} /> SEO Optimisé</div>
                  </div>
               </div>
               
               <button onClick={() => navigate('/onboarding')} style={{ marginTop: 35, width: '100%', padding: '16px', borderRadius: 16, background: C.surface2, border: `1px solid ${C.border}`, color: '#fff', fontSize: 13, fontWeight: 900, cursor: 'pointer', transition:'0.3s' }} onMouseOver={e=>e.target.style.borderColor=C.emerald}>
                  CHANGER DE FORFAIT
               </button>
            </Card>

            {/* ── Category Performance ── */}
            <Card style={{ padding: 40 }}>
               <h3 style={{ fontSize: 18, color: '#fff', marginBottom: 30, fontWeight:900 }}>Top Catégories</h3>
               {[
                 { name: 'Artisanat', value: 65, color: C.emerald },
                 { name: 'Beauté', value: 25, color: C.emeraldL },
                 { name: 'Décoration', value: 10, color: C.gold },
               ].map(cat => (
                 <div key={cat.name} style={{ marginBottom: 28 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 12, fontWeight:700 }}>
                       <span>{cat.name}</span>
                       <span style={{ color: cat.color }}>{cat.value}%</span>
                    </div>
                    <div style={{ height: 6, background: C.surface2, borderRadius: 10, overflow: 'hidden' }}>
                       <div style={{ height: '100%', width: `${cat.value}%`, background: cat.color, borderRadius: 10, boxShadow:`0 0 12px ${cat.color}40` }} />
                    </div>
                 </div>
               ))}
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, color, trend }) {
  return (
    <Card style={{ position:'relative', overflow:'hidden', padding: 28, borderBottom: `3px solid ${color}40`, background:`linear-gradient(180deg, ${C.surface} 0%, ${color}05 100%)` }}>
      <div style={{ position:'absolute', right:-15, bottom:-15, fontSize:80, opacity:0.06, transform: 'rotate(-15deg)', color }}>{icon}</div>
      <div style={{ fontSize:11, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:15, fontWeight: 800 }}>{label}</div>
      <div style={{ fontSize:32, fontWeight:900, color: '#fff', fontFamily: "'Outfit', sans-serif", letterSpacing:'-1px' }}>{value}</div>
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
         <TrendingUp size={12} color={trend.startsWith('+') ? C.emeraldL : C.danger} />
         <span style={{ fontSize: 11, color: trend.startsWith('+') ? C.emeraldL : C.danger, fontWeight: 800 }}>{trend}</span>
         <span style={{ fontSize: 10, color: C.muted, fontWeight:400 }}>vs mois dernier</span>
      </div>
    </Card>
  )
}
