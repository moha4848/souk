import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  fr: {
    translation: {
      "welcome": "Bienvenue sur SOUK",
      "login": "Se connecter",
      "register": "S'inscrire",
      "dashboard": "Tableau de bord",
      "profile": "Profil",
      "orders": "Mes Commandes",
      "points": "Points Fidélité",
      "logout": "Déconnexion",
      "start_shopping": "Démarrer Shopping",
      "settings": "Réglages",
      "language": "Langue",
    }
  },
  ar: {
    translation: {
      "welcome": "مرحباً بكم في سوق",
      "login": "تسجيل الدخول",
      "register": "إنشاء حساب",
      "dashboard": "لوحة التحكم",
      "profile": "الملف الشخصي",
      "orders": "طلباتي",
      "points": "نقاط الولاء",
      "logout": "تسجيل الخروج",
      "start_shopping": "بدء التسوق",
      "settings": "الإعدادات",
      "language": "اللغة",
    }
  },
  en: {
    translation: {
      "welcome": "Welcome to SOUK",
      "login": "Login",
      "register": "Register",
      "dashboard": "Dashboard",
      "profile": "Profile",
      "orders": "My Orders",
      "points": "Loyalty Points",
      "logout": "Logout",
      "start_shopping": "Start Shopping",
      "settings": "Settings",
      "language": "Language",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
