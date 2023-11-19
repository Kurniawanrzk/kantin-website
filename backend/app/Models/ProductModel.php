<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductModel extends Model
{
    use HasFactory;
    protected $table = "tb_product";
    protected $primaryKey = "product_id";
    protected $fillable = [
        "product_name",
        "product_image",
        "price",
        "product_stok",
        "product_type_id"
    ];
}
