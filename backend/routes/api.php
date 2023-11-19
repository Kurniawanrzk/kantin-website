<?php

use App\Http\Controllers\API\{AdminController, AuthController, ProductController, TranscationController, PaymentController};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::prefix("v1")->group(function() {
      Route::controller(AuthController::class)->group(function() {
         Route::post("/auth/login", "login");
         Route::post("/auth/register", "register");
         Route::post("/auth/me", "me");
         Route::post("/auth/logout", "logout");
      });

      Route::controller(ProductController::class)->group(function() {
         Route::post("/product", "create_product")->middleware("admin_level");
         Route::delete("/product/{id}", "delete_product")->middleware("admin_level");
         Route::get("/product", "get_all_product");
      });

      Route::controller(TranscationController::class)->group(function() {
         Route::post("/transaction", "create_transaction");
         Route::get("/transaction", "get_all_transaction");
         Route::delete("/transaction/{id}", "delete_transaction_id");
         Route::get("/struk/{checkout_id}", "get_struk");
      });

      Route::controller(PaymentController::class)->group(function() {
         Route::get("/payment", "get_payment_method");
         Route::post("/payment/bukti/{checkout_id}", "upload_bukti");

      });

      Route::controller(AdminController::class)->group(function() {
         Route::get("/admin/transaction", "get_all_user_transaction");
         Route::post("/admin/transaction/{checkout_id}", "edit_status");
      });

});