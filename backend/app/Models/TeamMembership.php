<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamMembership extends Model
{
    protected $table = 'user_team_memberships';
    
    protected $fillable = ['user_id', 'team_id', 'role_id', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function team()
    {
        return $this->belongsTo(Team::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
