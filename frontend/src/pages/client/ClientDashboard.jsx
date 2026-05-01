import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useClientAuth } from '../../context/ClientAuthContext'
import { getClientOrders } from '../../api/services'
import { C, Spinner, Glass, Card } from '../../components/UI'
import { useTranslation } from 'react-i18next'
import { 
  LogOut, Package, Diamond, Check, User, Heart, MapPin, 
  Settings, Bell, ShoppingBag, ChevronRight, Edit3, Trash2, Clock, Globe
} from 'lucide-react'

const KF = `
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideRight { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
`

export default function ClientDashboard() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const { client, logoutClient } = useClientAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('summary')

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    document.dir = lng === 'ar' ? 'rtl' : 'ltr'
  }

  useEffect(() => {
    if (client) {
      setLoading(true)
      getClientOrders()
        .then(r => setOrders(r.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [client])

  if (!client) return null

  const stats = [
    { label: t('orders'), labelAr: 'الطلبات', value: orders.length, icon: <Package size={20} />, color: C.emerald },
    { label: t('points'), labelAr: 'النقاط', value: client.loyalty_points || 0, icon: <Diamond size={20} />, color: C.gold },
    { label: 'Wishlist', labelAr: 'المفضلة', value: 0, icon: <Heart size={20} />, color: '#ff4d4d' },
    { label: 'Dernier', labelAr: 'آخر طلب', value: orders[0]?.total ? `${orders[0].total} MAD` : '-', icon: <Clock size={20} />, color: C.tealL },
  ]

  const SidebarItem = ({ id, icon, label, labelAr }) => (
    <div 
      onClick={() => setActiveTab(id)}
      style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', 
        borderRadius: 16, cursor: 'pointer', transition: '0.2s',
        background: activeTab === id ? `${C.emerald}15` : 'transparent',
        border: `1px solid ${activeTab === id ? `${C.emerald}40` : 'transparent'}`,
        color: activeTab === id ? C.emerald : C.text,
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {icon}
        <span style={{ fontSize: 14, fontWeight: activeTab === id ? 700 : 500 }}>{label}</span>
      </div>
      <span style={{ fontSize: 12, opacity: 0.6, fontFamily: 'serif' }}>{labelAr}</span>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'Outfit', sans-serif" }}>
      <style>{KF}</style>
      
      {/* ── Navbar ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${C.border}`, padding: '12px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: C.emerald, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>S</div>
          <span style={{ fontWeight: 800, letterSpacing: -0.5 }}>SOUK <span style={{ color: C.emerald }}>✦</span></span>
        </div>
        <button onClick={logoutClient} style={{ background: 'transparent', border: 'none', color: C.danger, display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <LogOut size={16} /> <span style={{ opacity: 0.8 }}>Déconnexion</span>
        </button>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        
        {/* ── Welcome & Stats ── */}
        <section style={{ animation: 'fadeUp 0.6s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Bonjour, {client.name.split(' ')[0]} 👋</h1>
              <p style={{ color: C.muted, margin: '4px 0 0', fontSize: 15 }}>Bienvenue dans votre espace personnel Emerald.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: C.emerald }}>{stats[1].value} <span style={{ fontSize: 14 }}>PTS</span></div>
              <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 }}>Fidélité Mécène</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 40 }}>
            {stats.map((s, i) => (
              <Glass key={i} style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: C.muted, display: 'flex', gap: 5 }}>
                    <span>{s.labelFr}</span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span style={{ fontFamily: 'serif' }}>{s.label}</span>
                  </div>
                </div>
              </Glass>
            ))}
          </div>
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40, alignItems: 'start' }}>
          
          {/* ── Sidebar ── */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SidebarItem id="summary" icon={<ShoppingBag size={18} />} label="Aperçu" labelAr="ملخص" />
            <SidebarItem id="orders" icon={<Package size={18} />} label="Mes Commandes" labelAr="طلباتي" />
            <SidebarItem id="wishlist" icon={<Heart size={18} />} label="Ma Liste" labelAr="المفضلة" />
            <SidebarItem id="profile" icon={<User size={18} />} label="Profil" labelAr="الملف الشخصي" />
            <SidebarItem id="address" icon={<MapPin size={18} />} label="Adresses" labelAr="العناوين" />
            <SidebarItem id="notif" icon={<Bell size={18} />} label="Alertes" labelAr="الإشعارات" />
            <SidebarItem id="settings" icon={<Settings size={18} />} label="Réglages" labelAr="الإعدادات" />
          </aside>

          {/* ── Main Content Area ── */}
          <section style={{ animation: 'slideRight 0.4s ease-out' }}>
            
            {/* 1. PROFILE */}
            {activeTab === 'profile' && (
              <Card style={{ padding: 40 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
                  <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${C.emerald}, ${C.tealL})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#fff', border: `4px solid ${C.surface2}` }}>
                      {client.name[0]}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: 22 }}>{client.name}</h2>
                      <p style={{ color: C.muted, margin: '4px 0' }}>{client.email}</p>
                      <div style={{ display: 'inline-block', padding: '4px 12px', background: `${C.emerald}20`, color: C.emerald, borderRadius: 10, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>PREMIUM</div>
                    </div>
                  </div>
                  <button style={{ background: C.surface2, border: `1px solid ${C.border}`, padding: '10px 20px', borderRadius: 12, color: C.text, fontSize: 13, display: 'flex', gap: 8, alignItems: 'center', cursor: 'pointer' }}>
                    <Edit3 size={16} /> ✏️ تعديل
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div style={{ background: C.surface2, padding: 20, borderRadius: 16 }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Téléphone / رقم الهاتف</div>
                    <div style={{ fontWeight: 600 }}>{client.phone || 'Non renseigné'}</div>
                  </div>
                  <div style={{ background: C.surface2, padding: 20, borderRadius: 16 }}>
                    <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Ville / المدينة</div>
                    <div style={{ fontWeight: 600 }}>{client.city || 'Non renseigné'}</div>
                  </div>
                </div>
              </Card>
            )}

            {/* 2. LOYALTY (Integrated in Summary/Sidebar) */}
            {activeTab === 'summary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                {/* Points Progress */}
                <Glass style={{ padding: 32 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>💰 Points Fidélité <span style={{ fontSize: 14, color: C.muted }}>(10 pts = 1 MAD)</span></h3>
                    <div style={{ fontSize: 20, fontWeight: 800, color: C.gold }}>{client.loyalty_points || 0} pts</div>
                  </div>
                  <div style={{ height: 10, background: C.surface2, borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
                    <div style={{ height: '100%', width: '65%', background: `linear-gradient(90deg, ${C.emerald}, ${C.gold})`, borderRadius: 5 }} />
                  </div>
                  <p style={{ fontSize: 13, color: C.muted, textAlign: 'right' }}>Prochain palier : **500 pts** pour un bon de 50 MAD</p>
                </Glass>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                  {[
                    { label: 'Démarrer Shopping', labelAr: 'بدء التسوق', color: C.emerald, action: () => navigate('/') },
                    { label: 'Suivre Commande', labelAr: 'تتبع الطلبات', color: C.gold, action: () => setActiveTab('orders') },
                    { label: 'Aide & Support', labelAr: 'الدعم الفني', color: C.tealL, action: () => {} },
                  ].map((act, i) => (
                    <div key={i} onClick={act.action} style={{ background: C.surface, border: `1px solid ${C.border}`, padding: 24, borderRadius: 20, textAlign: 'center', cursor: 'pointer', transition: '0.2s' }}
                      onMouseOver={e => e.currentTarget.style.borderColor = act.color}
                      onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: act.color, marginBottom: 4 }}>{act.label}</div>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>{act.labelAr}</div>
                    </div>
                  ))}
                </div>

                {/* Last Activity Preview */}
                <Card style={{ padding: 30 }}>
                  <h3 style={{ marginTop: 0, marginBottom: 20 }}>📦 Dernier Achat</h3>
                  {orders[0] ? (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <div style={{ width: 50, height: 50, borderRadius: 12, background: C.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛍️</div>
                        <div>
                          <div style={{ fontWeight: 700 }}>Commande #{orders[0].id}</div>
                          <div style={{ fontSize: 12, color: C.muted }}>{new Date(orders[0].created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 800 }}>{orders[0].total} MAD</div>
                        <div style={{ fontSize: 10, color: C.emerald, fontWeight: 700, textTransform: 'uppercase' }}>{orders[0].status}</div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: C.muted, margin: 0 }}>Aucun achat récent.</p>
                  )}
                </Card>
              </div>
            )}

            {/* 3. ORDERS LIST */}
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  {['Tous', 'En cours', 'Livrés', 'Annulés'].map(f => (
                    <div key={f} style={{ padding: '8px 16px', background: f === 'Tous' ? C.emerald : C.surface2, color: f === 'Tous' ? '#fff' : C.text, borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{f}</div>
                  ))}
                </div>
                {loading ? <Spinner /> : orders.map(o => (
                  <Card key={o.id} style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                      <div style={{ padding: 12, background: `${C.emerald}10`, borderRadius: 12, color: C.emerald }}><Package size={24} /></div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 16 }}>Commande #{o.id}</div>
                        <div style={{ fontSize: 12, color: C.muted }}>{new Date(o.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', marginBottom: 4 }}>Statut</div>
                        <div style={{ background: o.status === 'delivered' ? `${C.emerald}20` : `${C.gold}20`, color: o.status === 'delivered' ? C.emerald : C.gold, padding: '4px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>{o.status.toUpperCase()}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 900, fontSize: 18, color: C.gold }}>{o.total} MAD</div>
                        <button style={{ border: 'none', background: 'transparent', color: C.emerald, fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}>Détails <ChevronRight size={12} /></button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* 4. WISHLIST */}
            {activeTab === 'wishlist' && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Heart size={60} style={{ color: C.muted, opacity: 0.3, marginBottom: 20 }} />
                <h2 style={{ margin: 0 }}>Votre liste est vide</h2>
                <p style={{ color: C.muted }}>Hifdh l-muntajat l-muhibba l-ikhtishafha lahiqan.</p>
                <GoldBtn onClick={() => navigate('/')} style={{ marginTop: 24 }}>Découvrir les produits</GoldBtn>
              </div>
            )}

            {/* 5. ADDRESSES */}
            {activeTab === 'address' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card style={{ padding: 24, border: `1.5px dashed ${C.emerald}50`, textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ color: C.emerald, fontSize: 32 }}>+</div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>Ajouter une adresse / إضافة عنوان جديد</div>
                </Card>
                <Card style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>Maison <span style={{ fontSize: 10, background: `${C.emerald}20`, color: C.emerald, padding: '2px 6px', borderRadius: 4 }}>PAR DÉFAUT</span></div>
                    <div style={{ fontSize: 13, color: C.muted, marginTop: 4 }}>123 Boulevard Massira, Casablanca, 20000</div>
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button style={{ border: 'none', background: C.surface2, padding: 8, borderRadius: 8, color: C.text }}><Edit3 size={16} /></button>
                    <button style={{ border: 'none', background: `${C.danger}15`, padding: 8, borderRadius: 8, color: C.danger }}><Trash2 size={16} /></button>
                  </div>
                </Card>
              </div>
            )}

            {/* 6. SETTINGS */}
            {activeTab === 'settings' && (
              <Card style={{ padding: 32 }}>
                <h3 style={{ marginTop: 0 }}>⚙️ {t('settings')}</h3>
                
                <div style={{ marginBottom: 30 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Globe size={18} color={C.emerald} /> {t('language')} / اللغة
                  </div>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[
                      { code: 'fr', label: 'Français' },
                      { code: 'ar', label: 'العربية' },
                      { code: 'en', label: 'English' }
                    ].map(lang => (
                      <button 
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        style={{ 
                          flex: 1, padding: '12px', borderRadius: 12, border: `1px solid ${i18n.language === lang.code ? C.emerald : C.border}`,
                          background: i18n.language === lang.code ? `${C.emerald}15` : C.surface2,
                          color: i18n.language === lang.code ? C.emerald : C.text,
                          fontWeight: 700, cursor: 'pointer', transition: '0.2s'
                        }}>
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Changer le mot de passe', sub: 'تغيير كلمة المرور' },
                    { label: 'Notifications Push', sub: 'الإشعارات' },
                    { label: 'Supprimer mon compte', sub: 'حذف الحساب', danger: true },
                  ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: C.surface2, borderRadius: 14, cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontWeight: 600, color: s.danger ? C.danger : C.text }}>{s.label}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>{s.sub}</div>
                      </div>
                      <ChevronRight size={16} style={{ opacity: 0.4 }} />
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </section>
        </div>
      </main>
    </div>
  )
}
