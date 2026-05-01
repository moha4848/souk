# SOUK ✦ — Gestion boutique en ligne
> Stack: Laravel 11 (API) + React + Vite

---

## 🚀 Installation rapide

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```
→ API disponible sur `http://localhost:8000`

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
→ App disponible sur `http://localhost:5173`

---

## 🔑 Compte demo
| Email | Mot de passe |
|-------|-------------|
| demo@souk.ma | password |

---

## 📁 Structure du projet
```
souk-project/
├── backend/                  # Laravel 11
│   ├── app/
│   │   ├── Http/Controllers/API/
│   │   │   ├── AuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── ProductController.php
│   │   │   └── OrderController.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Product.php
│   │   │   ├── Order.php
│   │   │   └── OrderItem.php
│   │   └── Policies/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/api.php
│
└── frontend/                 # React + Vite
    └── src/
        ├── api/
        │   ├── axios.js          # Axios instance + interceptors
        │   └── services.js       # Tous les appels API
        ├── context/
        │   └── AuthContext.jsx   # Auth state global
        ├── components/
        │   ├── UI.jsx            # Design system (tokens, composants)
        │   └── Layout.jsx        # Shell + bottom nav
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── Dashboard.jsx
            ├── Products.jsx
            ├── ProductForm.jsx   # Créer / éditer produit
            ├── Orders.jsx
            ├── OrderDetail.jsx   # Détail + changer statut
            ├── Analytics.jsx
            └── Profile.jsx
```

---

## 🔌 Endpoints API
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | /api/register | Créer un compte |
| POST | /api/login | Se connecter |
| POST | /api/logout | Se déconnecter |
| GET | /api/me | Profil utilisateur |
| GET | /api/dashboard | Stats dashboard |
| GET | /api/products | Liste produits |
| POST | /api/products | Créer un produit |
| PUT | /api/products/{id} | Modifier produit |
| DELETE | /api/products/{id} | Supprimer produit |
| GET | /api/orders | Liste commandes |
| GET | /api/orders/{id} | Détail commande |
| PATCH | /api/orders/{id}/status | Changer statut |

---

## 🗄️ Base de données
Utilise **SQLite** par défaut (zéro config).
Pour MySQL, modifier `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=souk_db
DB_USERNAME=root
DB_PASSWORD=
```

---

## ✦ SOUK v1.0.0 · Oujda, Maroc
