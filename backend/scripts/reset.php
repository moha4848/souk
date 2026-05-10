<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::where('email', 'testvendor@souk.ma')->first();
if ($user) {
    $user->password = bcrypt('password123');
    $user->save();
    echo "Password reset successfully.";
} else {
    echo "User not found.";
}
