<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    protected $fillable = ['name', 'type', 'description'];

    public function memberships()
    {
        return $this->hasMany(TeamMembership::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'user_team_memberships')
                    ->withPivot('role_id', 'status')
                    ->withTimestamps();
    }

    public function roles()
    {
        return $this->hasMany(Role::class);
    }

    public function supervisor()
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }
}
