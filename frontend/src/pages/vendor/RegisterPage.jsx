import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as apiRegister } from '../../api/services'
import { C, GoldBtn, FieldInput, ZelligeBg, Ornament } from '../../components/UI'
import { Check, Image, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react'

// ── keyframes ────────────────────────────────────────────────────────
const KF = `
@keyframes slideRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
@keyframes slideLeft  { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
@keyframes fadeUp     { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
@keyframes spin       { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
`

const LANGS = [
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
]

const TIMEZONES = [
  { value: 'Africa/Casablanca', label: '(GMT+1) Casablanca' },
  { value: 'Europe/Paris', label: '(GMT+2) Paris' },
  { value: 'UTC', label: '(UTC) Universal' },
]

function slugify(s) {
  return s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// ── Step indicator ────────────────────────────────────────────────────
function StepBar({ step }) {
  const labels = ['Compte', 'Boutique', 'Validation']
  return (
    <div style={{ marginBottom: 28 }}>
      {/* Progress bar */}
      <div style={{ height: 3, background: C.border, borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${(step / 3) * 100}%`,
          background: `linear-gradient(90deg, ${C.teal}, ${C.gold})`,
          borderRadius: 2,
          transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      {/* Step dots */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {labels.map((lbl, i) => {
          const s = i + 1
          const done = step > s
          const active = step === s
          return (
            <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: done ? `linear-gradient(135deg,${C.gold},${C.copper})` : active ? C.surface2 : C.surface,
                border: `2px solid ${done || active ? C.gold : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: done ? C.bg : active ? C.gold : C.muted,
                transition: 'all 0.4s',
              }}>
                {done ? <Check size={14} /> : s}
              </div>
              <span style={{ fontSize: 9, color: active ? C.gold : C.muted, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                {lbl}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 1: Account ───────────────────────────────────────────────────
function Step1({ data, set, error, onNext }) {
  const ok = data.name && data.email && data.password && data.password.length >= 8
  return (
    <div style={{ animation: 'slideRight 0.4s ease-out' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Étape 1 / 4</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700 }}>Créer votre compte</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Informations personnelles du vendeur</div>
      </div>
      <FieldInput label="Nom complet" value={data.name} onChange={set('name')} placeholder="Mohamed AlMahdi" />
      <FieldInput label="Email" type="email" value={data.email} onChange={set('email')} placeholder="vous@example.com" />
      <FieldInput label="Téléphone (optionnel)" value={data.phone} onChange={set('phone')} placeholder="+212 6XX XXX XXX" />
      {/* Language selector */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Langue</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {LANGS.map(l => (
            <button key={l.value} onClick={() => set('language')({ target: { value: l.value } })}
              style={{
                flex: 1, padding: '9px 4px', borderRadius: 10, cursor: 'pointer',
                background: data.language === l.value ? `linear-gradient(135deg,${C.gold}22,${C.copper}11)` : C.surface2,
                border: `1.5px solid ${data.language === l.value ? C.gold : C.border}`,
                color: data.language === l.value ? C.gold : C.muted, fontSize: 11,
                transition: 'all 0.2s',
              }}>
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <FieldInput label="Mot de passe (8 min)" type="password" value={data.password} onChange={set('password')} placeholder="••••••••" />
      <FieldInput label="Confirmer mot de passe" type="password" value={data.password_confirmation} onChange={set('password_confirmation')} placeholder="••••••••" />
      {error && <ErrorBox msg={error} />}
      <GoldBtn disabled={!ok} onClick={onNext} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>Continuer <ArrowRight size={18} /></GoldBtn>
    </div>
  )
}

// ── Step 2: Store ─────────────────────────────────────────────────────
function Step2({ data, set, error, onNext, onBack }) {
  const ok = data.store_name && data.store_slug
  return (
    <div style={{ animation: 'slideRight 0.4s ease-out' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Étape 2 / 3</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700 }}>Créer votre boutique</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Paramètres de votre espace de vente</div>
      </div>
      <FieldInput
        label="Nom de la boutique"
        value={data.store_name}
        onChange={e => {
          set('store_name')(e)
          set('store_slug')({ target: { value: slugify(e.target.value) } })
        }}
        placeholder="Ma Super Boutique"
      />
      {/* Slug preview */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>URL de la boutique</div>
        <div style={{ display: 'flex', alignItems: 'center', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <span style={{ padding: '13px 10px 13px 14px', fontSize: 12, color: C.muted, whiteSpace: 'nowrap' }}>souk.ma/</span>
          <input
            value={data.store_slug}
            onChange={set('store_slug')}
            placeholder="ma-boutique"
            style={{ flex: 1, background: 'transparent', border: 'none', padding: '13px 14px 13px 0', color: C.gold, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none' }}
          />
        </div>
      </div>
      {/* Description */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Description (optionnel)</div>
        <textarea
          value={data.store_description}
          onChange={set('store_description')}
          placeholder="Décrivez votre boutique en quelques mots…"
          rows={3}
          style={{ width: '100%', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '13px 16px', color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
          onFocus={e => e.target.style.borderColor = C.gold}
          onBlur={e => e.target.style.borderColor = C.border}
        />
      </div>
      {/* Logo upload */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Logo (optionnel)</div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: C.surface2, border: `1.5px dashed ${C.border}`, borderRadius: 12, padding: '14px 16px', transition: 'border 0.2s' }}
          onMouseOver={e => e.currentTarget.style.borderColor = C.gold}
          onMouseOut={e => e.currentTarget.style.borderColor = C.border}
        >
          <div style={{ color: C.gold }}><Image size={24} /></div>
          <div>
            <div style={{ fontSize: 13, color: C.text }}>{data.logo_name || 'Choisir une image'}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>PNG, JPG ou SVG · max 2 MB</div>
          </div>
          <input type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files[0]
              if (f) {
                set('logo')({ target: { value: f } })
                set('logo_name')({ target: { value: f.name } })
              }
            }}
          />
        </label>
      </div>
      {/* Country + Timezone */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Pays</div>
          <select value={data.country} onChange={set('country')} style={{ width: '100%', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '13px 12px', color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: 'none' }}>
            <option value="MA">Maroc</option>
            <option value="FR">France</option>
            <option value="DZ">Algérie</option>
            <option value="TN">Tunisie</option>
          </select>
        </div>
        <div>
          <div style={{ fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>Fuseau horaire</div>
          <select value={data.timezone} onChange={set('timezone')} style={{ width: '100%', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '13px 12px', color: C.text, fontFamily: "'DM Sans',sans-serif", fontSize: 13, outline: 'none' }}>
            {TIMEZONES.map(t => <option key={t.value} value={t.value} style={{ background: C.surface }}>{t.label}</option>)}
          </select>
        </div>
      </div>
      {error && <ErrorBox msg={error} />}
      <div style={{ display: 'flex', gap: 10 }}>
        <GoldBtn outline onClick={onBack} style={{ width: 'auto', padding: '13px 22px', flex: '0 0 auto', display:'flex', alignItems:'center', gap:8 }}>
          <ArrowLeft size={18} /> Retour
        </GoldBtn>
        <GoldBtn disabled={!ok} onClick={onNext} style={{ flex: 1, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          Continuer <ArrowRight size={18} />
        </GoldBtn>
      </div>
    </div>
  )
}

// ── Step 3: Validation ────────────────────────────────────────────────
function Step3({ data, set, error, loading, onBack, onSubmit }) {
  const ok = data.terms && data.privacy
  return (
    <div style={{ animation: 'slideRight 0.4s ease-out' }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Étape 3 / 3</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 700 }}>Validation finale</div>
        <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>Lisez et acceptez avant de lancer votre boutique</div>
      </div>

      {/* Summary card */}
      <div style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px', marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.gold, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>Récapitulatif</div>
        <Row label="Vendeur" val={data.name} />
        <Row label="Email" val={data.email} />
        <Row label="Boutique" val={data.store_name} />
        <Row label="URL" val={`souk.ma/${data.store_slug}`} color={C.gold} />
      </div>

      {/* Checkboxes */}
      <CheckRow
        checked={data.terms}
        onChange={() => set('terms')({ target: { value: !data.terms } })}
        label={<>J'accepte les <a href="#" style={{ color: C.gold, textDecoration: 'none' }}>Conditions Générales d'Utilisation</a> de SOUK</>}
      />
      <CheckRow
        checked={data.privacy}
        onChange={() => set('privacy')({ target: { value: !data.privacy } })}
        label={<>J'accepte la <a href="#" style={{ color: C.gold, textDecoration: 'none' }}>Politique de Confidentialité</a> et le traitement de mes données</>}
      />

      {error && <ErrorBox msg={error} />}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        <GoldBtn outline onClick={onBack} style={{ width: 'auto', padding: '13px 22px', flex: '0 0 auto', display:'flex', alignItems:'center', gap:8 }}>
          <ArrowLeft size={18} /> Retour
        </GoldBtn>
        <GoldBtn disabled={!ok || loading} onClick={onSubmit} style={{ flex: 1, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ display: 'inline-block', width: 14, height: 14, border: `2px solid ${C.bg}`, borderTop: `2px solid ${C.gold}`, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              Inscription en cours…
            </span>
          ) : (
            <>
              <Sparkles size={18} /> Finaliser l'inscription
            </>
          )}
        </GoldBtn>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────
const ErrorBox = ({ msg }) => (
  <div style={{ background: 'rgba(201,76,76,0.1)', border: `1px solid ${C.danger}40`, borderRadius: 10, padding: '10px 14px', fontSize: 12, color: C.danger, marginBottom: 14 }}>{msg}</div>
)
const Row = ({ label, val, color = C.text }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7, fontSize: 12 }}>
    <span style={{ color: C.muted }}>{label}</span>
    <span style={{ color, fontWeight: 600 }}>{val}</span>
  </div>
)
const CheckRow = ({ checked, onChange, label }) => (
  <div onClick={onChange} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14, cursor: 'pointer' }}>
    <div style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${checked ? C.gold : C.border}`, background: checked ? `linear-gradient(135deg,${C.gold},${C.copper})` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.bg, flexShrink: 0, marginTop: 1, transition: 'all 0.2s' }}>
      {checked ? <Check size={12} /> : ''}
    </div>
    <span style={{ fontSize: 12, color: C.muted, lineHeight: 1.6 }}>{label}</span>
  </div>
)

// ── Main Wizard ───────────────────────────────────────────────────────
export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    // Step 1
    name: '', email: '', phone: '', language: 'fr', password: '', password_confirmation: '',
    // Step 2
    store_name: '', store_slug: '', store_description: '', logo: null, logo_name: '', country: 'MA', timezone: 'Africa/Casablanca',
    // Step 3
    plan: 'free',
    // Step 4
    terms: false, privacy: false,
  })

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const validateStep = () => {
    setError('')
    if (step === 1) {
      if (!form.name) return setError('Le nom est requis.')
      if (!form.email) return setError("L'email est requis.")
      if (form.password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères.')
      if (form.password !== form.password_confirmation) return setError('Les mots de passe ne correspondent pas.')
    }
    if (step === 2) {
      if (!form.store_name) return setError('Le nom de la boutique est requis.')
      if (!form.store_slug) return setError("L'URL de la boutique est requise.")
    }
    setStep(s => s + 1)
  }

  const submit = async () => {
    setLoading(true)
    setError('')
    try {
      const payload = new FormData()
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== undefined && k !== 'terms' && k !== 'privacy' && k !== 'logo') {
          payload.append(k, v)
        }
      })
      payload.append('role', 'vendor')
      if (form.logo) payload.append('logo', form.logo)

      const r = await apiRegister(payload)
      if (r.data.token) localStorage.setItem('souk_token', r.data.token)
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration Error:', err)
      const errs = err.response?.data?.errors
      if (errs) {
        setError(Object.values(errs).flat().join(' '))
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Le serveur a rencontré un problème. Vérifiez si l\'email ou l\'URL de boutique est déjà utilisé.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 30% 0%, rgba(201,168,76,0.06) 0%, ${C.bg} 55%)`,
      display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 16px',
    }}>
      <style>{KF}</style>

      <div style={{
        width: '100%', maxWidth: 520, background: C.bg, borderRadius: 32,
        border: `1.5px solid ${C.border}`, overflow: 'hidden',
        boxShadow: '0 0 80px rgba(201,168,76,0.07), 0 40px 80px rgba(0,0,0,0.75)',
        animation: 'fadeUp 0.5s ease-out',
      }}>

        {/* Header */}
        <div style={{ position: 'relative', padding: '28px 28px 0' }}>
          <ZelligeBg height={120} />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: 20 }}>
            <img src="/logo.png" alt="SOUK Logo" style={{ height: 60, objectFit: 'contain', marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: C.muted, marginTop: 3, letterSpacing: 1 }}>Onboarding vendeur</div>
          </div>

          <StepBar step={step} />
        </div>

        {/* Step content */}
        <div style={{ padding: '4px 28px 32px' }}>
          <Ornament />
          <div style={{ marginTop: 20 }}>
            {step === 1 && <Step1 data={form} set={set} error={error} onNext={validateStep} />}
            {step === 2 && <Step2 data={form} set={set} error={error} onNext={validateStep} onBack={() => setStep(1)} />}
            {step === 3 && <Step3 data={form} set={set} error={error} loading={loading} onBack={() => setStep(2)} onSubmit={submit} />}
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: C.muted }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: C.gold, textDecoration: 'none' }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
