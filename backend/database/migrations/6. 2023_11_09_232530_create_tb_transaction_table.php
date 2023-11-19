<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tb_transaction', function (Blueprint $table) {
            $table->id("transaction_id");

            $table->foreignId("user_id")
            ->references("user_id")
            ->on("tb_users")
            ->onDelete("cascade")
            ->onUpdate("cascade");

            $table->foreignId("product_id")
            ->references("product_id")
            ->on("tb_product")
            ->onDelete("cascade")
            ->onUpdate("cascade");
            $table->string("overall_price");
            $table->integer("qty");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tb_transaction');
    }
};
