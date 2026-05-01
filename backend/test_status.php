<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = \App\Models\User::create([
    'name' => 'Test User',
    'email' => 'test_'.rand().'@souk.ma',
    'password' => bcrypt('12345678'),
    'role' => 'vendor',
    'status' => 'pending'
]);

echo "Created User Status: " . $user->status . "\n";
echo "Created User ID: " . $user->id . "\n";
