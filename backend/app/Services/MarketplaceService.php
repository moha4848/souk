<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Support\Facades\Cache;

class MarketplaceService
{
    public function getExploreData(): array
    {
        return Cache::remember('marketplace_explore', 3600, function () {
            $featuredStores = Vendor::where('status', 'active')
                ->take(6)
                ->get();

            $trendingProducts = Product::with('vendor')
                ->take(8)
                ->get();

            return [
                'featured_stores' => $featuredStores,
                'trending_products' => $trendingProducts
            ];
        });
    }

    public function searchProducts(?string $query, ?string $category)
    {
        $products = Product::query()->with('vendor');

        if ($query) {
            $products->where(function($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%");
            });
        }

        if ($category) {
            $products->where('category', $category);
        }

        return $products->latest()->paginate(20);
    }

    public function getStoreData(string $slug): array
    {
        return Cache::remember("store_{$slug}", 3600, function () use ($slug) {
            $store = Vendor::where('store_slug', $slug)
                ->firstOrFail();

            $products = Product::where('vendor_id', $store->id)->latest()->get();

            return [
                'store' => $store,
                'products' => $products
            ];
        });
    }
}
