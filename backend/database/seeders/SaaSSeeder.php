<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Team;
use App\Models\Permission;
use App\Models\User;
use App\Models\Role;
use App\Models\TeamMembership;
use App\Models\Package;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Vendor;
use App\Models\Client;
use App\Models\Staff;
use App\Models\Subscription;
use Carbon\Carbon;

class SaaSSeeder extends Seeder
{
    public function run(): void
    {
        // 1. PACKAGES SaaS
        $packages = [
            [
                'name'            => 'Découverte (Gratuit)',
                'price'           => 0,
                'max_products'    => 10,
                'commission_rate' => 15.00,
                'features'        => ['10 produits max', 'Dashboard basique', 'Support email'],
            ],
            [
                'name'            => 'Croissance (Pro)',
                'price'           => 199,
                'max_products'    => 100,
                'commission_rate' => 8.00,
                'features'        => ['100 produits', 'AI Generator', 'Analytics avancés', 'Thème personnalisé'],
            ],
            [
                'name'            => 'Premium',
                'price'           => 499,
                'max_products'    => 9999,
                'commission_rate' => 5.00,
                'features'        => ['Produits illimités', 'AI complet', 'Domaine personnalisé', 'Support prioritaire'],
            ],
        ];
        foreach ($packages as $pkg) {
            Package::updateOrCreate(['name' => $pkg['name']], $pkg);
        }

        // 2. TEAMS + ROLES + PERMISSIONS
        $team = Team::updateOrCreate(['type' => 'system'], [
            'name' => 'System Team',
            'description' => 'Administration globale du système'
        ]);

        $role = Role::updateOrCreate(
            ['team_id' => $team->id, 'name' => 'Manager'],
            ['description' => 'Manager Système', 'scope' => 'platform']
        );

        // 3. UNIQUE SUPERADMIN
        $superadmin = User::create([
            'name'          => 'Admin Emerald',
            'email'         => 'admin@souk.ma',
            'password'      => bcrypt('password'),
            'role'          => 'superadmin',
            'is_super_admin'=> true,
            'status'        => 'approved',
            'phone'         => '0600000001',
            'city'          => 'Casablanca',
        ]);
        Staff::create(['user_id' => $superadmin->id, 'position' => 'Superviseur']);

        // 4. UNIQUE STAFF
        $staffUser = User::create([
            'name'     => 'Staff Emerald',
            'email'    => 'staff@souk.ma',
            'password' => bcrypt('password'),
            'role'     => 'staff',
            'status'   => 'approved',
            'phone'    => '0600000002',
            'city'     => 'Casablanca',
        ]);
        Staff::create(['user_id' => $staffUser->id, 'position' => 'Manager']);
        TeamMembership::create([
            'user_id' => $staffUser->id, 
            'team_id' => $team->id,
            'role_id' => $role->id, 
            'status' => 'active'
        ]);

        // 5. UNIQUE VENDOR
        $vendorUser = User::create([
            'name'     => 'Vendor Emerald',
            'email'    => 'vendor@souk.ma',
            'password' => bcrypt('password'),
            'role'     => 'vendor',
            'status'   => 'approved',
            'phone'    => '0600000003',
            'city'     => 'Marrakech',
        ]);
        
        $vendorProfile = Vendor::create([
            'user_id' => $vendorUser->id,
            'shop_name' => "Emerald Artisanat",
            'store_slug' => 'emerald-shop',
            'description' => 'Boutique officielle Emerald Edition.',
            'phone' => '0600000003',
            'city' => 'Marrakech',
            'status' => 'active',
            'theme_settings' => ['primaryColor' => '#10b981'],
        ]);

        $premium = Package::where('name', 'Premium')->first();
        Subscription::create([
            'vendor_id' => $vendorProfile->id,
            'package_id' => $premium->id,
            'status' => 'active',
            'starts_at' => now(),
            'expires_at' => now()->addYear(),
        ]);

        $this->seedProducts($vendorProfile);

        // 6. UNIQUE CLIENT
        $clientUser = User::create([
            'name'     => 'Client Emerald',
            'email'    => 'client@souk.ma',
            'password' => bcrypt('password'),
            'role'     => 'client',
            'status'   => 'approved',
            'phone'    => '0600000004',
            'city'     => 'Rabat',
        ]);
        Client::create([
            'user_id' => $clientUser->id,
            'phone' => '0600000004',
            'city' => 'Rabat',
            'loyalty_points' => 100,
        ]);
    }

    // HELPERS
    private function seedProducts(Vendor $vendor): void
    {
        $data = [
            'emerald-shop'  => [
                ['name' => 'Vase Zellige Royal', 'price' => 450,  'category' => 'Décoration', 'image_url' => 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800'],
                ['name' => 'Tapis Berbère Beni Ourain', 'price' => 2800, 'category' => 'Artisanat', 'image_url' => 'https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&q=80&w=800'],
                ['name' => 'Sac en Cuir Atlas', 'price' => 850, 'category' => 'Maroquinerie', 'image_url' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800'],
                ['name' => 'Caftan Silk Emerald', 'price' => 4200, 'category' => 'Mode Luxe', 'image_url' => 'https://images.unsplash.com/photo-1583391733959-f18306385d85?auto=format&fit=crop&q=80&w=800'],
                ['name' => 'Smartphone Horizon X1', 'price' => 6499, 'category' => 'Technologie', 'image_url' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800'],
                ['name' => 'Sérum Éclat Argan', 'price' => 290,  'category' => 'Bien-être', 'image_url' => 'https://images.unsplash.com/photo-1612132384740-4b553e1987d6?auto=format&fit=crop&q=80&w=800'],
                ['name' => 'Montre Atlas Automatic', 'price' => 3200, 'category' => 'Bijouterie', 'image_url' => 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800'],
                ['name' => 'Casque Audio Emerald', 'price' => 1800, 'category' => 'Technologie', 'image_url' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'],
            ],
        ];

        $list = $data[$vendor->store_slug] ?? [];

        foreach ($list as $p) {
            Product::create(array_merge($p, [
                'vendor_id'   => $vendor->id,
                'stock'       => rand(10, 50),
                'description' => 'Qualité premium faite main au Maroc.',
                'is_promo'    => false,
            ]));
        }
    }

    private function seedOrders(Vendor $vendor): void
    {
        $product = Product::where('vendor_id', $vendor->id)->first();

        for ($i = 0; $i < 10; $i++) {
            $total = rand(300, 5000);
            $order = Order::create([
                'vendor_id'       => $vendor->id,
                'client_name'     => 'Client ' . rand(1, 100),
                'client_email'    => 'client' . rand(1, 100) . '@gmail.com',
                'client_phone'    => '06' . rand(10000000, 99999999),
                'shipping_address'=> 'Rue ' . rand(1, 200) . ', Apt ' . rand(1, 50),
                'shipping_city'   => ['Casablanca', 'Rabat', 'Marrakech', 'Fès'][rand(0, 3)],
                'total'           => $total,
                'status'          => ['pending', 'delivered', 'shipped', 'paid'][rand(0, 3)],
                'payment_method'  => ['cod', 'card'][rand(0, 1)],
                'delivery_method' => ['standard', 'express'][rand(0, 1)],
                'created_at'      => Carbon::now()->subDays(rand(0, 60)),
            ]);

            if ($product) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'product_id'   => $product->id,
                    'product_name' => $product->name,
                    'quantity'     => rand(1, 3),
                    'price'        => $product->price,
                ]);
            }
        }
    }
}
