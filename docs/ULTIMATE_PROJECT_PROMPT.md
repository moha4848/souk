# SOUK ✦ : THE 100% CODE-IDENTICAL BLUEPRINT

**Strict Requirement:** Use the exact file naming and directory structure provided below. Do not use generic names.

---

## 📁 1. EXACT DIRECTORY STRUCTURE (FRONTEND)
```text
src/
├── api/            # Centralized Axios services (auth.js, vendor.js, client.js)
├── components/     
│   ├── UI.jsx      # Export { GoldBtn, GlassCard, ZelligeBg, Ornament, FieldInput }
│   ├── Layout.jsx  # Vendor/Admin Layout with animated sidebar
│   └── ClientLayout.jsx # User-facing layout with Emerald Navbar
├── context/        # AuthContext.jsx, ClientAuthContext.jsx, CartContext.jsx
├── features/       # Feature-based logic (chat/, orders/, finance/)
├── pages/
│   ├── client/     # Landing.jsx, ClientLogin.jsx, ShopDetail.jsx
│   ├── vendor/     # VendorDashboard.jsx, ProductManager.jsx, AIStoreCreator.jsx
│   └── admin/      # AdminDashboard.jsx, TeamManager.jsx, FinanceLogs.jsx
└── i18n.js         # Exact bilingual configuration (FR, AR, EN)
```

---

## 🧱 2. EXACT UI SPECIFICATIONS (CSS-IN-JS & VANILLA)
- **Glassmorphism:** `background: rgba(15, 18, 29, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1);`
- **Buttons:** `background: linear-gradient(135deg, #10b981, #059669);` for Emerald, and `linear-gradient(135deg, #FFD700, #b87333);` for Gold.
- **Animations:** Use `keyframes` for `fadeIn`, `slideUp`, and the specific `floatPhone` animation (3D rotation).

---

## 🛠️ 3. EXACT BACKEND ARCHITECTURE (LARAVEL)
- **Trait:** `BelongsToTenant` must use a Global Scope that filters by `store_slug`.
- **Middleware:** `IdentifyTenant` must extract the slug from the `X-Store-Slug` header or the subdomain.
- **Seeder:** `SaaSSeeder.php` must create:
    - 1 SuperAdmin (`admin@souk.ma`)
    - 1 Vendor (`vendor@souk.ma`) with slug `emerald-shop`
    - 1 Client (`client@souk.ma`)
    - Diverse products in categories: `Technologie`, `Mode Luxe`, `Bijouterie`, `Artisanat`.

---

## 🧠 4. CORE LOGIC CONSTRAINTS
1.  **Isolation:** No product or order should ever be accessible without a valid `store_slug`.
2.  **AI Flow:** The `AIStoreCreator` must return a structured JSON that updates the `vendors.theme_settings` column immediately.
3.  **Real-time:** Use a polling mechanism or WebSockets for the `ChatMessage` model to ensure the chat feels live.
4.  **Checkout:** Must calculate `loyalty_points` (1 point per 100 DH) and update `client_profiles` table.

---

## 🚀 FINAL INSTRUCTION
"Replicate the SOUK ✦ ecosystem with surgical precision. Follow the file structure above, use the exact hex codes (#10b981, #FFD700), and implement the logical isolation as the first priority. The final product must feel like a premium, high-speed SaaS for luxury creators."
