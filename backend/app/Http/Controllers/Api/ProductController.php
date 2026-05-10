<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    /**
     * Display a listing of products for the authenticated vendor.
     */
    public function index()
    {
        $vendor = Auth::user()->vendor;
        if (!$vendor) {
            return response()->json(['error' => 'No vendor profile found'], 403);
        }
        
        $products = Product::where('vendor_id', $vendor->id)
            ->latest()
            ->paginate(15);
        return response()->json($products);
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(\App\Http\Requests\ProductRequest $request)
    {
        $vendor = Auth::user()->vendor;
        if (!$vendor) {
            return response()->json(['error' => 'No vendor profile found'], 403);
        }
        
        $validated = $request->validated();

        $product = Product::create([
            ...$validated,
            'vendor_id' => $vendor->id,
            'is_promo' => $request->is_promo ?? false,
        ]);

        // Clear cache
        Cache::forget('marketplace_explore');
        Cache::forget("store_" . $vendor->store_slug);

        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show($id)
    {
        $vendor = Auth::user()->vendor;
        if (!$vendor) {
            return response()->json(['error' => 'No vendor profile found'], 403);
        }
        
        $product = Product::where('vendor_id', $vendor->id)->findOrFail($id);
        return response()->json($product);
    }

    /**
     * Display the specified product.
     */

    /**
     * Update the specified product in storage.
     */
    public function update(\App\Http\Requests\ProductRequest $request, $id)
    {
        $vendor = Auth::user()->vendor;
        if (!$vendor) {
            return response()->json(['error' => 'No vendor profile found'], 403);
        }
        
        $product = Product::where('vendor_id', $vendor->id)->findOrFail($id);

        $validated = $request->validated();

        $product->update([
            ...$validated,
            'is_promo' => $request->is_promo ?? false,
        ]);

        // Clear cache
        Cache::forget('marketplace_explore');
        Cache::forget("store_" . $vendor->store_slug);

        return response()->json($product);
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy($id)
    {
        $vendor = Auth::user()->vendor;
        if (!$vendor) {
            return response()->json(['error' => 'No vendor profile found'], 403);
        }

        $product = Product::where('vendor_id', $vendor->id)->findOrFail($id);
        $product->delete();

        // Clear cache
        Cache::forget('marketplace_explore');
        Cache::forget("store_" . $vendor->store_slug);

        return response()->json(['message' => 'Produit supprimé avec succès']);
    }
}
