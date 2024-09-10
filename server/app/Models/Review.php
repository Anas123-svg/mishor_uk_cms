<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable; 

class Review extends Model
{
    use HasApiTokens, Notifiable;

    use HasFactory;

    protected $fillable = [
        'product_id',
        'user_id',
        'title',
        'reviewer_name',
        'review',
        'rating',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
