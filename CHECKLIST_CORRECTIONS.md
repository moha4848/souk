# CHECKLIST CORRECTION - PROJET SOUK

## Phase 1 : Nettoyage Immédiat ✓

- [ ] Supprimer/déplacer `backend/debug_me.php`
- [ ] Supprimer/déplacer `backend/get_latest_user.php`
- [ ] Supprimer/déplacer `backend/reset.php`
- [ ] Supprimer/déplacer `backend/test_status.php`
- [ ] Supprimer/déplacer `backend/verify_supervision.php`

**Commandes:**
```bash
mkdir -p backend/scripts
mv backend/debug_me.php backend/scripts/
mv backend/get_latest_user.php backend/scripts/
mv backend/reset.php backend/scripts/
mv backend/test_status.php backend/scripts/
mv backend/verify_supervision.php backend/scripts/
```

---

## Phase 2 : Corrections Code (CRITIQUE)

### 2.1 Corriger OrderService.php

**Problème:** NullPointerException et Stock négatif

```bash
# Location: backend/app/Services/OrderService.php
# Lignes à modifier: 60-70 (resolveClient), 80-95 (processItemsAndCalculateTotals)
```

**À faire:**
- [ ] Ajouter vérification client non-null
- [ ] Ajouter vérification stock avant déduction
- [ ] Ajouter throw exception si stock insuffisant

### 2.2 Corriger OrderController.php

**Problème:** Accès au vendor/client null

```bash
# Location: backend/app/Http/Controllers/Api/OrderController.php
# Lignes: 46, 55, 69
```

**À faire:**
- [ ] Ajouter guard pour vendor->id
- [ ] Ajouter guard pour client->id
- [ ] Retourner erreur 403 si absent

### 2.3 Corriger ProductController.php

**Problème:** Accès au vendor null

```bash
# Location: backend/app/Http/Controllers/Api/ProductController.php
# Lignes: 14, 29, 45, 59, 73
```

**À faire:**
- [ ] Ajouter guard pour vendor dans chaque fonction

---

## Phase 3 : Configuration Production

### 3.1 Backend `.env`

- [ ] Générer JWT Secret: `php artisan jwt:secret`
- [ ] Configurer OPENAI_API_KEY si utilisé
- [ ] Configurer MAIL_MAILER (smtp, sendgrid, mailgun)
- [ ] Configurer APP_URL pour production
- [ ] Configurer FRONTEND_URL
- [ ] Mettre APP_DEBUG=false
- [ ] Vérifier DB_CONNECTION pour MySQL en production

**Commande génération JWT:**
```bash
cd backend
php artisan jwt:secret
# Output: JWT_SECRET=eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 3.2 Frontend `.env`

- [ ] Vérifier VITE_API_URL pointant vers backend en production

---

## Phase 4 : Tests

### 4.1 Test OrderCreationTest

- [ ] Exécuter test complet
- [ ] Vérifier création commande
- [ ] Vérifier stock décrémenté
- [ ] Vérifier commission calculée
- [ ] Vérifier points fidélité

**Commande:**
```bash
cd backend
php ./vendor/bin/phpunit tests/Feature/OrderCreationTest.php -v
```

### 4.2 Ajouter Tests Supplémentaires

- [ ] Test stock insuffisant → Erreur
- [ ] Test points fidélité appliqués correctement
- [ ] Test commande sans client → Erreur
- [ ] Test validation données manquantes

---

## Phase 5 : Vérification Syntaxe & Lint

### 5.1 PHP Lint

```bash
cd backend
for file in app/Services/*.php; do php -l "$file"; done
for file in app/Http/Controllers/Api/*.php; do php -l "$file"; done
```

- [ ] Tous les fichiers PHP valides

### 5.2 Laravel Checks

```bash
cd backend
php artisan config:clear
php artisan config:cache
php artisan route:list
```

- [ ] Configuration en cache
- [ ] Routes accessibles
- [ ] Pas d'erreurs config

---

## Phase 6 : Base de Données

### 6.1 Vérifier Migrations

```bash
cd backend
php artisan migrate:status
```

- [ ] Toutes les migrations executées

### 6.2 Vérifier Constraints

- [ ] Foreign keys sur OrderItem
- [ ] Cascades configurées
- [ ] Indices de performance

---

## Phase 7 : Git Commit

- [ ] Tous les fichiers en stage vérifiés
- [ ] Tests réussis
- [ ] Aucun fichier debug en production
- [ ] `.gitignore` mis à jour

**Fichiers à commiter:**
```
✓ backend/app/Http/Controllers/Api/OrderController.php
✓ backend/app/Http/Controllers/Api/ProductController.php
✓ backend/app/Services/OrderService.php
✓ backend/tests/Feature/OrderCreationTest.php
✓ frontend/src/api/services.js
✓ presentation_souk.html
✓ screenshots/landing.png
✓ screenshots/login.png
✓ screenshots/marketplace.png
```

**Commande commit:**
```bash
git add .
git commit -m "feat: add order management with stock control and loyalty points

- Add OrderService for centralized business logic
- Implement stock management with validation
- Add loyalty points calculation (3 points per order)
- Add SaaS commission calculation
- Update OrderController to use service
- Update ProductController with null checks
- Add comprehensive test for order creation
- Update API client with JWT interceptor"
```

---

## Phase 8 : Déploiement Production

### 8.1 Backend (Railway)

```bash
cd backend
php artisan key:generate --force
php artisan jwt:secret --force
php artisan config:clear
php artisan migrate --force
php artisan config:cache
```

- [ ] Key généré
- [ ] JWT secret généré
- [ ] Migrations exécutées
- [ ] Cache configuré

### 8.2 Frontend (Vercel)

```bash
cd frontend
npm run build
```

- [ ] Build réussi
- [ ] Aucune erreur TypeScript
- [ ] Variables d'environnement configurées

---

## Ordre Prioritaire d'Exécution

1. **IMMÉDIAT (30min)**
   - [ ] Phase 1 - Nettoyage fichiers debug
   - [ ] Phase 2.1 - Corriger OrderService
   - [ ] Phase 2.2 - Corriger OrderController
   - [ ] Phase 2.3 - Corriger ProductController

2. **COURT TERME (1h)**
   - [ ] Phase 4 - Tests
   - [ ] Phase 5 - Lint/Syntaxe

3. **MOYEN TERME (2h)**
   - [ ] Phase 3 - Configuration Production
   - [ ] Phase 6 - Base de données
   - [ ] Phase 7 - Git Commit

4. **LONG TERME (Déploiement)**
   - [ ] Phase 8 - Production

---

## Notes Importantes

⚠️ **NE PAS** commiter avant correction Phase 2  
⚠️ **NE PAS** déployer sans configuration Phase 3  
⚠️ **VÉRIFIER** JWT_SECRET en production  
⚠️ **TESTER** complètement Phase 4  

---

*Checklist mise à jour: 8 Mai 2026*
