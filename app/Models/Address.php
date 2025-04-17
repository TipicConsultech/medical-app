<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Address extends Model
{
    use HasFactory;
    protected $table = 'address';

    protected $fillable = [
        'customer_id',
        'address_line1',
        'address_line2',
        'city',
        'state',
        'postal_code',
        'country',
        'landmark',
        'latitude',
        'longitude',
        'address_type',
    ];
    public function user()
{
    return $this->belongsTo(User::class, 'customer_id', 'id');
}
}
