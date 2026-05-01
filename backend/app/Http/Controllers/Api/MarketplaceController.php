<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\MarketplaceService;
use App\Http\Resources\ProductResource;
use App\Http\Resources\VendorResource;

class MarketplaceController extends Controller
{
    protected MarketplaceService $marketplaceService;

    public function __construct(MarketplaceService $marketplaceService)
    {
        $this->marketplaceService = $marketplaceService;
    }

    public function explore()
    {
        $data = $this->marketplaceService->getExploreData();
        return response()->json([
            'featured_stores' => VendorResource::collection($data['featured_stores']),
            'trending_products' => ProductResource::collection($data['trending_products'])
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('q');
        $category = $request->input('category');

        $products = $this->marketplaceService->searchProducts($query, $category);

        return ProductResource::collection($products);
    }

    public function getStore($slug)
    {
        $data = $this->marketplaceService->getStoreData($slug);
        return response()->json([
            'store' => new VendorResource($data['store']),
            'products' => ProductResource::collection($data['products'])
        ]);
    }
}
