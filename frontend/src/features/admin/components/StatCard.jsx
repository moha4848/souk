import { C } from '../../../components/UI'

export default function StatCard({ icon, title, value, sub, color = C.gold, trend }) {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18,
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120,
        background: `radial-gradient(circle at top right, ${color}15, transparent 70%)` }} />
      <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
      <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 32, fontWeight: 700, color, fontFamily: "'Playfair Display', serif" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{sub}</div>}
      {trend && (
        <div style={{ position: 'absolute', top: 18, right: 18, fontSize: 12,
          color: trend > 0 ? '#5cc8b0' : '#c94c4c',
          background: trend > 0 ? '#5cc8b015' : '#c94c4c15',
          padding: '4px 8px', borderRadius: 20, border: `1px solid ${trend > 0 ? '#5cc8b033' : '#c94c4c33'}` }}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </div>
      )}
    </div>
  )
}
