<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Team;
use App\Models\User;

$mohammed = User::where('email', 'mohammed@souk.ma')->first();
$akram = User::where('email', 'akram@souk.ma')->first();

echo "Mohammed ID: " . ($mohammed->id ?? 'N/A') . "\n";
echo "Akram ID: " . ($akram->id ?? 'N/A') . "\n";

$teams = Team::all();
foreach ($teams as $team) {
    $sup = User::find($team->supervisor_id);
    echo "Team: {$team->name} ({$team->type}) -> Supervisor: " . ($sup->name ?? 'None') . "\n";
}
