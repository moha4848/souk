<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Support\Facades\Auth;

class SocialCommerceController extends Controller
{
    /**
     * Toggle follow/unfollow for a store.
     */
    public function followStore($store_id)
    {
        $client = Auth::user();
        $store = Vendor::findOrFail($store_id);

        if ($client->id === $store->user_id) {
            return response()->json(['message' => 'Vous ne pouvez pas vous suivre vous-meme'], 400);
        }

        $client->following()->toggle($store->id);
        $isFollowing = $client->following()->where('vendor_id', $store->id)->exists();

        return response()->json([
            'message' => $isFollowing ? 'Abonnement reussi' : 'Desabonne',
            'is_following' => $isFollowing,
            'follower_count' => $store->followers()->count(),
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

        if ($isLiked) {
            $product->increment('likes_count');
        } elseif ($product->likes_count > 0) {
            $product->decrement('likes_count');
        }

        return response()->json([
            'message' => $isLiked ? 'Produit aime' : 'J aime retire',
            'is_liked' => $isLiked,
            'likes_count' => $product->fresh()->likes_count,
        ]);
    }
}
