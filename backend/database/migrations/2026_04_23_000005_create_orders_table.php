<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendors')->cascadeOnDelete();
            $table->foreignId('client_id')->nullable()->constrained('clients')->nullOnDelete(); // client connecté

            // Infos client (pour commandes invité aussi)
            $table->string('client_name');
            $table->string('client_email')->nullable();
            $table->string('client_phone')->nullable();

            // Livraison
            $table->string('shipping_address')->nullable();
            $table->string('shipping_city')->nullable();
            $table->string('delivery_method')->default('standard'); // standard, express

            // Financier
            $table->decimal('total', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->integer('points_used')->default(0);
            $table->integer('points_earned')->default(0);
            $table->string('payment_method')->default('cod'); // cod, card, virement
            $table->string('coupon_code')->nullable(); // code promo utilisé

            // Statut
            $table->string('status')->default('pending'); // pending, paid, shipped, delivered, cancelled

            // Affiliation
            $table->string('affiliate_code')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name'); // snapshot du nom au moment de la commande
            $table->integer('quantity');
            $table->decimal('price', 10, 2); // prix au moment de l'achat
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
