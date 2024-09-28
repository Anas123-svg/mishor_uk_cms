<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens; 
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    use  HasFactory;

    protected $fillable = [
        'name', 
        'email', 
        'phone', 
        'address', 
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'reset_code_expires_at' => 'datetime',

    ];


    
    public function wishlists()
    {
        return $this->hasMany(Wishlist::class);
    }

    // Define the relationship with Cart
    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function show()
    {
        $user = Auth::user()->load(['wishlists.product', 'carts.product']);
        return response()->json($user);
    }
    
    public function showById($id)
    {
        $user = User::with(['wishlists.product', 'carts.product'])->findOrFail($id);
        return response()->json($user);
    }
    
}

