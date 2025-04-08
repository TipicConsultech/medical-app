<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\products;

class cart extends Model
{
    use HasFactory;
    protected $table = 'cart';

    protected $fillable = ['id','customer_id','product_id','qty'];

    public function product()
    {
        return $this->belongsTo(Products::class, 'product_id');
    }
}
