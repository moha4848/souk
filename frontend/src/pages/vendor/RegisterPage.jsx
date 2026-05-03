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
// ── Step indicator ────────────────────────────────────────────────────
function StepBar({ step }) {
  const labels = ['Compte', 'Boutique', 'Validation']
  return (
    <div style={{ marginBottom: 40, padding:'0 20px' }}>
      {/* Progress bar */}
      <div style={{ height: 4, background: C.surface2, borderRadius: 10, marginBottom: 20, overflow: 'hidden', position: 'relative' }}>
        <div style={{
          height: '100%',
          width: `${(step / 3) * 100}%`,
          background: `linear-gradient(90deg, ${C.emerald}, ${C.gold})`,
          borderRadius: 10,
          transition: 'width 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
          boxShadow: `0 0 15px ${C.emerald}60`
        }} />
      </div>
      {/* Step dots */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {labels.map((lbl, i) => {
          const s = i + 1
          const done = step > s
          const active = step === s
          return (
            <div key={lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 12,
                background: done ? C.emerald : active ? C.surface2 : C.surface,
                border: `1.5px solid ${done || active ? C.emerald : C.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 900, color: done ? '#fff' : active ? C.emerald : C.muted,
                transition: 'all 0.4s',
                boxShadow: active ? `0 0 20px ${C.emerald}30` : 'none',
                transform: active ? 'scale(1.1)' : 'none'
              }}>
                {done ? <Check size={16} /> : s}
              </div>
              <span style={{ fontSize: 10, color: active ? '#fff' : C.muted, letterSpacing: 1, textTransform: 'uppercase', fontWeight: active ? 900 : 500 }}>
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
    <div style={{ animation: 'fadeUp 0.6s ease-out' }}>
      <div style={{ marginBottom: 35 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <span style={{ fontSize: 11, color: C.emerald, letterSpacing: 3, textTransform: 'uppercase', fontWeight:900 }}>Étape 01</span>
           <div style={{ flex:1, height:1, background:C.border }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 900, color:'#fff', margin:0 }}>Informations Artisan</h2>
        <p style={{ fontSize: 15, color: C.muted, marginTop: 8, fontWeight:400 }}>Créez votre identité de vendeur SOUK ✦</p>
      </div>
      
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <FieldInput label="Nom complet" value={data.name} onChange={set('name')} placeholder="Mohamed Al Mansouri" />
        <FieldInput label="Email professionnel" type="email" value={data.email} onChange={set('email')} placeholder="vous@souk.ma" />
        
        <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:15 }}>
           <FieldInput label="Téléphone" value={data.phone} onChange={set('phone')} placeholder="+212 6XX XXX XXX" />
           <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontWeight:700 }}>Langue</div>
              <select value={data.language} onChange={set('language')} style={{ width: '100%', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 12px', color: C.text, fontSize: 14, outline: 'none' }}>
                {LANGS.map(l => <option key={l.value} value={l.value} style={{background:C.surface}}>{l.label}</option>)}
              </select>
           </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:15 }}>
           <FieldInput label="Mot de passe" type="password" value={data.password} onChange={set('password')} placeholder="••••••••" />
           <FieldInput label="Confirmation" type="password" value={data.password_confirmation} onChange={set('password_confirmation')} placeholder="••••••••" />
        </div>
      </div>

      {error && <ErrorBox msg={error} />}
      
      <GoldBtn disabled={!ok} onClick={onNext} style={{ marginTop:40, width:'100%', padding:'20px', borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', gap:12, fontSize:14, fontWeight:900 }}>
        CONTINUER L'INSTALLATION <ArrowRight size={20} />
      </GoldBtn>
    </div>
  )
}

// ── Step 2: Store ─────────────────────────────────────────────────────
function Step2({ data, set, error, onNext, onBack }) {
  const ok = data.store_name && data.store_slug
  return (
    <div style={{ animation: 'fadeUp 0.6s ease-out' }}>
      <div style={{ marginBottom: 35 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <span style={{ fontSize: 11, color: C.gold, letterSpacing: 3, textTransform: 'uppercase', fontWeight:900 }}>Étape 02</span>
           <div style={{ flex:1, height:1, background:C.border }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 900, color:'#fff', margin:0 }}>Configuration Boutique</h2>
        <p style={{ fontSize: 15, color: C.muted, marginTop: 8, fontWeight:400 }}>Définissez l'adresse de votre échoppe digitale.</p>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <FieldInput
          label="Nom de l'enseigne"
          value={data.store_name}
          onChange={e => {
            set('store_name')(e)
            set('store_slug')({ target: { value: slugify(e.target.value) } })
          }}
          placeholder="Ma Boutique Artisanale"
        />

        <div>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontWeight:700 }}>URL de la boutique</div>
          <div style={{ display: 'flex', alignItems: 'center', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', padding:'4px' }}>
            <span style={{ padding: '0 15px', fontSize: 14, color: C.muted, fontWeight:700 }}>souk.ma/</span>
            <input
              value={data.store_slug}
              onChange={set('store_slug')}
              placeholder="ma-boutique"
              style={{ flex: 1, background: 'transparent', border: 'none', padding: '14px 0', color: C.emerald, fontSize: 15, outline: 'none', fontWeight:900 }}
            />
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontWeight:700 }}>Description de la marque</div>
          <textarea
            value={data.store_description}
            onChange={set('store_description')}
            placeholder="Décrivez votre savoir-faire et vos valeurs…"
            rows={4}
            style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 16, padding: '15px 20px', color: C.text, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box', lineHeight:1.6 }}
            onFocus={e => e.target.style.borderColor = C.emerald}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: 15 }}>
          <div>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontWeight:700 }}>Pays d'origine</div>
            <select value={data.country} onChange={set('country')} style={{ width: '100%', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 12px', color: C.text, fontSize: 14, outline: 'none' }}>
              <option value="MA">Maroc 🇲🇦</option>
              <option value="FR">France 🇫🇷</option>
              <option value="DZ">Algérie 🇩🇿</option>
              <option value="TN">Tunisie 🇹🇳</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: 11, color: C.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, fontWeight:700 }}>Fuseau horaire</div>
            <select value={data.timezone} onChange={set('timezone')} style={{ width: '100%', background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 12px', color: C.text, fontSize: 14, outline: 'none' }}>
              {TIMEZONES.map(t => <option key={t.value} value={t.value} style={{ background: C.surface }}>{t.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {error && <ErrorBox msg={error} />}
      
      <div style={{ display: 'flex', gap: 15, marginTop:40 }}>
        <button onClick={onBack} style={{ padding: '18px 25px', borderRadius: 20, border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s' }}>
          <ArrowLeft size={20} />
        </button>
        <GoldBtn disabled={!ok} onClick={onNext} style={{ flex: 1, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', gap:12, fontSize:14, fontWeight:900 }}>
          CONFIGURER LE THÈME <ArrowRight size={20} />
        </GoldBtn>
      </div>
    </div>
  )
}

// ── Step 3: Validation ────────────────────────────────────────────────
function Step3({ data, set, error, loading, onBack, onSubmit }) {
  const ok = data.terms && data.privacy
  return (
    <div style={{ animation: 'fadeUp 0.6s ease-out' }}>
      <div style={{ marginBottom: 35 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
           <span style={{ fontSize: 11, color: C.emerald, letterSpacing: 3, textTransform: 'uppercase', fontWeight:900 }}>Étape 03</span>
           <div style={{ flex:1, height:1, background:C.border }} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, fontWeight: 900, color:'#fff', margin:0 }}>Validation Finale</h2>
        <p style={{ fontSize: 15, color: C.muted, marginTop: 8, fontWeight:400 }}>Revoyez vos informations avant le lancement.</p>
      </div>

      <div style={{ background: `linear-gradient(145deg, ${C.surface} 0%, ${C.bg} 100%)`, border: `1px solid ${C.border}`, borderRadius: 24, padding: '25px', marginBottom: 30, position:'relative', overflow:'hidden' }}>
        <ZelligeBg opacity={0.05} />
        <div style={{ fontSize: 11, color: C.emerald, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, fontWeight:900, display:'flex', alignItems:'center', gap:8 }}>
           <Check size={14} /> Récapitulatif du profil
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
           <Row label="Artisan" val={data.name} />
           <Row label="Email" val={data.email} />
           <Row label="Enseigne" val={data.store_name} />
           <Row label="Adresse SOUK" val={`souk.ma/${data.store_slug}`} color={C.emerald} />
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
         <CheckRow
           checked={data.terms}
           onChange={() => set('terms')({ target: { value: !data.terms } })}
           label={<>J'accepte les <a href="#" style={{ color: C.emerald, textDecoration: 'none', fontWeight:700 }}>Conditions d'Utilisation</a></>}
         />
         <CheckRow
           checked={data.privacy}
           onChange={() => set('privacy')({ target: { value: !data.privacy } })}
           label={<>J'accepte la <a href="#" style={{ color: C.emerald, textDecoration: 'none', fontWeight:700 }}>Politique de Confidentialité</a></>}
         />
      </div>

      {error && <ErrorBox msg={error} />}
      
      <div style={{ display: 'flex', gap: 15, marginTop: 40 }}>
        <button onClick={onBack} style={{ padding: '18px 25px', borderRadius: 20, border: `1px solid ${C.border}`, background: C.surface, color: C.text, cursor: 'pointer', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.3s' }}>
          <ArrowLeft size={20} />
        </button>
        <GoldBtn disabled={!ok || loading} onClick={onSubmit} style={{ flex: 1, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', gap:12, fontSize:14, fontWeight:900 }}>
          {loading ? (
             <>
               <div style={{ width: 18, height: 18, border: `3px solid rgba(255,255,255,0.2)`, borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
               DÉPLOIEMENT...
             </>
          ) : (
            <>
              <Sparkles size={20} /> LANCER MA BOUTIQUE
            </>
          )}
        </GoldBtn>
      </div>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────
const ErrorBox = ({ msg }) => (
  <div style={{ background: `${C.danger}10`, border: `1px solid ${C.danger}30`, backdropFilter:'blur(10px)', borderRadius: 16, padding: '16px 20px', fontSize: 13, color: C.danger, marginBottom: 20, fontWeight:600 }}>{msg}</div>
)
const Row = ({ label, val, color = '#fff' }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems:'center', padding:'10px 0', borderBottom:`1px solid ${C.border}10` }}>
    <span style={{ color: C.muted, fontSize:13, fontWeight:500 }}>{label}</span>
    <span style={{ color, fontWeight: 800, fontSize:14 }}>{val}</span>
  </div>
)
const CheckRow = ({ checked, onChange, label }) => (
  <div onClick={onChange} style={{ 
    display: 'flex', gap: 15, alignItems: 'center', padding:'18px 22px', borderRadius:20, 
    background: checked ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.02)', 
    border:`1px solid ${checked ? `${C.emerald}50` : `${C.border}`}`, 
    backdropFilter:'blur(10px)',
    cursor: 'pointer', transition:'0.4s cubic-bezier(0.23, 1, 0.32, 1)' 
  }}>
    <div style={{ width: 22, height: 22, borderRadius: 8, border: `2px solid ${checked ? C.emerald : C.border}`, background: checked ? C.emerald : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0, transition: 'all 0.3s' }}>
      {checked ? <Check size={14} /> : ''}
    </div>
    <span style={{ fontSize: 13, color: checked ? '#fff' : C.muted, fontWeight: checked ? 700 : 400 }}>{label}</span>
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
      display: 'flex',
      background: C.bg,
      color: C.text,
      fontFamily: "'Outfit', sans-serif"
    }}>
      <style>{KF}</style>

      {/* ── Left Side: Artistic Branding (Desktop Only) ── */}
      <div className="hide-mobile" style={{
        flex: 1.2,
        background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bg} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRight: `1px solid ${C.border}`,
        overflow: 'hidden'
      }}>
        <ZelligeBg opacity={0.15} />
        
        {/* Glow Effects */}
        <div style={{ position:'absolute', top:'-10%', left:'-10%', width:500, height:500, background:C.emerald, filter:'blur(200px)', opacity:0.1 }} />
        <div style={{ position:'absolute', bottom:'-10%', right:'-10%', width:400, height:400, background:C.gold, filter:'blur(150px)', opacity:0.05 }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: 60, animation: 'fadeUp 1s ease-out' }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:40 }}>
             <img src="/logo.png" alt="SOUK" style={{ height: 100, width: 'auto', filter: 'drop-shadow(0 0 40px rgba(16,185,129,0.4))' }} />
          </div>
          
          <h1 style={{ 
            fontSize: 48, fontWeight: 900, margin: '0 0 25px', letterSpacing: '-2px', 
            fontFamily:"'Playfair Display', serif", color:'#fff', lineHeight: 1.1
          }}>
            Propulsez votre <br/> <span style={{ color: C.emerald }}>Artisanat</span> au sommet.
          </h1>
          
          <div style={{ width:80, height:2, background:C.gold, margin:'0 auto 30px' }} />
          
          <p style={{ color: C.muted, fontSize: 18, maxWidth: 450, margin: '0 auto', lineHeight: 1.8, fontWeight: 300 }}>
            Rejoignez la première plateforme SaaS dédiée aux maîtres artisans marocains et commencez à vendre en 5 minutes.
          </p>

          <div style={{ marginTop:60, display:'flex', gap:20, justifyContent:'center' }}>
             {[1,2,3].map(i => (
               <div key={i} style={{ 
                 width:100, height:130, borderRadius:20, background:C.surface2, 
                 border:`1px solid ${C.border}`, overflow:'hidden', transform: `translateY(${i*15}px)`,
                 display:'flex', alignItems:'center', justifyContent:'center', color:C.emerald, opacity:0.3
               }}>
                  <Sparkles size={40} />
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* ── Right Side: Wizard Form ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 40px',
        position: 'relative',
        overflowY: 'auto'
      }}>
        <div style={{ width: '100%', maxWidth: 500, animation: 'fadeUp 0.8s cubic-bezier(0.23, 1, 0.32, 1)' }}>
          {/* Logo only on mobile */}
          <div className="show-mobile" style={{ textAlign: 'center', marginBottom: 50 }}>
             <img src="/logo.png" alt="SOUK" style={{ height: 80, width: 'auto' }} />
          </div>

          <div style={{ marginBottom: 45 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:15 }}>
               <div style={{ width:24, height:1, background:C.gold }} />
               <span style={{ fontSize:12, fontWeight:900, color:C.gold, letterSpacing:2, textTransform:'uppercase' }}>Onboarding Vendeur</span>
            </div>
            <h2 style={{ fontSize: 36, margin: '0 0 12px', fontWeight: 900, color:'#fff', letterSpacing:'-1px' }}>Lancer votre échoppe</h2>
            <p style={{ color: C.muted, margin: 0, fontSize: 16, fontWeight: 400 }}>Suivez les étapes pour configurer votre boutique.</p>
          </div>

          <StepBar step={step} />
          
          <div style={{ display:'flex', justifyContent:'center', marginBottom:30 }}><Ornament /></div>

          <div style={{ minHeight: 400 }}>
            {step === 1 && <Step1 data={form} set={set} error={error} onNext={validateStep} />}
            {step === 2 && <Step2 data={form} set={set} error={error} onNext={validateStep} onBack={() => setStep(1)} />}
            {step === 3 && <Step3 data={form} set={set} error={error} loading={loading} onBack={() => setStep(2)} onSubmit={submit} />}
          </div>

          <div style={{ textAlign: 'center', marginTop: 40, fontSize: 14, color: C.muted, borderTop: `1px solid ${C.border}`, paddingTop: 30 }}>
            Déjà artisan sur SOUK ?{' '}
            <Link to="/login" style={{ color: C.emerald, textDecoration: 'none', fontWeight: 800, marginLeft:5 }}>Se connecter</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
