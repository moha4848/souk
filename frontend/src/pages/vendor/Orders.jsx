import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrders } from '../../api/services'
import { C, StatusBadge, Spinner, Ornament } from '../../components/UI'

const TABS = [
  { key:'',           label:'Tous' },
  { key:'processing', label:'En cours' },
  { key:'delivered',  label:'Livrées' },
  { key:'cancelled',  label:'Annulées' },
]

export default function Orders() {
  const navigate = useNavigate()
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab]         = useState('')

  useEffect(() => {
    setLoading(true)
    getOrders({ status: tab })
      .then(r => setOrders(r.data.data ?? r.data))
      .finally(() => setLoading(false))
  }, [tab])

  const summary = [
    { label:'Total',    val: orders.length,                                   color:C.muted },
    { label:'Livrées',  val: orders.filter(o=>o.status==='delivered').length, color:C.tealL },
    { label:'En cours', val: orders.filter(o=>o.status==='processing').length,color:C.gold },
    { label:'Annulées', val: orders.filter(o=>o.status==='cancelled').length, color:C.danger },
  ]

  return (
    <div style={{ paddingBottom:16, animation:'fadeUp .35s ease' }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ padding:'20px clamp(16px, 3vw, 32px) 14px' }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, marginBottom:14 }}>
          Mes <span style={{ color:C.gold }}>Commandes</span>
        </div>

        {/* Summary pills */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {summary.map(s => (
            <div key={s.label} style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`,
              borderRadius:12, padding:'10px 6px', textAlign:'center' }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:s.color }}>
                {s.val}
              </div>
              <div style={{ fontSize:9, color:C.muted, textTransform:'uppercase', letterSpacing:.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:5, background:C.surface, borderRadius:12, padding:4 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex:1, cursor:'pointer', fontFamily:"'DM Sans',sans-serif", transition:'all .2s',
              background: tab===t.key ? C.surface2 : 'transparent',
              border: tab===t.key ? `1px solid ${C.border}` : '1px solid transparent',
              borderRadius:9, padding:'7px 4px', fontSize:11,
              color: tab===t.key ? C.gold : C.muted,
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <Ornament />

      <div style={{ padding:'0 clamp(16px, 3vw, 32px)' }}>
        {loading ? <Spinner /> : orders.length === 0 ? (
          <div style={{ textAlign:'center', color:C.muted, padding:'40px 0',
            fontFamily:"'Cormorant Garamond',serif", fontSize:18 }}>Aucune commande ◇</div>
        ) : orders.map((o, i) => (
          <div key={o.id} onClick={() => navigate(`/orders/${o.id}`)} style={{
            background:C.surface, border:`1px solid ${C.border}`, borderRadius:16,
            padding:14, marginBottom:10, cursor:'pointer', transition:'border .2s',
            animation:`fadeUp .25s ease ${i*0.05}s both`,
          }}
          onMouseOver={e=>e.currentTarget.style.borderColor=C.borderH}
          onMouseOut={e=>e.currentTarget.style.borderColor=C.border}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{o.client_name}</div>
                <div style={{ fontSize:10, color:C.muted, marginTop:2 }}>{o.client_city}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:700, color:C.goldL }}>
                  {o.total} MAD
                </div>
                <div style={{ fontSize:10, color:C.muted, marginTop:1 }}>
                  {new Date(o.created_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              borderTop:`1px solid ${C.border}`, paddingTop:8 }}>
              <div style={{ fontSize:10, color:C.muted, letterSpacing:1 }}>#{o.id}</div>
              <StatusBadge status={o.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
