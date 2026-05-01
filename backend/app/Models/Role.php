<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    protected $fillable = ['name', 'description', 'team_id', 'scope'];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permission');
    }

    public function memberships()
    {
        return $this->hasMany(TeamMembership::class);
    }
}
