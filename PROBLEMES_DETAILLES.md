# PROBLÈMES DÉTAILLÉS - PROJET SOUK

## 1. FICHIERS DE DEBUG À SUPPRIMER

### 1.1 Fichiers Problématiques dans `backend/`

```
backend/
├── debug_me.php              ⚠️ SUPPRIMER
├── get_latest_user.php       ⚠️ SUPPRIMER
├── reset.php                 ⚠️ SUPPRIMER
├── test_status.php           ⚠️ SUPPRIMER
└── verify_supervision.php    ⚠️ SUPPRIMER
```

**Raison:** Ces fichiers contiennent des scripts de test/debug qui ne doivent pas être en production.

**Solution:**
```bash
# Créer un répertoire scripts et les y déplacer
mkdir backend/scripts
mv backend/debug_me.php backend/scripts/
mv backend/get_latest_user.php backend/scripts/
mv backend/reset.php backend/scripts/
mv backend/test_status.php backend/scripts/
mv backend/verify_supervision.php backend/scripts/
```

---

## 2. CONFIGURATION PRODUCTION MANQUANTE

### 2.1 Backend `.env` pour Production

**Fichier:** `backend/.env.example`

Variables **CRITIQUES** manquantes:

```env
# 1. JWT Secret (DOIT être généré)
JWT_SECRET=                    # ← Exécuter: php artisan jwt:secret
                                 # Résultat: JWT_SECRET=SG1yCDZKsomething...

# 2. OpenAI Configuration (si utilisé)
OPENAI_API_KEY=               # ← À obtenir depuis https://platform.openai.com

# 3. Email Configuration
MAIL_MAILER=smtp              # ou 'sendgrid', 'mailgun'
MAIL_HOST=                    # À remplir
MAIL_PORT=                    # À remplir
MAIL_USERNAME=                # À remplir
MAIL_PASSWORD=                # À remplir
MAIL_FROM_ADDRESS=hello@souk.ma
MAIL_FROM_NAME=SOUK

# 4. URLs de Production
APP_URL=https://souk-backend.railway.app
FRONTEND_URL=https://souk-frontend.vercel.app
```

**Statut:** ⚠️ Non configuré pour production

---

### 2.2 Frontend `.env` pour Production

**Fichier:** `frontend/.env.production`

```env
VITE_API_URL=https://souk-backend.railway.app/api
```

**Statut:** ✓ Configuré mais vérifier l'URL exacte en production

---

## 3. PROBLÈMES SPÉCIFIQUES IDENTIFIÉS

### 3.1 OrderService - Possible Erreur NullPointerException

**Fichier:** `backend/app/Services/OrderService.php`

**Ligne:** Risque dans `resolveClient()` et `processItemsAndCalculateTotals()`

```php
// PROBLÈME POTENTIEL:
private function resolveClient($email)
{
    if (!$email) return null;
    $user = User::where('email', $email)->with('client')->first();
    return $user ? $user->client : null;  // ← Peut retourner null
}
```

**Situation critique:** Si pas de client trouvé mais `$user` existe, retour null → erreur au calcul de fidélité

**Solution recommandée:**
```php
private function resolveClient($email)
{
    if (!$email) return null;
    $user = User::where('email', $email)->with('client')->first();
    
    if (!$user) {
        // Créer un client anonyme ou rejeter
        throw new \Exception("Client not found for email: $email");
    }
    
    return $user->client;
}
```

---

### 3.2 OrderService - Stock Insuffisant

**Fichier:** `backend/app/Services/OrderService.php`

**Ligne:** `processItemsAndCalculateTotals()`

**Problème:** Pas de vérification de stock avant déduction

```php
// PROBLÈME:
foreach ($items as $item) {
    $product = Product::findOrFail($item['product_id']);
    $subtotal += $product->price * $item['quantity'];
    
    // Déduction du stock SANS vérification
    $product->decrement('stock', $item['quantity']);  // ← Stock peut devenir négatif !
}
```

**Solution recommandée:**
```php
foreach ($items as $item) {
    $product = Product::findOrFail($item['product_id']);
    
    // Vérifier le stock
    if ($product->stock < $item['quantity']) {
        throw new \Exception("Stock insuffisant pour {$product->name}. Disponible: {$product->stock}, Demandé: {$item['quantity']}");
    }
    
    $subtotal += $product->price * $item['quantity'];
    $product->decrement('stock', $item['quantity']);
}
```

---

### 3.3 ProductController - Accès au Vendor Nul

**Fichier:** `backend/app/Http/Controllers/Api/ProductController.php`

**Problème:** `Auth::user()->vendor` peut être null

```php
// PROBLÈME:
public function index()
{
    $products = Product::where('vendor_id', Auth::user()->vendor->id)  // ← vendor peut être null
        ->latest()
        ->paginate(15);
    return response()->json($products);
}
```

**Solution recommandée:**
```php
public function index()
{
    $user = Auth::user();
    
    if (!$user->vendor) {
        return response()->json(['error' => 'User has no vendor profile'], 403);
    }
    
    $products = Product::where('vendor_id', $user->vendor->id)
        ->latest()
        ->paginate(15);
    return response()->json($products);
}
```

---

### 3.4 OrderController - Même Problème

**Fichier:** `backend/app/Http/Controllers/Api/OrderController.php`

Même problématique à la ligne 46 et 55 :

```php
$vendorId = Auth::user()->vendor->id ?? null;   // ← Peut crasher
$clientId = Auth::user()->client->id ?? null;   // ← Peut crasher
```

---

## 4. PROBLÈMES DE MIGRATION À VÉRIFIER

### 4.1 OrderItem - Absence de Foreign Key

**Vérifier dans:** `database/migrations/2026_04_23_000005_create_orders_table.php`

**Nécessaire:** Ajouter les contraintes foreign key pour `OrderItem`:
```php
Schema::create('order_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->onDelete('cascade');
    $table->foreignId('product_id')->constrained()->onDelete('restrict');
    $table->integer('quantity');
    $table->decimal('price', 10, 2);
    $table->timestamps();
});
```

---

## 5. CACHE À VALIDER

### 5.1 Frontend - Token Local Storage

**Fichier:** `frontend/src/api/services.js` ligne 12-15

**Problème:** Deux tokens en localStorage - confusion possible

```javascript
const token = isAdminRequest 
    ? (localStorage.getItem('souk_admin_token') || localStorage.getItem('souk_token'))
    : (localStorage.getItem('souk_token') || localStorage.getItem('souk_admin_token'))
```

**Recommandation:** Utiliser un seul token avec distinction par JWT claims

---

## 6. TESTS À EXÉCUTER

### 6.1 Test Actuellement En Queue

**Fichier:** `backend/tests/Feature/OrderCreationTest.php`

**Statut:** ⏳ À exécuter complètement

**Vérifications de test:**
- ✓ Création de commande
- ✓ Stock décrément
- ✓ Commission calculée (5%)
- ✓ Points de fidélité (3)

**À ajouter:**
- Test stock insuffisant
- Test points de fidélité appliqués
- Test commande sans client
- Test validation erreur

---

## 7. SÉCURITÉ

### 7.1 Fichiers Debug en Production

**Risque:** Scripts PHP accessibles directement

**Solution:** Ajouter à `.gitignore`:
```
backend/debug_me.php
backend/get_latest_user.php
backend/reset.php
backend/test_status.php
backend/verify_supervision.php
```

### 7.2 Variables d'Environnement Exposées

**Fichier:** `frontend/.env.production`

Vérifier que les secrets ne sont jamais commitées.

---

## 8. RÉSUMÉ ACTION REQUISE

| N° | Problème | Sévérité | Action |
|---|----------|----------|--------|
| 1 | Fichiers debug en racine | 🔴 Critique | Supprimer ou déplacer |
| 2 | JWT_SECRET vide | 🔴 Critique | Générer: `php artisan jwt:secret` |
| 3 | NullPointerException possible | 🟠 Majeur | Ajouter guards null check |
| 4 | Stock peut devenir négatif | 🟠 Majeur | Vérifier stock avant déduction |
| 5 | Vendor::id peut être null | 🟠 Majeur | Ajouter null check |
| 6 | Test incomplet | 🟡 Mineur | Exécuter et ajouter cas d'erreur |
| 7 | Cache configuration | 🟡 Mineur | `php artisan config:cache` |
| 8 | Migration OrderItem | 🟡 Mineur | Vérifier constraints |

---

*Rapport détaillé des problèmes - Mise à jour 8 Mai 2026*
