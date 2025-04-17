<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Address;

class PreOrder extends Model
{
    use HasFactory;
    protected $table = 'preorder';
 
    protected $fillable = [
        'customer_id',
        'prescription_path',
        'schedule_h',
        'payment_type',
        'address_id',
        'status'
    ];

    protected $casts = [
        'schedule_h' => 'boolean',
        'payment_type' => 'integer',
    ];

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function address()
    {
        return $this->belongsTo(Address::class, 'address_id');
    }

}
