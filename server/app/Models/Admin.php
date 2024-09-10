<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    use HasApiTokens, Notifiable;
    use Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'role', 'permissions', 'profile_pic'
    ];

    protected $casts = [
        'permissions' => 'array',
    ];

    protected $hidden = [
        'password',
    ];
}
