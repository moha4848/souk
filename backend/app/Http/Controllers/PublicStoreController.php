<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class PublicStoreController extends Controller
{
    public function getStoreBySlug($slug)
    {
        return Cache::remember("store_v2_{$slug}", 3600, function() use ($slug) {
            $vendor = \App\Models\Vendor::with('user')->where('store_slug', $slug)->firstOrFail();
            
            return [
                'vendor' => [
                    'id' => $vendor->id,
                    'name' => $vendor->user->name,
                    'shop_name' => $vendor->shop_name,
                    'project_type' => $vendor->user->project_type,
                    'description' => $vendor->description,
                    'logo_url' => $vendor->logo_url,
                    'banner_url' => $vendor->banner_url,
                    'theme_settings' => $vendor->theme_settings,
                ],
                'products' => $vendor->products()->latest()->get()
            ];
        });
    }

    public function getProduct($slug, $id)
    {
        return Cache::remember("product_{$id}", 3600, function() use ($slug, $id) {
            $product = Product::with('vendor.user')->where('id', $id)
                ->whereHas('vendor', function($q) use ($slug) {
                    $q->where('store_slug', $slug);
                })->firstOrFail();
                
            return [
                'product' => $product,
                'vendor' => [
                    'id' => $product->vendor->id,
                    'shop_name' => $product->vendor->shop_name,
                    'store_slug' => $product->vendor->store_slug,
                    'theme_settings' => $product->vendor->theme_settings,
                    'logo_url' => $product->vendor->logo_url,
                ]
            ];
        });
    }
}
