<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = \App\Models\User::where('email', 'artisan@souk.ma')->first();
$token = \Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);

// Simulate the /me response
$user->load(['vendor.activeSubscription.package', 'vendor.subscriptions']);

echo "TOKEN: " . $token . "\n\n";
echo "RESPONSE:\n";
echo json_encode($user->toArray(), JSON_PRETTY_PRINT);
