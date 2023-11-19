<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransactionModel extends Model
{
    use HasFactory;
    protected $table = "tb_transaction";
    protected $primaryKey = "transaction_id";
    protected $fillable = [
        "user_id",
        "product_id",
        "qty",
        "overall_price",
        "checkout_id",
        "transaction_date"
    ];
}

