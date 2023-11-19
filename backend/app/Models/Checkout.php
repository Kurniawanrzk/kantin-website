<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Checkout extends Model
{
    use HasFactory;
    protected $table = "tb_checkout";
    protected $primaryKey = "checkout_id";
    protected $fillable = ["user_id", "status", "img_transaction", "message"];

    public $timestamps = false; 
}
