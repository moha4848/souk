import { C, Ornament, Spinner } from '../../components/UI'

const MONTHS  = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc']
const VALS    = [12,18,14,24,19,28,22,31,26,35,29,38]
const MAX_V   = Math.max(...VALS)
const TOPS    = [
  { emoji:'🧺', name:'Panier osier',  sales:203, rev:30450 },
  { emoji:'🪬', name:'Khamsa argent', sales:112, rev:31360 },
  { emoji:'👜', name:'Sac cuir',      sales:61,  rev:54290 },
  { emoji:'🧣', name:'Écharpe laine', sales:89,  rev:28480 },
]

export default function Analytics() {
  return (
    <div style={{ paddingBottom:16, animation:'fadeUp .35s ease' }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .analytics-content { max-width: 1200px; margin: 0 auto; }
        .analytics-grid { display: flex; flex-direction: column; gap: 14px; }
        @media (min-width: 900px) {
          .analytics-grid { flex-direction: row; }
          .analytics-grid > div { flex: 1; min-width: 0; }
        }
      `}</style>
      <div className="analytics-content" style={{ padding:'20px clamp(16px, 3vw, 32px) 0' }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:24, fontWeight:700, marginBottom:4 }}>
          Statistiques <span style={{ color:C.gold }}>✦</span>
        </div>
        <div style={{ fontSize:11, color:C.muted, letterSpacing:1, marginBottom:16 }}>Année 2026</div>

        {/* KPIs */}
        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          {[['124k','Revenu MAD',C.goldL],['+23%','Croissance',C.tealL],['4.2★','Note moy.',C.gold]].map(([v,l,c]) => (
            <div key={l} style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`,
              borderRadius:14, padding:'13px 8px', textAlign:'center' }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:20, fontWeight:700, color:c }}>{v}</div>
              <div style={{ fontSize:9, color:C.muted, textTransform:'uppercase', letterSpacing:.5, marginTop:3 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Annual bar chart */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:16, marginBottom:14 }}>
          <div style={{ fontSize:10, letterSpacing:2, color:C.muted, textTransform:'uppercase', marginBottom:14 }}>
            Ventes mensuelles (k MAD)
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:80 }}>
            {VALS.map((v, i) => (
              <div key={i} style={{ flex:1, borderRadius:'3px 3px 0 0',
                background: i === VALS.length-1
                  ? `linear-gradient(to top,${C.copper},${C.goldL})`
                  : 'linear-gradient(to top,rgba(201,168,76,0.3),rgba(201,168,76,0.55))',
                height:`${(v/MAX_V)*100}%`, minHeight:4,
              }}/>
            ))}
          </div>
          <div style={{ display:'flex', gap:4, marginTop:6 }}>
            {MONTHS.map(m => (
              <div key={m} style={{ flex:1, textAlign:'center', fontSize:7, color:C.muted }}>{m}</div>
            ))}
          </div>
        </div>

        <Ornament />

        {/* Top products */}
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:17, fontWeight:600, margin:'10px 0' }}>
          Top Produits
        </div>
        {TOPS.map((p, i) => (
          <div key={p.name} style={{
            background:C.surface, border:`1px solid ${C.border}`, borderRadius:14,
            padding:'12px 14px', marginBottom:10, display:'flex', alignItems:'center', gap:12,
            animation:`fadeUp .28s ease ${i*0.06}s both`,
          }}>
            <div style={{ width:40, height:40, borderRadius:10, background:'rgba(201,168,76,0.08)',
              display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{p.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:500, marginBottom:5 }}>{p.name}</div>
              <div style={{ height:4, borderRadius:4, background:C.surface2, overflow:'hidden' }}>
                <div style={{ height:'100%', borderRadius:4,
                  width:`${(p.sales/203)*100}%`,
                  background:`linear-gradient(to right,${C.copper},${C.gold})` }}/>
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:14, fontWeight:600, color:C.goldL }}>
                {(p.rev/1000).toFixed(1)}k
              </div>
              <div style={{ fontSize:9, color:C.muted, marginTop:1 }}>{p.sales} ventes</div>
            </div>
          </div>
        ))}

        {/* Revenue breakdown */}
        <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:18, padding:16 }}>
          <div style={{ fontSize:10, letterSpacing:2, color:C.muted, textTransform:'uppercase', marginBottom:14 }}>
            Répartition par catégorie
          </div>
          {[['Textile',38,C.gold],['Artisanat',32,C.copper],['Maroquinerie',20,C.tealL],['Céramique',10,C.muted]].map(([cat,pct,color]) => (
            <div key={cat} style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontSize:12 }}>{cat}</span>
                <span style={{ fontSize:12, color }}>{pct}%</span>
              </div>
              <div style={{ height:5, borderRadius:5, background:C.surface2 }}>
                <div style={{ height:'100%', borderRadius:5, width:`${pct}%`,
                  background:`linear-gradient(to right,${color}80,${color})` }}/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
