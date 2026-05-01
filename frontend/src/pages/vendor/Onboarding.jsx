import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { me, getPackages, updateProjectType, subscribeToPackage } from '../../api/services'
import { C, GoldBtn, Ornament, Card, ZelligeBg, Spinner } from '../../components/UI'

const PROJECT_TYPES = [
  { id: 'artisan', label: 'Artisanat & Fait Main', icon: '🏺', desc: 'Produits traditionnels, poterie, tapis...' },
  { id: 'vetements', label: 'Mode & Vêtements', icon: '👗', desc: 'Caftans, habits modernes, accessoires...' },
  { id: 'electronique', label: 'Électronique', icon: '💻', desc: 'Gadgets, accessoires tech, matériel...' },
  { id: 'services', label: 'Services & Autres', icon: '✨', desc: 'Prestations, produits numériques...' },
]

export default function Onboarding() {
  const { user, setUser, logout, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState('loading')
  const [packages, setPackages] = useState([])
  const [projectType, setProjectType] = useState(null)
  const [pkg, setPkg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (authLoading) return
    
    // Determine step based on user state
    if (!user) { navigate('/login'); return }
    
    if (user.status === 'pending') setStep('waiting_account')
    else if (!user.project_type) setStep('project_type')
    else if (user.vendor?.active_subscription) navigate('/dashboard')
    else if (user.vendor?.subscriptions?.some(s => s.status === 'pending')) setStep('waiting_package')
    else setStep('package')

    // Fetch packages if we reach the package step
    getPackages().then(r => setPackages(r.data)).catch(console.error)
  }, [user, authLoading])

  const checkStatus = async () => {
    setRefreshing(true)
    try {
      const r = await me()
      setUser(r.data)
    } catch (err) {
      console.error(err)
    } finally {
      setRefreshing(false)
    }
  }

  const handleSelectProject = async (type) => {
    setLoading(true)
    try {
      await updateProjectType(type)
      setProjectType(type)
      setStep('package')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!pkg) return
    setLoading(true)
    try {
      await subscribeToPackage(pkg.id)
      setStep('waiting_package')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'loading' || authLoading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><Spinner /></div>


  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <ZelligeBg height={300} />
      
      <div style={{ width: '100%', maxWidth: 500, position: 'relative', zIndex: 1 }}>
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <Ornament />
          

          
          {step === 'waiting_account' && (
            <div style={{ animation: 'fadeUp 0.5s ease' }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>⏳</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, marginBottom: 12 }}>Compte en attente</h2>
              <p style={{ color: C.muted, lineHeight: 1.6, marginBottom: 30 }}>
                Marhba bik <b>{user?.name}</b> ! Votre compte vendeur SOUK a été créé avec succès. 
                <br /><br />
                Un administrateur va valider votre identité avant que vous ne puissiez configurer votre boutique. Vous recevrez un email dès que votre accès sera ouvert.
              </p>
              <div style={{ display:'flex', gap: 10, justifyContent:'center' }}>
                <GoldBtn onClick={checkStatus} disabled={refreshing}>
                  {refreshing ? 'Vérification...' : 'Actualiser le statut'}
                </GoldBtn>
                <GoldBtn onClick={logout} outline>Se déconnecter</GoldBtn>
              </div>
            </div>
          )}

          {step === 'project_type' && (
            <div style={{ animation: 'fadeUp 0.5s ease' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, marginBottom: 8 }}>Quel est votre projet ?</h2>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Cela nous aidera à personnaliser votre interface</p>
              
              <div style={{ display: 'grid', gap: 12, marginBottom: 20 }}>
                {PROJECT_TYPES.map(t => (
                  <button key={t.id} onClick={() => handleSelectProject(t.id)} style={{
                    display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 16,
                    background: C.surface2, border: `1px solid ${C.border}`, cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.2s'
                  }} onMouseOver={e => e.currentTarget.style.borderColor = C.gold} onMouseOut={e => e.currentTarget.style.borderColor = C.border}>
                    <span style={{ fontSize: 24 }}>{t.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: C.text }}>{t.label}</div>
                      <div style={{ fontSize: 11, color: C.muted }}>{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div style={{ display:'flex', justifyContent:'center', marginTop: 10 }}>
                <GoldBtn onClick={logout} outline style={{ padding: '8px 16px', fontSize: 13 }}>Se déconnecter</GoldBtn>
              </div>
            </div>
          )}

          {step === 'package' && (
            <div style={{ animation: 'fadeUp 0.5s ease' }}>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 26, marginBottom: 8 }}>Choisissez votre formule</h2>
              <p style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>Sélectionnez le pack qui correspond à vos besoins</p>
              
              <div style={{ display: 'grid', gap: 12, marginBottom: 30 }}>
                {packages.map(p => {
                  const sel = pkg?.id === p.id
                  const icons = { 1: '🌱', 2: '🚀', 3: '🏆' }
                  return (
                    <button key={p.id} onClick={() => setPkg(p)} style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: 16, borderRadius: 16,
                      background: sel ? `${C.gold}11` : C.surface2, 
                      border: `2px solid ${sel ? C.gold : C.border}`, 
                      cursor: 'pointer', textAlign: 'left', width: '100%'
                    }}>
                      <span style={{ fontSize: 24 }}>{icons[p.id] || '📦'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: sel ? C.gold : C.text }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: C.muted }}>Jusqu'à {p.max_products} produits</div>
                      </div>
                      <div style={{ fontWeight: 800, color: C.text }}>{p.price} MAD</div>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <GoldBtn outline onClick={() => setStep('project_type')}>Retour</GoldBtn>
                <GoldBtn disabled={!pkg || loading} onClick={handleSubmit} style={{ flex: 1 }}>
                  {loading ? 'Traitement...' : 'Confirmer'}
                </GoldBtn>
                <GoldBtn onClick={logout} outline style={{ padding: '8px 16px', fontSize: 13 }}>Déconnexion</GoldBtn>
              </div>
            </div>
          )}

          {step === 'waiting_package' && (
            <div style={{ animation: 'fadeUp 0.5s ease' }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>🛡️</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, marginBottom: 12 }}>Validation de formule</h2>
              <p style={{ color: C.muted, lineHeight: 1.6, marginBottom: 30 }}>
                Excellent choix ! Votre demande pour le pack <b>{pkg?.name}</b> est en cours de traitement. 
                <br /><br />
                Un administrateur va valider votre souscription sous peu. Vous pourrez ensuite commencer à ajouter vos premiers produits {projectType}.
              </p>
              <div style={{ display:'flex', gap: 10, justifyContent:'center' }}>
                <GoldBtn onClick={checkStatus} disabled={refreshing}>
                  {refreshing ? 'Vérification...' : 'Actualiser le statut'}
                </GoldBtn>
                <GoldBtn onClick={logout} outline>Se déconnecter</GoldBtn>
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  )
}
