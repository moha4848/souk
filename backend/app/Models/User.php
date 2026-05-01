<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // superadmin, staff, vendor, client
        'status',
        'is_super_admin',
        'phone',
        'city',
        'loyalty_points',
        'bio',
        'project_type',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_super_admin' => 'boolean',
        ];
    }

    // ── RBAC Helpers ──

    public function isSuperAdmin()
    {
        return (bool)$this->is_super_admin || $this->role === 'superadmin';
    }

    public function hasPermission($permission)
    {
        if ($this->isSuperAdmin()) return true;
        // Staff inherits permissions from their team roles
        if ($this->role === 'staff' && $this->memberships) {
            foreach ($this->memberships as $membership) {
                if ($membership->role && $membership->role->permissions->contains('slug', $permission)) {
                    return true;
                }
            }
        }
        return false;
    }

    // ── Relations ──

    public function memberships()
    {
        return $this->hasMany(TeamMembership::class);
    }

    public function client()
    {
        return $this->hasOne(Client::class);
    }

    public function vendor()
    {
        return $this->hasOne(Vendor::class);
    }

    public function staffProfile()
    {
        return $this->hasOne(Staff::class);
    }

    // ── JWT ──

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role,
            'is_super_admin' => $this->is_super_admin,
            // 'store_slug' no longer here, it will be in the store model
        ];
    }


}
