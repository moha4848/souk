<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\Api\SuperAdminController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\PublicStoreController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ChatController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\UploadController;

Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::post('/admin/login', [AuthController::class, 'adminLogin'])->middleware('throttle:5,1');
Route::post('/register', [AuthController::class, 'register']);

// Email Verification
Route::get('/verify-email/{id}/{hash}', [\App\Http\Controllers\Api\VerificationController::class, 'verify'])->name('verification.verify');
Route::post('/email/resend', [\App\Http\Controllers\Api\VerificationController::class, 'resend'])->middleware(['auth:api'])->name('verification.resend');


// Public Storefront (Legacy)
Route::get('/store/{slug}', [PublicStoreController::class, 'getStoreBySlug']);
Route::get('/store/{slug}/products/{id}', [PublicStoreController::class, 'getProduct']);

// Public Marketplace & AI Search
Route::get('/marketplace/search', [App\Http\Controllers\Api\MarketplaceController::class, 'search']);
Route::get('/marketplace/explore', [App\Http\Controllers\Api\MarketplaceController::class, 'explore']);
Route::get('/marketplace/stores/{slug}', [App\Http\Controllers\Api\MarketplaceController::class, 'getStore']);

Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/upload', [UploadController::class, 'upload']);

    // Chat & Messaging
    Route::prefix('chat')->group(function () {
        Route::get('/conversations', [ChatController::class, 'getConversations']);
        Route::post('/start', [ChatController::class, 'startConversation']);
        Route::get('/conversations/{conversation}', [ChatController::class, 'getConversation']);
        Route::post('/conversations/{conversation}/messages', [ChatController::class, 'sendMessage']);
        Route::post('/conversations/{conversation}/read', [ChatController::class, 'markAsRead']);
        Route::patch('/conversations/{conversation}', [ChatController::class, 'updateConversation']);
        Route::get('/unread-count', [ChatController::class, 'getUnreadCount']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'getNotifications']);
        Route::get('/unread', [NotificationController::class, 'getUnreadNotifications']);
        Route::get('/stats', [NotificationController::class, 'getNotificationStats']);
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::post('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{notification}', [NotificationController::class, 'delete']);
        Route::delete('/read', [NotificationController::class, 'deleteReadNotifications']);
    });

    // SaaS Onboarding
    Route::get('/packages', [OnboardingController::class, 'getPackages']);
    Route::post('/onboarding/project-type', [OnboardingController::class, 'updateProjectType']);
    Route::post('/onboarding/subscribe', [OnboardingController::class, 'subscribe']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Product Management
    Route::apiResource('products', ProductController::class);

    // Orders & SaaS Logic (Commissions/Points)
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/vendor', [OrderController::class, 'getVendorOrders']);
    Route::get('/orders/client', [OrderController::class, 'getClientOrders']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::patch('/orders/{id}', [OrderController::class, 'update']);

    // SuperAdmin Logic & RBAC Team Management
    Route::prefix('admin')->group(function () {
        // Stats & Dashboard
        Route::get('/stats', [SuperAdminController::class, 'getStats']);
        Route::get('/dashboard', [App\Http\Controllers\Api\AdminController::class, 'dashboard'])
             ->middleware('permission:logs.view,system');

        // User Validation (Moderation)
        Route::get('/pending-users', [SuperAdminController::class, 'getPendingUsers'])
             ->middleware('permission:stores.approve,moderation');
        Route::post('/users/{id}/approve', [SuperAdminController::class, 'approveUser'])
             ->middleware('permission:stores.approve,moderation');
        Route::post('/users/{id}/reject', [SuperAdminController::class, 'rejectUser'])
             ->middleware('permission:stores.approve,moderation');

        // Subscription Validation (Finance)
        Route::get('/pending-subscriptions', [SuperAdminController::class, 'getPendingSubscriptions'])
             ->middleware('permission:subscriptions.manage,finance');
        Route::post('/subscriptions/{id}/approve', [SuperAdminController::class, 'approveSubscription'])
             ->middleware('permission:subscriptions.manage,finance');
        Route::post('/subscriptions/{id}/reject', [SuperAdminController::class, 'rejectSubscription'])
             ->middleware('permission:subscriptions.manage,finance');

        // Team & Roles (SuperAdmin/System)
        Route::post('/team/invite', [App\Http\Controllers\Api\AdminController::class, 'invite'])
             ->middleware('permission:settings.global,system');

        Route::put('/roles/{id}/permissions', [App\Http\Controllers\Api\AdminController::class, 'assignPermissions'])
             ->middleware('permission:settings.global,system');

        Route::get('/activity-logs', [App\Http\Controllers\Api\AdminController::class, 'getActivityLogs'])
             ->middleware('permission:logs.view,system');

        Route::get('/teams-overview', [App\Http\Controllers\Api\AdminController::class, 'getTeamsOverview'])
             ->middleware('permission:settings.global,system');

        Route::get('/finance/commissions', [SuperAdminController::class, 'getCommissions'])
             ->middleware('permission:commissions.manage,finance');
    });

    // Seller SaaS Dashboard & AI
    Route::prefix('seller')->group(function () {
        Route::post('/ai-generator/store', [App\Http\Controllers\Api\AIGeneratorController::class, 'generateStore']);
        Route::post('/ai-generator/product', [App\Http\Controllers\Api\AIGeneratorController::class, 'generateProduct']);
        Route::get('/analytics', [App\Http\Controllers\Api\SellerDashboardController::class, 'analytics']);
        Route::put('/settings/theme', [App\Http\Controllers\Api\SellerDashboardController::class, 'updateTheme']);
    });

    // Social Commerce
    Route::post('/social/{store_id}/follow', [App\Http\Controllers\Api\SocialCommerceController::class, 'followStore']);
    Route::post('/social/product/{product_id}/like', [App\Http\Controllers\Api\SocialCommerceController::class, 'likeProduct']);
});
