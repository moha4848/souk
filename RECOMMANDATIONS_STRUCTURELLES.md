# RECOMMANDATIONS STRUCTURELLES - PROJET SOUK

## 1. STRUCTURE DE RÉPERTOIRES RECOMMANDÉE

```
souk-project/
├── backend/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/
│   │   │   │   │   ├── OrderController.php
│   │   │   │   │   ├── ProductController.php
│   │   │   │   │   ├── DashboardController.php
│   │   │   │   │   └── ...
│   │   │   │   └── AuthController.php
│   │   │   ├── Middleware/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Services/
│   │   │   ├── OrderService.php      ✓ BIEN
│   │   │   ├── ProductService.php    (À créer)
│   │   │   └── PaymentService.php    (À créer)
│   │   ├── Notifications/
│   │   ├── Mail/
│   │   └── Exceptions/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   ├── tests/
│   │   ├── Feature/
│   │   └── Unit/
│   ├── scripts/                      ← NOUVEAU (pour debug scripts)
│   │   ├── debug_me.php
│   │   ├── test_status.php
│   │   ├── verify_supervision.php
│   │   ├── get_latest_user.php
│   │   └── reset.php
│   └── storage/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   ├── public/
│   └── package.json
├── docs/
│   ├── VERIFICATION_PROBLEMES.md     ✓ NOUVEAU
│   ├── PROBLEMES_DETAILLES.md        ✓ NOUVEAU
│   ├── CHECKLIST_CORRECTIONS.md      ✓ NOUVEAU
│   └── ...
├── .gitignore
└── README.md
```

---

## 2. SERVICES À CRÉER

### 2.1 ProductService

**Localisation:** `backend/app/Services/ProductService.php`

**Responsabilités:**
- Créer/mettre à jour produits
- Gestion du cache
- Validation des stocks
- Gestion des prix promo

```php
namespace App\Services;

class ProductService
{
    public function createProduct(array $data, int $vendorId): Product
    {
        // Validation
        // Création
        // Cache invalidation
    }
    
    public function updateProduct(int $id, array $data): Product
    {
        // Validation
        // Mise à jour
        // Cache invalidation
    }
    
    public function validateStock(int $productId, int $quantity): bool
    {
        // Logique de vérification stock
    }
}
```

### 2.2 PaymentService

**Localisation:** `backend/app/Services/PaymentService.php`

**Responsabilités:**
- Traiter paiements
- Intégration passerelles (Stripe, etc)
- Webhook handlers

### 2.3 NotificationService

**Localisation:** `backend/app/Services/NotificationService.php`

**Responsabilités:**
- Envoyer notifications
- Emails
- WebSocket broadcasts

---

## 3. PATTERN SINGLETON À IMPLÉMENTER

### 3.1 Cache Management

```php
// backend/app/Services/CacheService.php
namespace App\Services;

class CacheService
{
    private static ?self $instance = null;
    
    public static function getInstance(): self
    {
        return self::$instance ??= new self();
    }
    
    public function invalidateMarketplace(): void
    {
        Cache::forget('marketplace_explore');
        Cache::forget('marketplace_search');
    }
    
    public function invalidateStore(string $slug): void
    {
        Cache::forget("store_" . $slug);
    }
}
```

---

## 4. MIDDLEWARE À AMÉLIORER

### 4.1 Ajouter Middleware Tenant

```php
// backend/app/Http/Middleware/EnsureVendorAccess.php
namespace App\Http\Middleware;

class EnsureVendorAccess
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->user()?->vendor) {
            return response()->json(['error' => 'No vendor profile'], 403);
        }
        
        // Ajouter vendor_id au contexte
        request()->merge(['current_vendor_id' => auth()->user()->vendor->id]);
        
        return $next($request);
    }
}
```

### 4.2 Middleware Rate Limiting

```php
// routes/api.php
Route::middleware(['auth:api', 'throttle:60,1'])->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
    // ...
});
```

---

## 5. EXCEPTION HANDLING

### 5.1 Créer Custom Exceptions

```php
// backend/app/Exceptions/InsufficientStockException.php
namespace App\Exceptions;

class InsufficientStockException extends \Exception
{
    public function __construct(
        public string $productName,
        public int $requested,
        public int $available
    ) {
        parent::__construct(
            "Stock insuffisant pour {$productName}. Disponible: {$available}, Demandé: {$requested}"
        );
    }
}
```

### 5.2 Handle dans Exception Handler

```php
// bootstrap/app.php
->withExceptions(function (Exceptions $exceptions) {
    $exceptions->renderable(function (InsufficientStockException $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'product' => $e->productName,
            'available' => $e->available,
            'requested' => $e->requested
        ], 400);
    });
})
```

---

## 6. VALIDATION À AMÉLIORER

### 6.1 Custom Validation Rules

```php
// backend/app/Rules/StockAvailable.php
namespace App\Rules;

class StockAvailable implements Rule
{
    public function __construct(private int $productId) {}
    
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $product = Product::find($this->productId);
        if (!$product || $product->stock < $value) {
            $fail("Stock insuffisant");
        }
    }
}
```

### 6.2 Utiliser dans Request

```php
class OrderRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'items.*.quantity' => [
                'required',
                'integer',
                'min:1',
                new StockAvailable($this->input('items.0.product_id'))
            ],
        ];
    }
}
```

---

## 7. ÉVENTS & LISTENERS

### 7.1 OrderCreated Event

```php
// backend/app/Events/OrderCreated.php
class OrderCreated
{
    public function __construct(public Order $order) {}
}
```

### 7.2 Listeners

```php
// backend/app/Listeners/SendOrderConfirmationEmail.php
// backend/app/Listeners/NotifyVendor.php
// backend/app/Listeners/UpdateInventory.php
```

### 7.3 Utilisation dans Service

```php
class OrderService
{
    public function createOrder(array $data)
    {
        // ... création ...
        event(new OrderCreated($order));
        return $order;
    }
}
```

---

## 8. TRANSACTIONS DB - EXEMPLE CORRECT

```php
// ✓ BON PATTERN
public function createOrder(array $data)
{
    return DB::transaction(function () use ($data) {
        try {
            $order = Order::create([...]);
            $this->saveOrderItems($order, $data['items']);
            $this->calculateCommission($order, $vendor);
            return $order;
        } catch (Exception $e) {
            throw new OrderCreationException($e->getMessage());
        }
    });
}
```

---

## 9. LOGGING À IMPLÉMENTER

### 9.1 ActivityLog pour Audit Trail

```php
// backend/app/Models/ActivityLog.php
public static function log(string $action, array $data): void
{
    static::create([
        'user_id' => auth()->id(),
        'action' => $action,
        'model_type' => $data['model_type'] ?? null,
        'model_id' => $data['model_id'] ?? null,
        'changes' => $data['changes'] ?? [],
    ]);
}
```

### 9.2 Utilisation

```php
// Dans OrderService
OrderService::createOrder($data);
ActivityLog::log('order.created', [
    'model_type' => Order::class,
    'model_id' => $order->id,
    'changes' => ['status' => 'pending']
]);
```

---

## 10. API DOCUMENTATION

### 10.1 Documenter avec OpenAPI/Swagger

```bash
composer require --dev darkaonline/l5-swagger
php artisan vendor:publish --provider "L5Swagger\L5SwaggerServiceProvider"
```

### 10.2 Exemple Annotation

```php
/**
 * @OA\Post(
 *     path="/api/orders",
 *     summary="Create order",
 *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/OrderRequest")),
 *     @OA\Response(response=201, description="Order created")
 * )
 */
public function store(OrderRequest $request)
{
    // ...
}
```

---

## 11. TESTING BEST PRACTICES

### 11.1 Test Structure

```
tests/
├── Feature/
│   ├── Orders/
│   │   ├── OrderCreationTest.php         ✓ EXISTE
│   │   ├── OrderStockTest.php            (À créer)
│   │   ├── OrderCommissionTest.php       (À créer)
│   │   └── OrderLoyaltyTest.php          (À créer)
│   ├── Products/
│   │   ├── ProductCreationTest.php
│   │   └── ProductStockTest.php
│   └── Auth/
│       ├── LoginTest.php
│       └── RegisterTest.php
└── Unit/
    ├── Services/
    │   ├── OrderServiceTest.php
    │   └── ProductServiceTest.php
    └── Models/
        ├── OrderTest.php
        └── ProductTest.php
```

### 11.2 Test Avec Factory

```php
public function test_order_with_insufficient_stock()
{
    $product = Product::factory()->create(['stock' => 1]);
    
    $this->expectException(InsufficientStockException::class);
    
    $this->service->createOrder([
        'items' => [['product_id' => $product->id, 'quantity' => 2]]
    ]);
}
```

---

## 12. CI/CD PIPELINE

### 12.1 GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.2
      - name: Install dependencies
        run: composer install
      - name: Run tests
        run: php artisan test
```

---

## 13. SÉCURITÉ

### 13.1 Rate Limiting

```php
// config/herd.php
'rate_limit' => '60,1' // 60 requêtes par minute
```

### 13.2 CORS

```php
// config/cors.php
'allowed_origins' => [
    'https://souk-frontend.vercel.app'
]
```

### 13.3 CSRF

```php
// Valider CSRF pour POST/PUT/DELETE
Route::middleware(['web', 'csrf'])->group(function () {
    // Routes web
});
```

---

## 14. PERFORMANCE

### 14.1 Eager Loading

```php
// ✓ BON
$orders = Order::with(['items.product', 'vendor'])->get();

// ✗ MAUVAIS
$orders = Order::get(); // N+1 queries
```

### 14.2 Pagination

```php
// ✓ BON
$products = Product::paginate(15);

// ✗ MAUVAIS
$products = Product::get(); // Charge tout en mémoire
```

### 14.3 Indexing

```sql
-- Ajouter indices
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_products_vendor_id ON products(vendor_id);
CREATE INDEX idx_products_category ON products(category);
```

---

## RÉSUMÉ PRIORITÉS

1. ✅ **IMMÉDIAT** - Corriger les NullPointerExceptions (Phase 2)
2. ✅ **COURT TERME** - Créer ProductService et PaymentService
3. ✅ **MOYEN TERME** - Ajouter Middleware et Custom Exceptions
4. ✅ **LONG TERME** - Implémenter Events, Logging, Documentation

---

*Guide structurel - Mise à jour 8 Mai 2026*
