<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Conversation;
use App\Models\Message;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChatController extends Controller
{
    /**
     * Get all conversations for the authenticated user
     */
    public function getConversations(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = Conversation::where(function ($query) use ($userId) {
            $query->where('store_id', $userId)
                  ->orWhere('client_id', $userId);
        })
        ->with(['store:id,name,shop_name', 'client:id,name,shop_name', 'messages' => function ($query) {
            $query->latest()->limit(1);
        }])
        ->latest('last_message_at')
        ->get()
        ->map(function ($conversation) use ($userId) {
            return [
                'id' => $conversation->id,
                'store' => $conversation->store->only(['id', 'name', 'shop_name']),
                'client' => $conversation->client->only(['id', 'name', 'shop_name']),
                'subject' => $conversation->subject,
                'status' => $conversation->status,
                'last_message_at' => $conversation->last_message_at,
                'last_message' => $conversation->messages->first()?->content,
                'unread_count' => $conversation->unreadCount($userId),
                'created_at' => $conversation->created_at,
            ];
        });

        return response()->json(['success' => true, 'data' => $conversations]);
    }

    /**
     * Get a specific conversation with all messages
     */
    public function getConversation(Request $request, Conversation $conversation): JsonResponse
    {
        $userId = $request->user()->id;

        // Check authorization
        if (!in_array($userId, [$conversation->store_id, $conversation->client_id])) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $conversation->markAsRead($userId);

        $messages = $conversation->messages()
            ->with('sender:id,name,shop_name')
            ->latest()
            ->get()
            ->reverse()
            ->values();

        return response()->json([
            'success' => true,
            'data' => [
                'conversation' => [
                    'id' => $conversation->id,
                    'store' => $conversation->store->only(['id', 'name', 'shop_name']),
                    'client' => $conversation->client->only(['id', 'name', 'shop_name']),
                    'subject' => $conversation->subject,
                    'status' => $conversation->status,
                    'created_at' => $conversation->created_at,
                ],
                'messages' => $messages,
            ]
        ]);
    }

    /**
     * Create a new conversation or get existing
     */
    public function startConversation(Request $request): JsonResponse
    {
        $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'subject' => 'nullable|string|max:255',
        ]);

        $userId = $request->user()->id;
        $recipientId = $request->recipient_id;

        // Find existing conversation
        $conversation = Conversation::where(function ($query) use ($userId, $recipientId) {
            $query->where('store_id', $userId)
                  ->where('client_id', $recipientId);
        })->orWhere(function ($query) use ($userId, $recipientId) {
            $query->where('store_id', $recipientId)
                  ->where('client_id', $userId);
        })->first();

        // Create new conversation if not exists
        if (!$conversation) {
            $conversation = Conversation::create([
                'store_id' => $userId,
                'client_id' => $recipientId,
                'subject' => $request->subject ?? 'New Conversation',
            ]);
        }

        return response()->json(['success' => true, 'data' => $conversation], 201);
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request, Conversation $conversation): JsonResponse
    {
        $request->validate([
            'content' => 'required|string|max:5000',
            'image_url' => 'nullable|url',
        ]);

        $userId = $request->user()->id;

        // Check authorization
        if (!in_array($userId, [$conversation->store_id, $conversation->client_id])) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $message = $conversation->messages()->create([
            'sender_id' => $userId,
            'content' => $request->content,
            'image_url' => $request->image_url,
        ]);

        // Update conversation last message time
        $conversation->update(['last_message_at' => now()]);

        // Create notification for recipient
        $recipientId = $userId === $conversation->store_id 
            ? $conversation->client_id 
            : $conversation->store_id;

        $sender = $request->user();
        Notification::createFromEvent(
            Notification::TYPE_MESSAGE,
            $recipientId,
            'New Message',
            "{$sender->name} sent you a message",
            ['conversation_id' => $conversation->id, 'message_id' => $message->id]
        );

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $message->id,
                'sender_id' => $message->sender_id,
                'content' => $message->content,
                'image_url' => $message->image_url,
                'created_at' => $message->created_at,
            ]
        ], 201);
    }

    /**
     * Mark conversation as read
     */
    public function markAsRead(Request $request, Conversation $conversation): JsonResponse
    {
        $userId = $request->user()->id;

        if (!in_array($userId, [$conversation->store_id, $conversation->client_id])) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $conversation->markAsRead($userId);

        return response()->json(['success' => true]);
    }

    /**
     * Close or archive conversation
     */
    public function updateConversation(Request $request, Conversation $conversation): JsonResponse
    {
        $request->validate([
            'status' => 'required|in:active,archived,closed',
        ]);

        $userId = $request->user()->id;

        if (!in_array($userId, [$conversation->store_id, $conversation->client_id])) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $conversation->update(['status' => $request->status]);

        return response()->json(['success' => true, 'data' => $conversation]);
    }

    /**
     * Get unread message count for current user
     */
    public function getUnreadCount(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $unreadCount = Conversation::where(function ($query) use ($userId) {
            $query->where('store_id', $userId)
                  ->orWhere('client_id', $userId);
        })->withCount(['messages' => function ($query) use ($userId) {
            $query->whereNull('read_at')
                  ->where('sender_id', '!=', $userId);
        }])->get()->sum('messages_count');

        return response()->json(['success' => true, 'data' => ['unread_count' => $unreadCount]]);
    }
}
