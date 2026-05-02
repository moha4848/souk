import { useTranslation } from 'react-i18next';
import { C } from './UI';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLang = i18n.language?.split('-')[0] || 'fr';

  const langs = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'عربي' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: 'rgba(255,255,255,0.05)',
      padding: '4px',
      borderRadius: '20px',
      border: `1px solid ${C.border}`
    }}>
      {langs.map(l => {
        const isActive = currentLang === l.code;
        return (
          <button
            key={l.code}
            onClick={() => changeLanguage(l.code)}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              border: 'none',
              background: isActive ? C.emerald : 'transparent',
              color: isActive ? '#fff' : C.muted,
              fontSize: 12,
              fontWeight: isActive ? 800 : 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'Outfit', sans-serif"
            }}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  );
}
