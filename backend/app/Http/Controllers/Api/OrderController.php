<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Http\Requests\OrderRequest;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Commission;
use App\Models\User;
use App\Models\Vendor;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(OrderRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $vendor = \App\Models\Vendor::with('activeSubscription.package')->findOrFail($request->store_id);
            $clientUser = null;
            $client = null;
            if ($request->client_email) {
                $clientUser = User::where('email', $request->client_email)->with('client')->first();
                $client = $clientUser ? $clientUser->client : null;
            }

            // 1. Calculate totals
            $subtotal = 0;
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                $subtotal += $product->price * $item['quantity'];
                
                // Deduct stock
                $product->decrement('stock', $item['quantity']);
            }

            $discount = 0;
            if ($client && $request->points_used > 0) {
                // Example: 10 points = 1 MAD discount
                $pointsToUse = min($client->loyalty_points, $request->points_used);
                $discount = $pointsToUse / 10;
                $client->decrement('loyalty_points', $pointsToUse);
            }

            $total = $subtotal - $discount;
            
            // 2. Loyalty points earning (1 achat = 3 points)
            $pointsEarned = 3;
            if ($client) {
                $client->increment('loyalty_points', $pointsEarned);
            }

            // 3. Create Order
            $order = Order::create([
                'client_id' => $client ? $client->id : null,
                'vendor_id' => $vendor->id,
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
                'client_phone' => $request->client_phone,
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'total' => $total,
                'discount' => $discount,
                'points_used' => $request->points_used ?? 0,
                'points_earned' => $pointsEarned,
                'status' => 'pending', 
                'payment_method' => $request->payment_method,
                'delivery_method' => $request->delivery_method,
                'notes' => $request->notes,
            ]);

            // 4. Save Items
            foreach ($request->items as $item) {
                $product = Product::find($item['product_id']);
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);
            }

            // 5. Calculate and Record Admin Commission
            $commissionRate = 10; // Default rate
            if ($vendor && $vendor->activeSubscription && $vendor->activeSubscription->package) {
                $commissionRate = $vendor->activeSubscription->package->commission_rate;
            }
            $commissionAmount = $total * ($commissionRate / 100);
            Commission::create([
                'order_id' => $order->id,
                'vendor_id' => $vendor->id,
                'amount' => $commissionAmount,
                'status' => 'pending',
            ]);

            return response()->json([
                'message' => 'Commande passée avec succès',
                'order' => $order,
                'points_earned' => $pointsEarned
            ], 201);
        });
    }

    public function getVendorOrders()
    {
        $vendorId = Auth::user()->vendor->id ?? null;
        if (!$vendorId) return response()->json([]);
        
        return response()->json(Order::with('items.product')->where('vendor_id', $vendorId)->latest()->get());
    }

    public function getClientOrders()
    {
        $clientId = Auth::user()->client->id ?? null;
        if (!$clientId) return response()->json([]);
        
        return response()->json(Order::with('items.product')->where('client_id', $clientId)->latest()->get());
    }

    public function show($id)
    {
        $user = Auth::user();
        $vendorId = $user->vendor->id ?? null;
        $clientId = $user->client->id ?? null;

        $order = Order::with('items.product')
            ->where(function($q) use ($vendorId, $clientId) {
                if ($vendorId) $q->where('vendor_id', $vendorId);
                if ($clientId) $q->orWhere('client_id', $clientId);
            })
            ->findOrFail($id);

        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $vendorId = Auth::user()->vendor->id ?? null;
        if (!$vendorId) abort(403);
        
        $order = Order::where('vendor_id', $vendorId)->findOrFail($id);
        
        $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled'
        ]);

        $order->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Statut de la commande mis à jour',
            'order' => $order
        ]);
    }
}
