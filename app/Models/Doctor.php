<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'clinic_name', 
        'speciality', 
        'education',
        'mobile', 
        'address', 
        'morning_time', 
        'evening_time', 
        'thumbnail'
    ];
}
