<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class paymentMethod extends Model
{
    use HasFactory;
    protected $table = "tb_payment_method";
    protected $primaryKey = "payment_method_id";
    protected $fillable = [
        "method",
        "rek",
        "supported_image"
    ];
}
