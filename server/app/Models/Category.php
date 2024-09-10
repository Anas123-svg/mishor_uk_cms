<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable; 
class Category extends Model
{
    use HasFactory;
    use HasApiTokens, Notifiable;


    protected $fillable = ['name'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}