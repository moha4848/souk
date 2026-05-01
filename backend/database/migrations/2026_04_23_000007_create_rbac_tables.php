<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Teams (équipes internes SOUK)
        Schema::create('teams', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->unique(); // marketplace, finance, support, marketing, moderation, system
            $table->text('description')->nullable();
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        // Roles (liés à une team)
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('scope')->default('platform'); // platform, store
            $table->unique(['team_id', 'name']); // nom unique par team
            $table->timestamps();
        });

        // Permissions
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // ex: products.moderate
            $table->string('service'); // marketplace, finance, moderation, system
            $table->timestamps();
        });

        // Pivot: roles <-> permissions
        Schema::create('role_permission', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->primary(['role_id', 'permission_id']);
        });

        // Memberships: users <-> teams (avec leur role)
        Schema::create('user_team_memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('active'); // active, invited, suspended
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_team_memberships');
        Schema::dropIfExists('role_permission');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
        Schema::dropIfExists('teams');
    }
};
