<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return response()->json(['message' => 'Vendor profile not found'], 404);
        }

        $vendorId = $vendor->id;
        
        // 1. Core Stats
        $totalRevenue = Order::where('vendor_id', $vendorId)
            ->where('status', '!=', 'cancelled')
            ->sum('total');
            
        $ordersCount = Order::where('vendor_id', $vendorId)->count();
        $productsCount = Product::where('vendor_id', $vendorId)->count();
        
        // 2. Recent Orders
        $recentOrders = Order::where('vendor_id', $vendorId)
            ->latest()
            ->take(5)
            ->get();
            
        // 3. Weekly Sales Graph Data
        $weeklySales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dayRevenue = Order::where('vendor_id', $vendorId)
                ->whereDate('created_at', $date->toDateString())
                ->where('status', '!=', 'cancelled')
                ->sum('total');
                
            $weeklySales[] = [
                'date' => $date->format('d/m'),
                'revenue' => (float)$dayRevenue
            ];
        }

        // 4. Growth calculation (Current month vs Last month)
        $currentMonthRevenue = Order::where('vendor_id', $vendorId)
            ->whereMonth('created_at', Carbon::now()->month)
            ->whereYear('created_at', Carbon::now()->year)
            ->where('status', '!=', 'cancelled')
            ->sum('total');
            
        $lastMonthRevenue = Order::where('vendor_id', $vendorId)
            ->whereMonth('created_at', Carbon::now()->subMonth()->month)
            ->whereYear('created_at', Carbon::now()->subMonth()->year)
            ->where('status', '!=', 'cancelled')
            ->sum('total');
            
        $growth = 0;
        if ($lastMonthRevenue > 0) {
            $growth = (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100;
        }

        // 5. Top Products Performance
        $topProducts = Product::where('vendor_id', $vendorId)
            ->withCount(['orderItems as sold' => function($q) {
                $q->select(DB::raw('sum(quantity)'));
            }])
            ->orderBy('sold', 'desc')
            ->take(3)
            ->get();

        return response()->json([
            'revenue' => (float)$totalRevenue,
            'orders_count' => $ordersCount,
            'products_count' => $productsCount,
            'recent_orders' => $recentOrders,
            'weekly_sales' => $weeklySales,
            'revenue_growth' => round($growth, 1),
            'top_products' => $topProducts,
            'visits' => 0, 
        ]);
    }
}
