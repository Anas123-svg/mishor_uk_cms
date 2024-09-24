<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

// app/Models/Order.php
class Order extends Model
{
    protected $fillable = [
        'user_id', 'name', 'phone', 'address', 'city', 'postalCode', 
        'country', 'status', 'paymentMethod', 'subTotal', 
        'delivery', 'total', 'email'
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
