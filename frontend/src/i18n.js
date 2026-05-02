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
      "products": "Produits",
      "analytics": "Stats",
      "status_operational": "Statut: Opérationnel",
      "global_view": "Vue Globale",
      "moderation": "Modération",
      "finance": "Finance",
      "teams_roles": "Équipes & Rôles",
      "audit_logs": "Audit Logs",
      "my_space": "Mon espace",
      "overview": "Aperçu",
      "explorer": "EXPLORER",
      "sell": "VENDRE",
      "new_generation": "NOUVELLE GÉNÉRATION",
      "artisanat": "Excellence",
      "reinvented": "Multi-Catégories",
      "hero_subtitle": "SOUK ✦ — Propulser les créateurs marocains dans l'ère digitale. Là où l'e-commerce de luxe rencontre la confiance, l'innovation et la simplicité.",
      "search_placeholder": "Chercher l'exceptionnel...",
      "find": "TROUVER",
      "curated_collection": "Collection Curatée",
      "collection_subtitle": "L'excellence marocaine sélectionnée par nos experts pour votre plaisir.",
      "premium": "PREMIUM",
      "morocco": "MAROC",
      "discover": "DÉCOUVRIR",
      "footer_text": "La révolution digitale du commerce marocain commence ici.",
      "contact": "CONTACT",
      "restricted_access": "Accès Restreint",
      "no_team_assigned": "Votre compte n'est assigné à aucune équipe active.",
      "total_users": "Total Utilisateurs",
      "pending_vendors": "Vendeurs en attente",
      "pending_packages": "Forfaits en attente",
      "total_commissions": "Total Commissions",
      "account_validation": "Validation de Comptes",
      "package_validation": "Validation de Forfaits",
      "approve": "Approuver",
      "reject": "Rejeter",
      "activate": "Activer",
      "no_data": "Aucune donnée disponible",
      "revenues": "Revenus SOUK",
      "business_volume": "Volume d'affaires",
      "commission_log": "Journal des Commissions",
      "active_shops": "Boutiques Actives",
      "open_tickets": "Tickets Ouverts",
      "vendor_support": "Support Vendeurs"
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
      "products": "المنتجات",
      "analytics": "الإحصائيات",
      "status_operational": "الحالة: تشغيل",
      "global_view": "نظرة عامة",
      "moderation": "الإشراف",
      "finance": "المالية",
      "teams_roles": "الفرق والأدوار",
      "audit_logs": "سجلات التدقيق",
      "my_space": "مساحتي",
      "overview": "نظرة عامة",
      "explorer": "استكشاف",
      "sell": "بيع",
      "new_generation": "الجيل الجديد",
      "artisanat": "التميز",
      "reinvented": "متعدد الفئات",
      "hero_subtitle": "سوق ✦ — تمكين المبدعين المغاربة في العصر الرقمي. حيث تلتقي التجارة الإلكترونية الفاخرة بالثقة والابتكار والبساطة.",
      "search_placeholder": "ابحث عن الاستثنائي...",
      "find": "بحث",
      "curated_collection": "مجموعة منتقاة",
      "collection_subtitle": "التميز المغربي المختار من قبل خبرائنا من أجل متعتك.",
      "premium": "ممتاز",
      "morocco": "المغرب",
      "discover": "اكتشف",
      "footer_text": "الثورة الرقمية للتجارة المغربية تبدأ هنا.",
      "contact": "اتصل بنا",
      "restricted_access": "وصول مقيد",
      "no_team_assigned": "حسابك غير مرتبط بأي فريق عمل حالياً.",
      "total_users": "إجمالي المستخدمين",
      "pending_vendors": "بائعون في الانتظار",
      "pending_packages": "باقات في الانتظار",
      "total_commissions": "إجمالي العمولات",
      "account_validation": "تحقق من الحسابات",
      "package_validation": "تحقق من الباقات",
      "approve": "قبول",
      "reject": "رفض",
      "activate": "تفعيل",
      "no_data": "لا توجد بيانات متاحة",
      "revenues": "عائدات سوق",
      "business_volume": "حجم المعاملات",
      "commission_log": "سجل العمولات",
      "active_shops": "المتاجر النشطة",
      "open_tickets": "التذاكر المفتوحة",
      "vendor_support": "دعم البائعين"
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
      "products": "Products",
      "analytics": "Analytics",
      "status_operational": "Status: Operational",
      "global_view": "Global View",
      "moderation": "Moderation",
      "finance": "Finance",
      "teams_roles": "Teams & Roles",
      "audit_logs": "Audit Logs",
      "my_space": "My Space",
      "overview": "Overview",
      "explorer": "EXPLORE",
      "sell": "SELL",
      "new_generation": "NEW GENERATION",
      "artisanat": "Excellence",
      "reinvented": "Multi-Category",
      "hero_subtitle": "SOUK ✦ — Empowering Moroccan creators in the digital age. Where luxury e-commerce meets trust, innovation, and simplicity.",
      "search_placeholder": "Search for the exceptional...",
      "find": "FIND",
      "curated_collection": "Curated Collection",
      "collection_subtitle": "Moroccan excellence selected by our experts for your pleasure.",
      "premium": "PREMIUM",
      "morocco": "MOROCCO",
      "discover": "DISCOVER",
      "footer_text": "The digital revolution of Moroccan commerce starts here.",
      "contact": "CONTACT",
      "restricted_access": "Restricted Access",
      "no_team_assigned": "Your account is not assigned to any active team.",
      "total_users": "Total Users",
      "pending_vendors": "Pending Vendors",
      "pending_packages": "Pending Packages",
      "total_commissions": "Total Commissions",
      "account_validation": "Account Validation",
      "package_validation": "Package Validation",
      "approve": "Approve",
      "reject": "Reject",
      "activate": "Activate",
      "no_data": "No data available",
      "revenues": "SOUK Revenues",
      "business_volume": "Business Volume",
      "commission_log": "Commission Log",
      "active_shops": "Active Shops",
      "open_tickets": "Open Tickets",
      "vendor_support": "Vendor Support"
    }
  }
};

const updateDirection = (lng) => {
  document.dir = lng === 'ar' ? 'rtl' : 'ltr';
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

updateDirection(i18n.language || 'fr');

i18n.on('languageChanged', (lng) => {
  updateDirection(lng);
});

export default i18n;
