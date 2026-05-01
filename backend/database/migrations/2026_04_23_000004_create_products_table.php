<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')->constrained('vendors')->cascadeOnDelete();


            // Info de base
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('stock')->default(0);
            $table->string('category')->default('Artisanat');
            $table->string('emoji')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_promo')->default(false);
            $table->decimal('promo_price', 10, 2)->default(0);
            $table->timestamp('flash_sale_end')->nullable();

            // Produit Digital
            $table->boolean('is_digital')->default(false);
            $table->string('file_path')->nullable(); // chemin du fichier téléchargeable

            // Storytelling / Contenu
            $table->text('story_text')->nullable();
            $table->string('video_url')->nullable();

            // Analytics & Social
            $table->unsignedBigInteger('views_count')->default(0);
            $table->unsignedBigInteger('likes_count')->default(0);

            // IA
            $table->boolean('ai_generated')->default(false);
            $table->json('tags')->nullable(); // tags générés par IA

            // Status
            $table->string('status')->default('active'); // active, pending, rejected
            $table->boolean('is_featured')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
