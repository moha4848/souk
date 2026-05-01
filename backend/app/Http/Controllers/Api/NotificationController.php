<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function getNotifications(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $notifications = Notification::where('user_id', $userId)
            ->latest()
            ->paginate(20);

        return response()->json(['success' => true, 'data' => $notifications]);
    }

    /**
     * Get unread notifications only
     */
    public function getUnreadNotifications(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $notifications = Notification::where('user_id', $userId)
            ->where('is_read', false)
            ->latest()
            ->get();

        return response()->json(['success' => true, 'data' => $notifications]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $notification->markAsRead();

        return response()->json(['success' => true, 'data' => $notification]);
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json(['success' => true]);
    }

    /**
     * Delete a notification
     */
    public function delete(Request $request, Notification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 403);
        }

        $notification->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Delete all read notifications
     */
    public function deleteReadNotifications(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', true)
            ->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Get notification count by type
     */
    public function getNotificationStats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $stats = Notification::where('user_id', $userId)
            ->selectRaw('type, COUNT(*) as count, SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread')
            ->groupBy('type')
            ->get()
            ->keyBy('type');

        return response()->json(['success' => true, 'data' => $stats]);
    }
}
