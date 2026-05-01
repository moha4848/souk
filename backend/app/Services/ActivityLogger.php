<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    /**
     * Log a platform action.
     *
     * @param string $action
     * @param string|null $entityType
     * @param int|null $entityId
     * @param array $metadata
     * @return void
     */
    public static function log(string $action, ?string $entityType = null, ?int $entityId = null, array $metadata = [])
    {
        $user = Auth::user();
        
        // Get primary membership for logging team context
        $teamId = $user ? $user->memberships()->first()?->team_id : null;

        ActivityLog::create([
            'user_id' => $user?->id,
            'team_id' => $teamId,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'metadata' => $metadata,
        ]);
    }
}
