<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Vendor;
use App\Models\Client;
use App\Models\Staff;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function adminLogin(Request $request)
    {
        $credentials = $request->only('email', 'password');
        
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }
        
        $user = Auth::user();
        
        // Safety check: is it an admin or staff?
        if (!$user->isSuperAdmin() && $user->role !== 'staff') {
            return response()->json(['message' => 'Accès restreint aux membres de l\'équipe.'], 403);
        }

        $user->load(['staffProfile', 'memberships.team', 'memberships.role.permissions']);
        
        return response()->json([
            'message' => 'Login équipe réussi',
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }
        
        $user = Auth::user();


        if ($user->status === 'rejected') {
            JWTAuth::invalidate($token);
            return response()->json(['message' => 'Votre compte a été rejeté.'], 403);
        }
        if ($user->status === 'suspended') {
            JWTAuth::invalidate($token);
            return response()->json(['message' => 'Votre compte est suspendu.'], 403);
        }

        if ($user->role === 'vendor') {
            $user->load(['vendor.activeSubscription.package', 'vendor.subscriptions']);
        } elseif ($user->role === 'client') {
            $user->load('client');
        } else {
            $user->load(['staffProfile', 'memberships.team', 'memberships.role.permissions']);
        }
        
        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user,
        ], 200);
    }

    public function register(\App\Http\Requests\RegisterRequest $request)
    {
        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password),
                'role' => $request->role,
                'status' => 'pending',
                'phone' => $request->phone,
                'city' => $request->city,
            ]);

            if ($request->role === 'vendor') {
                $vendorData = [
                    'user_id' => $user->id,
                    'shop_name' => $request->store_name,
                    'store_slug' => $request->store_slug,
                    'description' => $request->store_description,
                    'phone' => $request->phone,
                    'city' => $request->city,
                ];
                if ($request->hasFile('logo')) {
                    $path = $request->file('logo')->store('logos', 'public');
                    $vendorData['logo_url'] = '/storage/' . $path;
                }
                Vendor::create($vendorData);
            } elseif ($request->role === 'client') {
                Client::create([
                    'user_id' => $user->id,
                    'phone' => $request->phone,
                    'city' => $request->city,
                ]);
            }

            DB::commit();

            // Fire registered event (triggers email verification)
            // event(new Registered($user));

            $token = JWTAuth::fromUser($user);

            if ($user->role === 'vendor') {
                $user->load(['vendor.activeSubscription', 'vendor.subscriptions']);
            } elseif ($user->role === 'client') {
                $user->load('client');
            }

            return response()->json([
                'message' => 'Compte créé avec succès',
                'token' => $token,
                'user' => $user,
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création du compte', 'error' => $e->getMessage()], 500);
        }
    }

    public function me()
    {
        $user = Auth::user();
        if ($user->role === 'vendor') {
            $user->load(['vendor.activeSubscription.package', 'vendor.subscriptions']);
        } elseif ($user->role === 'client') {
            $user->load('client');
        } else {
            $user->load(['staffProfile', 'memberships.team', 'memberships.role.permissions']);
        }
        return response()->json($user);
    }

    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        return response()->json(['message' => 'Successfully logged out']);
    }
}
