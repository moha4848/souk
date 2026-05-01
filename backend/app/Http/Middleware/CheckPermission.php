<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission, ?string $service = null): Response
    {
        try {
            $user = auth('api')->user();
        } catch (\Exception $e) {
            return response()->json(['message' => 'Authentication error: ' . $e->getMessage()], 500);
        }

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Super Admin Bypass
        if ($user->isSuperAdmin()) {
            return $next($request);
        }

        // Check granular permission
        if ($user->hasPermission($permission, $service)) {
            return $next($request);
        }

        return response()->json([
            'message' => 'Unauthorized. Missing permission: ' . $permission . ($service ? ' for ' . $service : '')
        ], 403);
    }
}
