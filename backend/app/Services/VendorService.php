<?php

namespace App\Services;

use App\Models\Vendor;
use App\Models\Product;
use App\Models\Order;
use App\Models\Commission;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;

class VendorService
{
    /**
     * Get analytics dashboard data for a vendor.
     *
     * @param Vendor $vendor
     * @return array
     */
    public function getAnalyticsData(Vendor $vendor): array
    {
        $vendor->load(['activeSubscription.package']);
        $subscription = $vendor->activeSubscription;
        $package = $subscription ? $subscription->package : null;

        $totalProducts = Product::where('vendor_id', $vendor->id)->count();
        $totalOrders = Order::where('vendor_id', $vendor->id)->count();
        $totalRevenue = Order::where('vendor_id', $vendor->id)
                             ->where('status', '!=', 'cancelled')
                             ->sum('total');
        
        $totalCommissions = Commission::where('vendor_id', $vendor->id)->sum('amount');
        
        $recentOrders = Order::where('vendor_id', $vendor->id)
                             ->latest()
                             ->take(5)
                             ->get();

        $weeklySales = $this->getWeeklySales($vendor->id);

        return [
            'stats' => [
                'total_products' => $totalProducts,
                'total_orders'   => $totalOrders,
                'total_revenue'  => $totalRevenue,
                'total_commissions' => $totalCommissions,
                'visitors'       => rand(500, 2500), // AI Simulation
            ],
            'recent_orders' => $recentOrders,
            'weekly_sales' => $weeklySales,
            'store_info' => [
                'name' => $vendor->shop_name,
                'slug' => $vendor->store_slug,
                'theme' => $vendor->theme_settings,
                'commission_rate' => $package ? $package->commission_rate : 10,
                'package_name' => $package ? $package->name : 'Aucun',
                'max_products' => $package ? $package->max_products : 10,
            ]
        ];
    }

    /**
     * Get the last 7 days of sales.
     *
     * @param int $vendorId
     * @return array
     */
    private function getWeeklySales(int $vendorId): array
    {
        $weeklySales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i)->format('Y-m-d');
            $revenue = Order::where('vendor_id', $vendorId)
                            ->whereDate('created_at', $date)
                            ->where('status', '!=', 'cancelled')
                            ->sum('total');
            $weeklySales[] = [
                'day' => Carbon::parse($date)->format('D'),
                'revenue' => (float)$revenue
            ];
        }
        return $weeklySales;
    }

    /**
     * Update the vendor's theme and store settings.
     *
     * @param Vendor $vendor
     * @param array $data
     * @return array
     */
    public function updateStoreSettings(Vendor $vendor, array $data): array
    {
        $vendor->update(array_filter([
            'shop_name'         => $data['shop_name'] ?? null,
            'description'       => $data['store_description'] ?? null,
            'theme_settings'    => $data['theme_settings'] ?? null,
        ]));

        Cache::forget('marketplace_explore');
        Cache::forget("store_" . $vendor->store_slug);

        return [
            'name' => $vendor->shop_name,
            'description' => $vendor->description,
            'theme' => $vendor->theme_settings,
        ];
    }
}
