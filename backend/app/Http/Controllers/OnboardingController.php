<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Package;
use App\Models\Subscription;
use Illuminate\Support\Facades\Auth;

class OnboardingController extends Controller
{
    public function getPackages()
    {
        return response()->json(Package::all());
    }

    public function updateProjectType(Request $request)
    {
        $request->validate([
            'project_type' => 'required|string|in:artisan,vetements,electronique,services',
        ]);

        $user = Auth::user();
        $user->update(['project_type' => $request->project_type]);

        return response()->json(['message' => 'Type de projet mis à jour', 'user' => $user]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
        ]);

        $user = Auth::user();
        
        // Deactivate any existing pending/active subscriptions if needed 
        // (Simplified for now: just create a new pending one)
        $subscription = Subscription::create([
            'vendor_id' => $user->vendor->id,
            'package_id' => $request->package_id,
            'status' => 'pending',
            'starts_at' => now(),
            'expires_at' => now()->addMonth(),
        ]);

        return response()->json([
            'message' => 'Demande d\'abonnement envoyée pour validation',
            'subscription' => $subscription
        ]);
    }
}
