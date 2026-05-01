<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('price', 8, 2)->default(0); // 0 = gratuit
            $table->integer('max_products')->default(10);
            $table->decimal('commission_rate', 5, 2)->default(10.00); // % commission SOUK
            $table->json('features')->nullable(); // liste des fonctionnalités incluses
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
