<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Services\VendorService;

class SellerDashboardController extends Controller
{
    protected VendorService $vendorService;

    public function __construct(VendorService $vendorService)
    {
        $this->vendorService = $vendorService;
    }

    /**
     * Get analytics data for the authenticated seller.
     */
    public function analytics()
    {
        $vendor = Auth::user()->vendor;
        if (!$vendor) return response()->json(['message' => 'Profile vendeur introuvable'], 404);

        $data = $this->vendorService->getAnalyticsData($vendor);

        return response()->json($data);
    }

    /**
     * Update the seller's theme and store settings.
     */
    public function updateTheme(\App\Http\Requests\UpdateStoreSettingsRequest $request)
    {
        $vendor = Auth::user()->vendor;
        if (!$vendor) return response()->json(['message' => 'Profile vendeur introuvable'], 404);

        $storeInfo = $this->vendorService->updateStoreSettings($vendor, $request->validated());

        return response()->json([
            'message' => 'Paramètres du magasin mis à jour avec succès',
            'store_info' => $storeInfo
        ]);
    }
}
