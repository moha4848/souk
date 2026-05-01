import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getOrder, updateOrderStatus } from '../../api/services'
import { C, GoldBtn, StatusBadge, Spinner, Ornament, FieldSelect } from '../../components/UI'

const STATUS_OPTIONS = [
  { value:'pending',    label:'En attente' },
  { value:'processing', label:'En cours' },
  { value:'shipped',    label:'Expédié' },
  { value:'delivered',  label:'Livré' },
  { value:'cancelled',  label:'Annulé' },
]

export default function OrderDetail() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getOrder(id)
      .then(r => { setOrder(r.data); setNewStatus(r.data.status) })
      .finally(() => setLoading(false))
  }, [id])

  const handleUpdate = async () => {
    setSaving(true)
    await updateOrderStatus(id, newStatus)
    const r = await getOrder(id)
    setOrder(r.data)
    setSaving(false)
  }

  if (loading) return <Spinner />
  if (!order)  return <div style={{ padding:22, color:C.muted }}>Commande introuvable.</div>

  return (
    <div style={{ padding:'20px clamp(16px, 3vw, 32px) 32px', animation:'fadeUp .35s ease', maxWidth: 900, margin: '0 auto' }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <button onClick={() => navigate('/orders')} style={{
        background:'transparent', border:`1px solid ${C.border}`, borderRadius:10,
        padding:'6px 12px', color:C.muted, fontSize:12, cursor:'pointer',
        marginBottom:20, fontFamily:"'DM Sans',sans-serif",
      }}>← Retour</button>

      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, marginBottom:4 }}>
        Commande <span style={{ color:C.gold }}>#{order.id}</span>
      </div>
      <Ornament />

      {/* Client info */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:12 }}>
        <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Client</div>
        {[
          ['👤', 'Nom', order.client_name],
          ['📧', 'Email', order.client_email || '—'],
          ['📞', 'Téléphone', order.client_phone || '—'],
          ['📍', 'Ville', order.client_city || '—'],
        ].map(([ic, label, val]) => (
          <div key={label} style={{ display:'flex', gap:10, alignItems:'center', marginBottom:8 }}>
            <span style={{ fontSize:16, width:24 }}>{ic}</span>
            <span style={{ fontSize:11, color:C.muted, width:72 }}>{label}</span>
            <span style={{ fontSize:13, fontWeight:500 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Order items */}
      {(order.items || []).length > 0 && (
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:12 }}>
          <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Articles</div>
          {order.items.map(item => (
            <div key={item.id} style={{ display:'flex', justifyContent:'space-between',
              alignItems:'center', paddingBottom:8, marginBottom:8,
              borderBottom:`1px solid ${C.border}` }}>
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{item.product_name}</div>
                <div style={{ fontSize:10, color:C.muted }}>Qté: {item.quantity}</div>
              </div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:16, color:C.goldL }}>
                {item.unit_price * item.quantity} MAD
              </div>
            </div>
          ))}
          <div style={{ display:'flex', justifyContent:'space-between', paddingTop:4 }}>
            <span style={{ fontSize:12, color:C.muted }}>Total</span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:C.goldL }}>
              {order.total} MAD
            </span>
          </div>
        </div>
      )}

      {/* Status */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:16, marginBottom:16 }}>
        <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:12 }}>Statut</div>
        <div style={{ marginBottom:12 }}>
          Statut actuel : <StatusBadge status={order.status} />
        </div>
        <FieldSelect label="Changer le statut" value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
          options={STATUS_OPTIONS} />
        <GoldBtn onClick={handleUpdate} disabled={saving || newStatus === order.status}>
          {saving ? '⟳ Mise à jour…' : '✦ Mettre à jour'}
        </GoldBtn>
      </div>

      {order.notes && (
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, padding:16 }}>
          <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:8 }}>Notes</div>
          <div style={{ fontSize:13, color:C.text }}>{order.notes}</div>
        </div>
      )}
    </div>
  )
}
