<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable; 

class ProductImage extends Model
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'product_id', 'image_path'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}