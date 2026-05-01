<?php

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\AuthController;

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$controller = new AuthController();
$request = Request::create('/api/register', 'POST', [
    'name' => 'Test Vendor',
    'email' => 'test_vendor_' . time() . '@souk.ma',
    'password' => 'password123',
    'role' => 'vendor',
    'store_slug' => 'test-store-' . time(),
    'store_name' => 'Test Store',
    'store_description' => 'A test store description',
    'phone' => '0612345678',
    'city' => 'Casablanca'
]);

try {
    $response = $controller->register($request);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Body: " . $response->getContent() . "\n";
    
    // Verify in DB
    $user = User::where('email', $request->email)->first();
    if ($user && $user->phone === '0612345678' && $user->store_description === 'A test store description') {
        echo "Verification: SUCCESS - Data saved correctly.\n";
    } else {
        echo "Verification: FAILURE - Data not saved correctly.\n";
    }
} catch (\Illuminate\Validation\ValidationException $e) {
    echo "Status: 422\n";
    echo "Errors: " . json_encode($e->errors()) . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
