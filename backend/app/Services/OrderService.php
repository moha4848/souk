<?php

namespace App\Services;

use App\Models\Commission;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class OrderService
{
    /**
     * Traite la creation complete d'une commande.
     * Centralise la logique metier : stock, fidelite et commissions.
     */
    public function createOrder(array $data)
    {
        return DB::transaction(function () use ($data) {
            $vendor = Vendor::with('activeSubscription.package')->findOrFail($data['store_id']);
            $client = $this->resolveClient($data['client_email'] ?? null);
            $totals = $this->processItemsAndCalculateTotals($data['items'], $vendor->id);

            $discount = 0;
            if ($client && ($data['points_used'] ?? 0) > 0) {
                $discount = $this->applyLoyaltyDiscount($client, $data['points_used']);
            }

            $finalTotal = max(0, $totals['subtotal'] - $discount);
            $pointsEarned = 3;

            if ($client) {
                $client->increment('loyalty_points', $pointsEarned);
            }

            $order = Order::create([
                'client_id' => $client ? $client->id : null,
                'vendor_id' => $vendor->id,
                'client_name' => $data['client_name'],
                'client_email' => $data['client_email'] ?? null,
                'client_phone' => $data['client_phone'] ?? null,
                'shipping_address' => $data['shipping_address'],
                'shipping_city' => $data['shipping_city'],
                'total' => $finalTotal,
                'discount' => $discount,
                'points_used' => $data['points_used'] ?? 0,
                'points_earned' => $pointsEarned,
                'status' => 'pending',
                'payment_method' => $data['payment_method'],
                'delivery_method' => $data['delivery_method'],
                'notes' => $data['notes'] ?? null,
            ]);

            $this->saveOrderItems($order, $totals['item_details']);
            $this->calculateCommission($order, $vendor);

            return [
                'order' => $order,
                'points_earned' => $pointsEarned,
            ];
        });
    }

    private function resolveClient(?string $email)
    {
        if (!$email) {
            return null;
        }

        $user = User::where('email', $email)->with('client')->first();

        if ($user && !$user->client) {
            throw new InvalidArgumentException("Aucun profil client n'est associe a cet email.");
        }

        return $user ? $user->client : null;
    }

    private function processItemsAndCalculateTotals(array $items, int $vendorId)
    {
        $subtotal = 0;
        $itemDetails = [];

        foreach ($items as $item) {
            $quantity = (int) $item['quantity'];
            $product = Product::withoutGlobalScopes()
                ->where('vendor_id', $vendorId)
                ->lockForUpdate()
                ->find($item['product_id']);

            if (!$product) {
                throw (new ModelNotFoundException())->setModel(Product::class, [$item['product_id']]);
            }

            if ($product->stock < $quantity) {
                throw new InvalidArgumentException(
                    "Stock insuffisant pour {$product->name}. Disponible: {$product->stock}, demande: {$quantity}."
                );
            }

            $subtotal += $product->price * $quantity;
            $product->decrement('stock', $quantity);

            $itemDetails[] = [
                'product' => $product,
                'quantity' => $quantity,
            ];
        }

        return [
            'subtotal' => $subtotal,
            'item_details' => $itemDetails,
        ];
    }

    private function applyLoyaltyDiscount($client, $pointsRequested)
    {
        $pointsRequested = (int) $pointsRequested;
        if ($pointsRequested <= 0) {
            return 0;
        }

        $pointsToUse = min($client->loyalty_points, $pointsRequested);
        $discount = $pointsToUse / 10; // 10 points = 1 MAD
        $client->decrement('loyalty_points', $pointsToUse);

        return $discount;
    }

    private function saveOrderItems(Order $order, array $details)
    {
        foreach ($details as $detail) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $detail['product']->id,
                'product_name' => $detail['product']->name,
                'quantity' => $detail['quantity'],
                'price' => $detail['product']->price,
            ]);
        }
    }

    private function calculateCommission(Order $order, Vendor $vendor)
    {
        $rate = $vendor->activeSubscription->package->commission_rate ?? 10;
        $amount = $order->total * ($rate / 100);

        Commission::create([
            'order_id' => $order->id,
            'vendor_id' => $vendor->id,
            'amount' => $amount,
            'rate' => $rate,
            'status' => 'pending',
        ]);
    }
}
