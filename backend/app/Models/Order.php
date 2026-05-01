<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([TenantScope::class])]
class Order extends Model
{
    protected $fillable = [
        'client_id',
        'vendor_id',
        'client_name',
        'client_email',
        'client_phone',
        'shipping_address',
        'shipping_city',
        'total',
        'discount',
        'points_used',
        'points_earned',
        'status',
        'payment_method',
        'delivery_method',
        'notes',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function commission()
    {
        return $this->hasOne(Commission::class);
    }
}
