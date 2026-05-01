<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    public const TYPE_MESSAGE = 'message';
    public const TYPE_ORDER = 'order';
    public const TYPE_SYSTEM = 'system';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'read_at',
    ];

    protected $casts = [
        'data' => 'array',
        'read_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function createFromEvent($type, $userId, $title, $message, $data = [])
    {
        return self::create([
            'type' => $type,
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public function markAsRead()
    {
        if (is_null($this->read_at)) {
            $this->read_at = now();
            $this->save();
        }
    }
}
