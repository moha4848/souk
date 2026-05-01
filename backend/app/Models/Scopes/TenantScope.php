<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Support\Facades\Auth;

class TenantScope implements Scope
{
    /**
     * Apply the scope to a given Eloquent query builder.
     */
    public function apply(Builder $builder, Model $model): void
    {
        $user = Auth::user();

        // 1. If we are in the vendor dashboard (role = vendor or staff)
        // 2. We only filter if the user is a vendor or staff member viewing data
        // 3. We do NOT filter if the user is a SuperAdmin or if they are in the public storefront (no auth)
        
        if ($user && !$user->isSuperAdmin()) {
            if ($user->role === 'vendor' && $user->vendor) {
                $builder->where('vendor_id', $user->vendor->id);
            }
            // Add staff filtering if needed
        }
    }
}
