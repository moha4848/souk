import { useState } from 'react'
import { C, Card, FieldInput, FieldSelect } from '../../components/UI'
import { Search } from 'lucide-react'

export default function SmartSearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [vendorType, setVendorType] = useState('')

  const handleSearch = () => {
    onSearch({ q: query, vendor_type: vendorType })
  }

  return (
    <Card style={{ 
      display:'flex', 
      gap:16, 
      alignItems:'flex-end', 
      padding:24, 
      background:C.surface, 
      boxShadow:'0 20px 40px rgba(0,0,0,0.3)',
      maxWidth:800,
      margin:'-40px auto 0',
      position:'relative',
      zIndex:10
    }}>
      <div style={{ flex:1 }}>
        <FieldInput 
          label="Que recherchez-vous ?"
          placeholder="Ex: Tapis Fès, Bijoux Argent, Robe Artisanale..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ marginBottom:0 }}
        />
      </div>
      
      <div style={{ width:200 }}>
        <FieldSelect 
          label="Type de Vendeur"
          value={vendorType}
          onChange={e => setVendorType(e.target.value)}
          options={[
            { value: '', label: 'Tous les vendeurs' },
            { value: 'Artisan', label: 'Artisans' },
            { value: 'Fashion', label: 'Mode & Design' },
            { value: 'Product', label: 'Produits Locaux' },
            { value: 'Digital', label: 'Contenu Digital' }
          ]}
          style={{ marginBottom:0 }}
        />
      </div>

      <button 
        onClick={handleSearch}
        style={{ 
          background: `linear-gradient(135deg, ${C.gold}, ${C.copper})`,
          border:'none',
          color:C.bg,
          padding:'13px 30px',
          borderRadius:12,
          fontWeight:600,
          cursor:'pointer',
          letterSpacing:1
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Search size={18} /> RECHERCHER
        </div>
      </button>
    </Card>
  )
}
