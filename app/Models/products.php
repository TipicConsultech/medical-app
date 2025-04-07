<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class products extends Model
{
    protected $fillable = [
        'title',
        'description',
        'price',
        'discount_percentage',
        'cutting_status',
        'manufacturer',
        'schedule_h',
        'available',
        'weight',
        'weight_type',
        'thumbnail',
        'qty',
        'mg',
        'category_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'schedule_h' => 'boolean',
        'available' => 'boolean',
        'generic' => 'boolean',
        'weight' => 'decimal:2',
        'qty' => 'integer',
        'mg' => 'integer',
    ];

    public function category()
        {
            return $this->belongsTo(Category::class);
        }

    
}

// <?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
// use Illuminate\Database\Eloquent\Model;

// class Product extends Model
// {
//     use HasFactory;

//     protected $fillable = [
//         'title',
//         'description',
//         'price',
//         'discount_percentage',
//         'cutting_status',
//         'manufacturer',
//         'schedule_h',
//         'available',
//         'weight',
//         'weight_type',
//         'thumbnail',
//         'qty',
//         'mg',
//         'category_id', // ✅ new field
//     ];

//     protected $casts = [
//         'price' => 'decimal:2',
//         'discount_percentage' => 'decimal:2',
//         'schedule_h' => 'boolean',
//         'available' => 'boolean',
//         'weight' => 'decimal:2',
//         'qty' => 'integer',
//         'mg' => 'integer',
//     ];

//     // ✅ Relationship to Category
//     public function category()
//     {
//         return $this->belongsTo(Category::class);
//     }

//     // ✅ Relationship to Product Images
//     public function images()
//     {
//         return $this->hasMany(ProductImage::class);
//     }
// }



