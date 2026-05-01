import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct, createProduct, updateProduct, uploadFile } from '../../api/services'
import { C, GoldBtn, FieldInput, FieldSelect, Spinner, Ornament, Card } from '../../components/UI'
import { Upload, Image as ImageIcon } from 'lucide-react'

const CATS = ['Artisanat','Maroquinerie','Céramique','Textile','Bijoux','Décoration','Autre']

export default function ProductForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm] = useState({
    name:'', description:'', price:'', stock:'', category:'Artisanat', emoji: '📦',
  })
  const [loading, setLoading]   = useState(isEdit)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (isEdit) {
      getProduct(id)
        .then(r => {
          const p = r.data
          setForm({ 
            name:p.name, 
            description:p.description||'', 
            price:p.price,
            stock:p.stock, 
            category:p.category, 
            emoji:p.emoji||'📦',
            image_url:p.image_url||'',
            is_promo: p.is_promo || false,
            promo_price: p.promo_price || 0
          })
        })
        .finally(() => setLoading(false))
    }
  }, [id])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0]
    if (!file) return
    
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await uploadFile(formData)
      setForm(p => ({ ...p, [field]: res.data.url }))
    } catch (err) {
      console.error(err)
      alert("Erreur lors du téléchargement de l'image")
    } finally {
      setSaving(false)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(''); setSaving(true)
    try {
      if (isEdit) await updateProduct(id, form)
      else        await createProduct(form)
      navigate('/products')
    } catch (err) {
      const errs = err.response?.data?.errors
      setError(errs ? Object.values(errs).flat().join(' ') : 'Une erreur est survenue.')
    } finally { setSaving(false) }
  }

  if (loading) return <Spinner />

  return (
    <div style={{ padding:'20px clamp(16px, 3vw, 32px) 32px', animation:'fadeUp .35s ease', maxWidth: 800, margin: '0 auto' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @media (max-width: 600px) {
          .form-row { grid-template-columns: 1fr !important; gap: 0 !important; }
        }
      `}</style>

      {/* Back */}
      <button onClick={() => navigate('/products')} style={{
        background:'transparent', border:`1px solid ${C.border}`, borderRadius:10,
        padding:'6px 12px', color:C.muted, fontSize:12, cursor:'pointer',
        marginBottom:20, fontFamily:"'DM Sans',sans-serif",
      }}>← Retour</button>

      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, marginBottom:4 }}>
        {isEdit ? 'Modifier le' : 'Nouveau'} <span style={{ color:C.gold }}>Produit</span>
      </div>
      <Ornament />

      <form onSubmit={submit} style={{ marginTop:16 }}>
        <FieldInput label="Nom du produit *" value={form.name} onChange={set('name')}
          placeholder="Écharpe laine artisanale" />

        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, color:C.muted, letterSpacing:2, textTransform:'uppercase', marginBottom:6 }}>
            Description
          </div>
          <textarea value={form.description} onChange={set('description')}
            placeholder="Décrivez votre produit…" rows={3}
            style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`,
              borderRadius:12, padding:'13px 16px', color:C.text,
              fontFamily:"'DM Sans',sans-serif", fontSize:14, outline:'none',
              resize:'vertical', transition:'border .2s' }}
            onFocus={e=>e.target.style.borderColor=C.gold}
            onBlur={e=>e.target.style.borderColor=C.border}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
            Image principale du produit *
          </div>
          <div style={{ 
            width: '100%', height: 200, borderRadius: 16, background: C.surface2, 
            border: `2px dashed ${C.border}`, display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer',
            position: 'relative', transition: 'border-color 0.3s'
          }} onMouseOver={e => e.currentTarget.style.borderColor = C.gold} onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
            {form.image_url ? (
              <>
                <img src={form.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: 8, fontSize: 11 }}>Cliquez pour changer</div>
              </>
            ) : (
              <>
                <Upload size={32} color={C.gold} style={{ marginBottom: 12 }} />
                <div style={{ fontWeight: 600, fontSize: 14 }}>Cliquez pour importer une image</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>JPG, PNG ou WebP (max. 2MB)</div>
              </>
            )}
            <input type="file" hidden onChange={e => handleFileUpload(e, 'image_url')} accept="image/*" 
              style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }} />
          </div>
        </div>

        <div className="form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <FieldInput label="Prix (MAD) *" type="number" value={form.price}
            onChange={set('price')} placeholder="320" />
          <FieldInput label="Stock *" type="number" value={form.stock}
            onChange={set('stock')} placeholder="12" />
        </div>

        {/* Promotion Fields */}
        <div style={{ marginBottom: 18, background: 'rgba(201,168,76,0.05)', padding: 14, borderRadius: 14, border: `1px dashed ${C.border}` }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginBottom: form.is_promo ? 12 : 0 }}>
            <input type="checkbox" checked={form.is_promo} onChange={e => setForm(p => ({ ...p, is_promo: e.target.checked }))} style={{ width: 18, height: 18, accentColor: C.gold }} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>🏷️ Appliquer une promotion</span>
          </label>
          {form.is_promo && (
            <div style={{ animation: 'fadeUp 0.3s ease' }}>
              <FieldInput label="Nouveau prix promotionnel (MAD) *" type="number" value={form.promo_price}
                onChange={set('promo_price')} placeholder="250" />
            </div>
          )}
        </div>

        <FieldSelect label="Catégorie *" value={form.category} onChange={set('category')}
          options={CATS.map(c => ({ value:c, label:c }))} />

        {error && (
          <div style={{ background:'rgba(201,76,76,0.1)', border:`1px solid ${C.danger}40`,
            borderRadius:10, padding:'10px 14px', fontSize:12, color:C.danger, marginBottom:14 }}>
            {error}
          </div>
        )}

        <div className="form-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:8 }}>
          <GoldBtn outline onClick={() => navigate('/products')}>Annuler</GoldBtn>
          <GoldBtn type="submit" disabled={saving}>
            {saving ? '⟳ Enregistrement…' : isEdit ? '✦ Modifier' : '✦ Créer'}
          </GoldBtn>
        </div>
      </form>
    </div>
  )
}
