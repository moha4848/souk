<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\TeamMember;
use App\Models\Role;
use App\Models\Subscription;
use App\Models\Commission;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    public function dashboard()
    {
        return response()->json([
            'total_users' => User::count(),
            'pending_users' => User::where('status', 'pending')->count(),
            'pending_subscriptions' => Subscription::where('status', 'pending')->count(),
            'total_commissions' => Commission::sum('amount'),
            'recent_activity' => [] // Could be audit logs
        ]);
    }

    public function invite(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:team_members',
            'password' => 'required|min:6',
            'role_id' => 'required|exists:roles,id'
        ]);

        $member = TeamMember::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
        ]);

        return response()->json([
            'message' => 'Membre d\'équipe créé avec succès',
            'member' => $member
        ], 201);
    }

    public function commissions()
    {
        $commissions = Commission::with('vendor', 'order')->latest()->paginate(20);
        return response()->json($commissions);
    }

    public function verifyStore(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update([
            'status' => $request->status === 'approve' ? 'approved' : 'rejected',
            'is_verified' => $request->status === 'approve'
        ]);

        return response()->json(['message' => 'Statut de la boutique mis à jour']);
    }

    public function assignPermissions(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $role->permissions()->sync($request->permissions);
        return response()->json(['message' => 'Permissions mises à jour']);
    }

    public function getActivityLogs()
    {
        $logs = \App\Models\ActivityLog::with('user')->latest()->take(100)->get();
        return response()->json($logs);
    }

    public function getTeamsOverview()
    {
        // Simple teams structure based on DB tables
        $teams = \Illuminate\Support\Facades\DB::table('teams')->get()->map(function ($team) {
            $roles = \Illuminate\Support\Facades\DB::table('roles')->where('team_id', $team->id)->get();
            $members = \Illuminate\Support\Facades\DB::table('user_team_memberships')
                ->join('users', 'user_team_memberships.user_id', '=', 'users.id')
                ->where('user_team_memberships.team_id', $team->id)
                ->select('users.id', 'users.name', 'users.email')
                ->get();

            return [
                'id' => $team->id,
                'name' => $team->name,
                'type' => $team->type,
                'description' => $team->description,
                'members_count' => $members->count(),
                'roles' => $roles,
                'members' => $members
            ];
        });

        return response()->json($teams);
    }
}
