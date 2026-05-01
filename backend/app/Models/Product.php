<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Scopes\TenantScope;
use Illuminate\Database\Eloquent\Attributes\ScopedBy;

#[ScopedBy([TenantScope::class])]
class Product extends Model
{
    protected $fillable = [
        'vendor_id',
        'category',
        'name',
        'description',
        'price',
        'stock',
        'emoji',
        'image_url',
        'is_promo',
        'promo_price',
    ];

    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
