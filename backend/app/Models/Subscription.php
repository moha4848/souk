<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([TenantScope::class])]
class Subscription extends Model
{
    protected $fillable = [
        'vendor_id',
        'package_id',
        'status',
        'starts_at',
        'expires_at',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function package()
    {
        return $this->belongsTo(Package::class);
    }
}
