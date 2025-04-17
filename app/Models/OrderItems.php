<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\products;
use App\Models\User;
use App\Models\PreOrder;

class OrderItems extends Model
{
    use HasFactory;
    protected $table = 'order_items';

    protected $fillable = [
        'customer_id',
        'product_id',
        'order_id',
        'qty', 
    ];

    // Relationships

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function product()
    {
        return $this->belongsTo(products::class, 'product_id');
    }

    public function order()
    {
        return $this->belongsTo(PreOrder::class, 'order_id');
    }
}
