<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class SocialCommerceController extends Controller
{
    /**
     * Toggle follow/unfollow for a store.
     */
    public function followStore($store_id)
    {
        $client = Auth::user();
        $store = \App\Models\Vendor::findOrFail($store_id);

        if ($client->id === $store->id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous suivre vous-même'], 400);
        }

        $client->following()->toggle($store->id);
        $isFollowing = $client->following()->where('following_id', $store->id)->exists();

        return response()->json([
            'message' => $isFollowing ? 'Abonnement réussi' : 'Désabonné',
            'is_following' => $isFollowing,
            'follower_count' => $store->followers()->count()
        ]);
    }

    /**
     * Toggle like/unlike for a product.
     */
    public function likeProduct($product_id)
    {
        $client = Auth::user();
        $product = Product::findOrFail($product_id);

        $client->likedProducts()->toggle($product->id);
        $isLiked = $client->likedProducts()->where('product_id', $product->id)->exists();

        // Increment/Decrement counter in product table for fast access
        $isLiked ? $product->increment('likes_count') : $product->decrement('likes_count');

        return response()->json([
            'message' => $isLiked ? 'Produit aimé' : 'J\'aime retiré',
            'is_liked' => $isLiked,
            'likes_count' => $product->likes_count
        ]);
    }
}
