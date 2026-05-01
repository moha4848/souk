<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Subscription;
use App\Models\Commission;

class SuperAdminController extends Controller
{
    // ── User Management ──
    public function getPendingUsers()
    {
        return response()->json(User::with('vendor')->where('status', 'pending')->get());
    }

    public function approveUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'approved']);
        return response()->json(['message' => 'Utilisateur approuvé', 'user' => $user]);
    }

    public function rejectUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['status' => 'rejected']);
        return response()->json(['message' => 'Utilisateur rejeté']);
    }

    // ── Subscription Management ──
    public function getPendingSubscriptions()
    {
        return response()->json(Subscription::with(['vendor', 'package'])->where('status', 'pending')->get());
    }

    public function approveSubscription($id)
    {
        $sub = Subscription::findOrFail($id);
        $sub->update(['status' => 'active']);
        
        // Deactivate other active subscriptions for this user if any
        Subscription::where('vendor_id', $sub->vendor_id)
            ->where('id', '!=', $sub->id)
            ->update(['status' => 'expired']);

        return response()->json(['message' => 'Abonnement activé', 'subscription' => $sub]);
    }

    public function rejectSubscription($id)
    {
        $sub = Subscription::findOrFail($id);
        $sub->update(['status' => 'rejected']);
        return response()->json(['message' => 'Abonnement rejeté']);
    }

    // ── Commissions ──
    public function getCommissions()
    {
        return response()->json(Commission::with(['order', 'vendor'])->latest()->get());
    }

    public function getStats()
    {
        return response()->json([
            'total_users' => User::count(),
            'pending_users' => User::where('status', 'pending')->count(),
            'pending_subscriptions' => Subscription::where('status', 'pending')->count(),
            'total_commissions' => Commission::sum('amount'),
        ]);
    }
}
