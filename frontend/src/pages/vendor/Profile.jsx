import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { C, GoldBtn, Pill, Ornament, FieldInput } from '../../components/UI'

// ── Toggle Switch component ─────────────────────────────────────────
const Toggle = ({ on, onToggle, label }) => (
  <div onClick={onToggle} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', padding:'10px 0' }}>
    <span style={{ fontSize:13 }}>{label}</span>
    <div style={{ width:44, height:24, borderRadius:12, background: on ? C.gold : C.surface2, border:`1px solid ${on ? C.gold : C.border}`, padding:2, transition:'all 0.3s', position:'relative' }}>
      <div style={{ width:18, height:18, borderRadius:'50%', background: on ? C.bg : C.muted, transition:'all 0.3s', transform: on ? 'translateX(20px)' : 'translateX(0)' }} />
    </div>
  </div>
)

// ── Section Panel ───────────────────────────────────────────────────
const Panel = ({ children, title }) => (
  <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'16px', marginTop:8, animation:'fadeUp .25s ease' }}>
    {title && <div style={{ fontSize:11, color:C.gold, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>{title}</div>}
    {children}
  </div>
)

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [openSection, setOpenSection] = useState(null)

  // ── Settings state (persisted in localStorage) ─────────────────
  const getSettings = () => JSON.parse(localStorage.getItem('souk_settings') || '{}')
  const saveSetting = (key, val) => {
    const s = getSettings()
    s[key] = val
    localStorage.setItem('souk_settings', JSON.stringify(s))
  }

  const [settings, setSettings] = useState(() => ({
    dark_mode: getSettings().dark_mode ?? true,
    notif_push: getSettings().notif_push ?? true,
    notif_email: getSettings().notif_email ?? true,
    notif_sms: getSettings().notif_sms ?? false,
    shop_name: getSettings().shop_name || user?.name || 'Ma Boutique',
    shop_desc: getSettings().shop_desc || 'Produits artisanaux marocains',
    shop_phone: getSettings().shop_phone || '+212 6XX XXX XXX',
    delivery_amana: getSettings().delivery_amana ?? true,
    delivery_chrono: getSettings().delivery_chrono ?? false,
    delivery_free_above: getSettings().delivery_free_above || '500',
    promo_active: getSettings().promo_active ?? true,
    promo_code: getSettings().promo_code || 'SOUK10',
  }))

  const toggle = (key) => {
    setSettings(p => {
      const nv = { ...p, [key]: !p[key] }
      saveSetting(key, nv[key])
      return nv
    })
  }
  const setField = (key) => (e) => {
    const val = e.target.value
    setSettings(p => ({ ...p, [key]: val }))
    saveSetting(key, val)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleSection = (label) => {
    setOpenSection(prev => prev === label ? null : label)
  }

  // ── Menu config with expandable content ────────────────────────
  const MENU = [
    {
      icon:'🏪', label:'Paramètres boutique', sub: settings.shop_name,
      content: (
        <Panel title="Paramètres de la boutique">
          <FieldInput label="Nom de la boutique" value={settings.shop_name} onChange={setField('shop_name')} />
          <FieldInput label="Description" value={settings.shop_desc} onChange={setField('shop_desc')} />
          <FieldInput label="Téléphone" value={settings.shop_phone} onChange={setField('shop_phone')} />
          <div style={{ fontSize:11, color:C.tealL, marginTop:4 }}>✓ Modifications sauvegardées automatiquement</div>
        </Panel>
      )
    },
    {
      icon:'💳', label:'Paiements & retrait', sub:'CIH Bank · ****4821',
      content: (
        <Panel title="Méthodes de paiement">
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { name:'Cash à la livraison (COD)', icon:'💵', active:true },
              { name:'CIH Bank ****4821', icon:'🏦', active:true },
              { name:'PayPal (Non configuré)', icon:'💳', active:false },
            ].map(m => (
              <div key={m.name} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:C.surface2, borderRadius:10, border:`1px solid ${m.active ? C.tealL+'40' : C.border}` }}>
                <span style={{ fontSize:18 }}>{m.icon}</span>
                <span style={{ flex:1, fontSize:12 }}>{m.name}</span>
                <span style={{ fontSize:10, color: m.active ? C.tealL : C.muted }}>{m.active ? '● Actif' : '○ Inactif'}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize:10, color:C.muted, marginTop:12 }}>Commission SOUK: 5% par transaction</div>
        </Panel>
      )
    },
    {
      icon:'🚚', label:'Livraison', sub: [settings.delivery_amana && 'Amana', settings.delivery_chrono && 'Chronopost'].filter(Boolean).join(', ') || 'Aucun',
      content: (
        <Panel title="Options de livraison">
          <Toggle on={settings.delivery_amana} onToggle={() => toggle('delivery_amana')} label="Amana Express" />
          <Toggle on={settings.delivery_chrono} onToggle={() => toggle('delivery_chrono')} label="Chronopost Maroc" />
          <div style={{ height:1, background:C.border, margin:'8px 0' }} />
          <FieldInput label="Livraison gratuite au-dessus de (MAD)" value={settings.delivery_free_above} onChange={setField('delivery_free_above')} />
        </Panel>
      )
    },
    {
      icon:'📣', label:'Marketing', sub: settings.promo_active ? `Code: ${settings.promo_code}` : 'Inactif',
      content: (
        <Panel title="Promotions & Marketing">
          <Toggle on={settings.promo_active} onToggle={() => toggle('promo_active')} label="Promotions actives" />
          {settings.promo_active && (
            <FieldInput label="Code promo actif" value={settings.promo_code} onChange={setField('promo_code')} />
          )}
          <div style={{ height:1, background:C.border, margin:'8px 0' }} />
          <div style={{ fontSize:12, color:C.muted }}>Réseaux sociaux</div>
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            {['📘 Facebook','📸 Instagram','🐦 Twitter'].map(s => (
              <div key={s} style={{ flex:1, padding:'8px 4px', background:C.surface2, borderRadius:8, textAlign:'center', fontSize:10, color:C.muted, border:`1px solid ${C.border}`, cursor:'pointer' }}>{s}</div>
            ))}
          </div>
        </Panel>
      )
    },
    {
      icon:'📊', label:'Statistiques avancées', sub:'Rapport mensuel PDF',
      content: (
        <Panel title="Rapports">
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {['Rapport Avril 2026','Rapport Mars 2026','Rapport Février 2026'].map((r,i) => (
              <div key={r} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:C.surface2, borderRadius:10, border:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize:12 }}>{r}</div>
                  <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{i===0 ? 'En cours' : 'Disponible'}</div>
                </div>
                <button style={{ background: i===0 ? C.surface2 : `linear-gradient(135deg,${C.gold},${C.copper})`, border:`1px solid ${i===0 ? C.border : C.gold}`, borderRadius:8, padding:'5px 12px', fontSize:10, color: i===0 ? C.muted : C.bg, cursor: i===0 ? 'not-allowed' : 'pointer', fontWeight:600 }}>
                  {i===0 ? '⏳' : '📥 PDF'}
                </button>
              </div>
            ))}
          </div>
        </Panel>
      )
    },
    {
      icon:'🔔', label:'Notifications',
      sub: [settings.notif_push && 'Push', settings.notif_email && 'Email', settings.notif_sms && 'SMS'].filter(Boolean).join(', '),
      content: (
        <Panel title="Préférences de notification">
          <Toggle on={settings.notif_push} onToggle={() => toggle('notif_push')} label="Notifications Push" />
          <Toggle on={settings.notif_email} onToggle={() => toggle('notif_email')} label="Notifications Email" />
          <Toggle on={settings.notif_sms} onToggle={() => toggle('notif_sms')} label="Notifications SMS" />
          <div style={{ fontSize:10, color:C.muted, marginTop:8 }}>Recevez des alertes pour les nouvelles commandes, messages clients, et mises à jour.</div>
        </Panel>
      )
    },
    {
      icon:'🌙', label:'Apparence',
      sub: settings.dark_mode ? 'Thème sombre activé' : 'Thème clair activé',
      content: (
        <Panel title="Apparence & Thème">
          <Toggle on={settings.dark_mode} onToggle={() => toggle('dark_mode')} label="Mode sombre" />
          <div style={{ height:1, background:C.border, margin:'8px 0' }} />
          <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>Accent de couleur</div>
          <div style={{ display:'flex', gap:8 }}>
            {[
              { name:'Or', color:'#c9a84c' },
              { name:'Émeraude', color:'#5cc8b0' },
              { name:'Rose', color:'#c94c7c' },
              { name:'Saphir', color:'#4c7cc9' },
            ].map(c => (
              <div key={c.name} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, cursor:'pointer' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:c.color, border: c.color === C.gold ? `2px solid #fff` : `2px solid transparent`, transition:'all 0.2s' }} />
                <span style={{ fontSize:9, color:C.muted }}>{c.name}</span>
              </div>
            ))}
          </div>
          <div style={{ height:1, background:C.border, margin:'12px 0 8px' }} />
          <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>Taille de police</div>
          <div style={{ display:'flex', gap:6 }}>
            {['Petit','Normal','Grand'].map((s,i) => (
              <button key={s} style={{ flex:1, padding:'8px 0', background: i===1 ? `${C.gold}15` : C.surface2, border:`1px solid ${i===1 ? C.gold : C.border}`, borderRadius:8, fontSize: [11,13,15][i], color: i===1 ? C.gold : C.muted, cursor:'pointer', fontFamily:"'DM Sans',sans-serif" }}>{s}</button>
            ))}
          </div>
        </Panel>
      )
    },
  ]

  return (
    <div style={{ padding:'20px clamp(16px, 3vw, 32px) 16px', animation:'fadeUp .35s ease', maxWidth: 800, margin: '0 auto' }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Avatar hero */}
      <div style={{ textAlign:'center', marginBottom:22 }}>
        <div style={{
          width:78, height:78, borderRadius:'50%',
          background:`linear-gradient(135deg,${C.teal},${C.gold})`,
          display:'flex', alignItems:'center', justifyContent:'center',
          fontSize:30, fontWeight:700, margin:'0 auto 12px',
          border:`2px solid ${C.border}`,
          boxShadow:'0 0 32px rgba(201,168,76,0.2)',
        }}>
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:700 }}>{user?.name}</div>
        <div style={{ fontSize:11, color:C.muted, marginTop:3, letterSpacing:1 }}>{user?.email}</div>
        <div style={{ marginTop:10, display:'flex', justifyContent:'center', gap:8 }}>
          <Pill color={C.gold} bg="rgba(201,168,76,0.1)">✦ Plan {user?.plan === 'pro' ? 'Pro' : 'Gratuit'}</Pill>
          <Pill>Boutique active</Pill>
        </div>
        <div style={{ marginTop:8, fontSize:12, color:C.muted }}>
          📍 {user?.vendor?.shop_name || user?.name} · {user?.vendor?.city || user?.city}
        </div>
      </div>

      <Ornament />

      {/* Quick stats */}
      <div style={{ display:'flex', gap:8, margin:'12px 0 16px' }}>
        {[['📦','Produits'],['🛍️','Commandes'],['👁️','Visites']].map(([ic,l]) => (
          <div key={l} style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`,
            borderRadius:12, padding:'12px 6px', textAlign:'center' }}>
            <div style={{ fontSize:18, marginBottom:4 }}>{ic}</div>
            <div style={{ fontSize:9, color:C.muted, textTransform:'uppercase', letterSpacing:.5 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Menu items with expandable panels */}
      {MENU.map((item, i) => (
        <div key={item.label}>
          <div
            onClick={() => toggleSection(item.label)}
            style={{
              background: openSection === item.label ? C.surface2 : C.surface,
              border:`1px solid ${openSection === item.label ? C.borderH : C.border}`,
              borderRadius: openSection === item.label ? '14px 14px 0 0' : 14,
              padding:'13px 14px', marginBottom: openSection === item.label ? 0 : 8,
              display:'flex', alignItems:'center',
              gap:12, cursor:'pointer', transition:'all .2s',
              animation:`fadeUp .28s ease ${i*0.04}s both`,
            }}
            onMouseOver={e=>e.currentTarget.style.borderColor=C.borderH}
            onMouseOut={e=>{ if(openSection !== item.label) e.currentTarget.style.borderColor=C.border }}
          >
            <span style={{ fontSize:20, width:28, textAlign:'center' }}>{item.icon}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:500 }}>{item.label}</div>
              <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{item.sub}</div>
            </div>
            <span style={{ color: openSection === item.label ? C.gold : C.muted, fontSize:16, transition:'transform 0.3s', transform: openSection === item.label ? 'rotate(90deg)' : 'rotate(0)' }}>›</span>
          </div>
          {openSection === item.label && (
            <div style={{ marginBottom:8, borderLeft:`1px solid ${C.borderH}`, borderRight:`1px solid ${C.borderH}`, borderBottom:`1px solid ${C.borderH}`, borderRadius:'0 0 14px 14px', overflow:'hidden' }}>
              {item.content}
            </div>
          )}
        </div>
      ))}

      <div style={{ marginTop:16 }}>
        <GoldBtn outline onClick={handleLogout}>↩ Se déconnecter</GoldBtn>
      </div>
      <div style={{ textAlign:'center', marginTop:14, fontSize:10, color:C.muted, letterSpacing:1 }}>
        SOUK ✦ v1.0.0 · Oujda, Maroc
      </div>
    </div>
  )
}
