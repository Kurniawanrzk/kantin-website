<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SelledProduct extends Model
{
    use HasFactory;
    protected $table = 'tb_selled_product';
    protected $primaryKey = "selled_product_id";
    protected $fillable = [
        "product_id",
        "stok"
    ];
}
