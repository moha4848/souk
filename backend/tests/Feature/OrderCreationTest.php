<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vendor;
use App\Models\Client;
use App\Models\Product;
use App\Models\Package;
use App\Models\Subscription;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tymon\JWTAuth\Facades\JWTAuth;

class OrderCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_receives_order_and_stock_is_deducted()
    {
        // 1. Setup Data
        $admin = User::factory()->create(['role' => 'superadmin']);
        
        $vendorUser = User::factory()->create(['role' => 'vendor', 'status' => 'approved']);
        $vendor = Vendor::create([
            'user_id' => $vendorUser->id,
            'shop_name' => 'Artisan Test',
            'store_slug' => 'artisan-test'
        ]);

        $package = Package::create([
            'name' => 'Pro',
            'price' => 100,
            'commission_rate' => 5,
            'features' => []
        ]);

        Subscription::create([
            'vendor_id' => $vendor->id,
            'package_id' => $package->id,
            'status' => 'active',
            'starts_at' => now(),
            'expires_at' => now()->addMonth()
        ]);

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'name' => 'Produit Test',
            'price' => 200,
            'stock' => 10,
            'category' => 'Test'
        ]);

        $clientUser = User::factory()->create(['role' => 'client']);
        $client = Client::create([
            'user_id' => $clientUser->id,
            'loyalty_points' => 0
        ]);

        // 2. Perform Action
        $token = JWTAuth::fromUser($clientUser);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/orders', [
                'store_id' => $vendor->id,
                'client_name' => 'Client Test',
                'client_email' => $clientUser->email,
                'client_phone' => '0612345678',
                'shipping_address' => '123 Rue Test',
                'shipping_city' => 'Casablanca',
                'payment_method' => 'cod',
                'delivery_method' => 'standard',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 2
                    ]
                ]
            ]);

        // 3. Assertions
        $response->assertStatus(201);
        
        // Check stock
        $this->assertEquals(8, $product->fresh()->stock);

        // Check commission (5% of 400 = 20)
        $this->assertDatabaseHas('commissions', [
            'vendor_id' => $vendor->id,
            'amount' => 20
        ]);

        // Check loyalty points (3 earned)
        $this->assertEquals(3, $client->fresh()->loyalty_points);
    }

    public function test_order_is_rejected_when_stock_is_insufficient()
    {
        $vendorUser = User::factory()->create(['role' => 'vendor', 'status' => 'approved']);
        $vendor = Vendor::create([
            'user_id' => $vendorUser->id,
            'shop_name' => 'Artisan Test',
            'store_slug' => 'artisan-test-stock'
        ]);

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'name' => 'Produit Rare',
            'price' => 200,
            'stock' => 1,
            'category' => 'Test'
        ]);

        $clientUser = User::factory()->create(['role' => 'client']);
        Client::create([
            'user_id' => $clientUser->id,
            'loyalty_points' => 0
        ]);

        $token = JWTAuth::fromUser($clientUser);

        $response = $this->withHeader('Authorization', "Bearer $token")
            ->postJson('/api/orders', [
                'store_id' => $vendor->id,
                'client_name' => 'Client Test',
                'client_email' => $clientUser->email,
                'client_phone' => '0612345678',
                'shipping_address' => '123 Rue Test',
                'shipping_city' => 'Casablanca',
                'payment_method' => 'cod',
                'delivery_method' => 'standard',
                'items' => [
                    [
                        'product_id' => $product->id,
                        'quantity' => 2
                    ]
                ]
            ]);

        $response->assertStatus(422);
        $this->assertEquals(1, $product->fresh()->stock);
        $this->assertDatabaseCount('orders', 0);
    }
}
