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
  Rocket, CheckCircle, Palette, TrendingUp, Plus, ArrowRight 
} from 'lucide-react'
import { C, Card, Ornament, ZelligeBg, Pill, Spinner, StatusBadge, GoldBtn } from '../../components/UI'
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
      
      {/* Header with Background */}
      <div style={{ position:'relative', padding:'80px 45px', background:C.surface, borderBottom:`1px solid ${C.border}`, overflow:'hidden' }}>
        <ZelligeBg opacity={0.15} />
        <div style={{ position:'absolute', right: '10%', top: '50%', transform: 'translateY(-50%)', width: 400, height: 400, background: `radial-gradient(circle, ${C.emerald}15 0%, transparent 70%)` }} />
        
        <div className="dash-header" style={{ position:'relative', zIndex:1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color:C.emerald, fontSize:11, letterSpacing:4, textTransform:'uppercase', marginBottom:12, fontWeight: 800 }}>
              SOUK ✦ EMERALD EDITION
            </div>
            <h1 className="dash-title" style={{ color:C.text, fontSize:42, margin:0, fontFamily:"'Outfit', sans-serif", fontWeight: 800, letterSpacing:'-1px' }}>
              Marhba, {store_info?.name || 'Artisan'}
            </h1>
            <div style={{ marginTop:18, display:'flex', gap:12 }}>
              <Pill color={C.gold} bg={`${C.gold}15`}>{store_info?.slug}.souk.ma</Pill>
              <StatusBadge status="active" />
            </div>
          </div>
          <div className="dash-actions" style={{ display: 'flex', gap: 15 }}>
            <button onClick={() => navigate('/products/new')} style={{ padding: '14px 24px', borderRadius: 16, background: C.surface2, border: `1px solid ${C.border}`, color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s' }} onMouseOver={e=>e.currentTarget.style.borderColor=C.emerald} onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
              <Plus size={18} /> Nouveau Produit
            </button>
            <GoldBtn onClick={() => navigate('/customize')} style={{ padding: '14px 24px', borderRadius: 16 }}>
              <Palette size={18} /> Éditer Thème
            </GoldBtn>
          </div>
        </div>
      </div>

      <div className="dash-container" style={{ padding: '45px', maxWidth: 1500, margin: '0 auto' }}>
        
        {/* Analytics Row */}
        <div className="stat-grid" style={{ display:'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap:24, marginBottom:40 }}>
          <StatCard label="Chiffre d'Affaires" value={`${stats?.total_revenue || 0} MAD`} icon={<DollarSign size={24} />} color={C.gold} trend="+12%" />
          <StatCard label="Ventes Nettes" value={`${(stats?.total_revenue - (data?.total_commissions || 0)).toFixed(2)} MAD`} icon={<Landmark size={24} />} color={C.emeraldL} trend="Après Comm." />
          <StatCard label="Commission SOUK" value={`${data?.total_commissions || 0} MAD`} icon={<Shield size={24} />} color={C.emerald} trend={`${store_info?.commission_rate || 5}% rate`} />
          <StatCard label="Commandes" value={stats?.total_orders || 0} icon={<Package size={24} />} color={C.text} trend="+5" />
        </div>

        <div className="dash-grid" style={{ display:'grid', gridTemplateColumns: '1.8fr 1fr', gap:30 }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
            {/* Sales Chart */}
            <Card style={{ padding: 30 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                  <div>
                    <h3 style={{ margin:0, color:C.text, fontSize:20, fontWeight:800 }}>Activité Hebdomadaire</h3>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 6, fontWeight:400 }}>Revenus des 7 derniers jours</div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: C.emerald }}>
                    {weekly_sales?.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString() || 0} <span style={{ fontSize:14, opacity:0.6 }}>MAD</span>
                  </div>
               </div>
               <div style={{ height: 320 }}>
                  <Line data={chartData} options={chartOptions} />
               </div>
            </Card>

            {/* Recent Orders Table */}
            <Card style={{ padding: 30 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:30 }}>
                <h3 style={{ margin:0, color:C.text, fontSize:20, fontWeight:800 }}>Commandes Récentes</h3>
                <button onClick={() => navigate('/orders')} style={{ background: 'none', border: 'none', color: C.emerald, cursor: 'pointer', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>Voir tout <ArrowRight size={16} /></button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth: 600 }}>
                  <thead>
                    <tr style={{ textAlign:'left', borderBottom:`1px solid ${C.border}`, color:C.muted, fontSize:11, textTransform:'uppercase', letterSpacing:1.5, fontWeight:800 }}>
                      <th style={{ padding:'15px 10px' }}>Client</th>
                      <th style={{ padding:'15px 10px' }}>Date</th>
                      <th style={{ padding:'15px 10px' }}>Total</th>
                      <th style={{ padding:'15px 10px' }}>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!recent_orders || recent_orders.length === 0 ? (
                      <tr><td colSpan="4" style={{ padding:60, textAlign:'center', color:C.muted, fontSize: 14 }}>Aucune commande pour le moment.</td></tr>
                    ) : recent_orders.map(order => (
                      <tr key={order.id} style={{ borderBottom:`1px solid ${C.border}`, fontSize:15, color:C.text, transition:'0.3s' }} className="table-row">
                        <td style={{ padding:'20px 10px' }}>
                           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ width: 36, height: 36, borderRadius: 12, background: C.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: C.emerald, fontWeight:800, border:`1px solid ${C.border}` }}>{order.client_name?.charAt(0)}</div>
                              <div>
                                 <div style={{ fontWeight: 700 }}>{order.client_name}</div>
                                 <div style={{ fontSize: 11, color: C.muted, marginTop:2 }}>ID: #{order.id}</div>
                              </div>
                           </div>
                        </td>
                        <td style={{ padding:'20px 10px', color:C.muted }}>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td style={{ padding:'20px 10px', fontWeight:800, color: C.text }}>{order.total} <span style={{ fontSize:10, opacity:0.5 }}>MAD</span></td>
                        <td style={{ padding:'20px 10px' }}><StatusBadge status={order.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
             {/* AI Insight Box */}
            <Card style={{ background:`linear-gradient(145deg, ${C.surface} 0%, ${C.emerald}08 100%)`, position: 'relative', overflow: 'hidden', border:`1px solid ${C.emerald}20` }}>
              <div style={{ position: 'absolute', top: -30, right: -30, fontSize: 140, color: C.emerald, opacity: 0.05, pointerEvents: 'none' }}>✦</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 25 }}>
                 <div style={{ color: C.emerald, background:`${C.emerald}15`, p:10, borderRadius:12, width:45, height:45, display:'flex', alignItems:'center', justifyContent:'center' }}><Brain size={28} /></div>
                 <h3 style={{ color:C.emerald, margin: 0, fontSize: 18, fontWeight:800 }}>Insight AI</h3>
              </div>
              <Ornament />
              <p style={{ color:C.text, fontSize:15, lineHeight:1.8, marginTop:28, fontWeight: 400 }}>
                "Votre boutique a reçu <b>18%</b> de visiteurs en plus cette semaine. Les clients s'attardent sur votre collection <b>Artisanat</b>."
              </p>
              <div style={{ marginTop:30, padding:25, background:'rgba(255,255,255,0.02)', border:`1px solid ${C.border}`, borderRadius:20 }}>
                 <div style={{ fontSize:12, color:C.emerald, fontWeight: 800, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, textTransform:'uppercase', letterSpacing:1 }}>
                    <Rocket size={16} /> Action Recommandée
                 </div>
                 <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>
                   Lancez une <b>Vente Flash</b> de 24h sur vos best-sellers pour convertir ces visiteurs en clients.
                 </div>
                 <button style={{ marginTop: 20, width: '100%', padding: '14px', borderRadius: 12, background: `${C.emerald}15`, border: `1px solid ${C.emerald}30`, color: C.emerald, fontSize: 12, fontWeight: 800, cursor: 'pointer', transition:'0.3s' }} onMouseOver={e=>e.target.style.background=`${C.emerald}25`}>
                   ACTIVER LA PROMO
                 </button>
              </div>
            </Card>

            {/* Quick Stats Distribution */}
            <Card style={{ padding: 30 }}>
               <h3 style={{ fontSize: 16, color: C.text, marginBottom: 25, fontWeight:800 }}>Top Catégories</h3>
               {[
                 { name: 'Artisanat', value: 65, color: C.emerald },
                 { name: 'Beauté', value: 25, color: C.emeraldL },
                 { name: 'Décoration', value: 10, color: C.gold },
               ].map(cat => (
                 <div key={cat.name} style={{ marginBottom: 22 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 10, fontWeight:600 }}>
                       <span>{cat.name}</span>
                       <span style={{ color: cat.color }}>{cat.value}%</span>
                    </div>
                    <div style={{ height: 8, background: C.surface2, borderRadius: 10, overflow: 'hidden' }}>
                       <div style={{ height: '100%', width: `${cat.value}%`, background: cat.color, borderRadius: 10, boxShadow:`0 0 10px ${cat.color}40` }} />
                    </div>
                 </div>
               ))}
            </Card>

            {/* Subscription Tier Info */}
            <Card style={{ padding: 30, border:`1px solid ${C.emerald}33`, background:`${C.emerald}05` }}>
               <h3 style={{ fontSize: 16, color: C.emerald, marginBottom: 20, fontWeight:800 }}>Forfait: {store_info?.package_name || 'Gratuit'}</h3>
               <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 8, fontWeight:600 }}>
                    <span>Inventaire:</span>
                    <span style={{ color:C.text }}>{stats?.total_products || 0} / {store_info?.max_products || 10}</span>
                  </div>
                  <div style={{ height: 5, background: C.surface2, borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
                     <div style={{ height: '100%', width: `${Math.min(100, (stats?.total_products / (store_info?.max_products || 10)) * 100)}%`, background: C.emerald, boxShadow:`0 0 10px ${C.emerald}40` }} />
                  </div>
                  <div style={{ color: C.emeraldL, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={12} /> Support Standard Activé</div>
                  <div style={{ color: C.emeraldL, fontSize: 12, fontWeight: 700, marginTop: 6, display: 'flex', alignItems: 'center', gap: 8 }}><CheckCircle size={12} /> Analytics Temps Réel</div>
               </div>
               <button onClick={() => navigate('/onboarding')} style={{ marginTop: 25, width: '100%', padding: '14px', borderRadius: 12, background: C.surface2, border: `1px solid ${C.border}`, color: C.text, fontSize: 12, fontWeight: 800, cursor: 'pointer', transition:'0.3s' }} onMouseOver={e=>e.target.style.borderColor=C.emerald}>
                  CHANGER DE FORFAIT
               </button>
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
