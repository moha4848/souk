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
use Illuminate\Database\Eloquent\ModelNotFoundException;
use InvalidArgumentException;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(\App\Services\OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function store(OrderRequest $request)
    {
        try {
            $result = $this->orderService->createOrder($request->all());

            return response()->json([
                'message' => 'Commande passée avec succès',
                'order' => $result['order'],
                'points_earned' => $result['points_earned']
            ], 201);
        } catch (InvalidArgumentException $e) {
            return response()->json([
                'message' => 'Commande invalide',
                'error' => $e->getMessage()
            ], 422);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Ressource introuvable',
                'error' => 'Produit, vendeur ou client introuvable'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de la commande',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getVendorOrders()
    {
        $vendor = Auth::user()->vendor;
        if (!$vendor) {
            return response()->json(['error' => 'No vendor profile found'], 403);
        }
        
        $orders = Order::with('items.product')
            ->where('vendor_id', $vendor->id)
            ->latest()
            ->paginate(15);
            
        return response()->json($orders);
    }

    public function getClientOrders()
    {
        $client = Auth::user()->client;
        if (!$client) {
            return response()->json(['error' => 'No client profile found'], 403);
        }
        
        return response()->json(Order::with('items.product')->where('client_id', $client->id)->latest()->get());
    }

    public function show($id)
    {
        $user = Auth::user();
        $vendorId = $user->vendor?->id;
        $clientId = $user->client?->id;

        if (!$vendorId && !$clientId) {
            return response()->json(['error' => 'No vendor or client profile found'], 403);
        }

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
        $vendor = Auth::user()->vendor;
        if (!$vendor) {
            return response()->json(['error' => 'No vendor profile found'], 403);
        }
        
        $order = Order::where('vendor_id', $vendor->id)->findOrFail($id);
        
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
