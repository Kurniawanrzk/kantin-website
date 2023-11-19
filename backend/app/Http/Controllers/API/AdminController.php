<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Middleware\AdminLevel;
use App\Models\{Checkout, TransactionModel,User, ProductModel};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
        $this->middleware(AdminLevel::class);

    }

    public function get_all_user_transaction(Request $req)
    {
        $new = [];
        $checkout = $req->search
        ? Checkout::where('status', 'like', '%' . ucfirst(strtolower($req->search)) . '%')
            ->orWhere('img_transaction', 'like', '%' . ucfirst(strtolower($req->search)) . '%')
            ->orWhere('checkout_id', 'like', '%' . $req->search . '%')
            ->get()
        : Checkout::all();



        foreach($checkout as $data) {
            $new[] = [
                "checkout_id" => $data["checkout_id"],
                "status" => $data["status"],
                "user" => User::where("user_id", $data["user_id"])->first(),
                "transaction" => TransactionModel::where("checkout_id", $data["checkout_id"])->get()->map(function($data) {
                    return [
                        "transaction_id" => $data["transaction_id"],
                        "product" => ProductModel::where("product_id", $data["product_id"])->first()->product_name,
                        "product_price" => ProductModel::where("product_id", $data["product_id"])->first()->price,
                        "product_image" => ProductModel::where("product_id", $data["product_id"])->first()->product_image =
                        asset("uploads/product_image/". ProductModel::where("product_id", $data["product_id"])->first()->product_image),
                        "qty" => $data["qty"],
                        "overall_price" => $data["overall_price"],
                        "transaction_date" => $data["transaction_date"]
                    ];
                }),
                "price" =>  TransactionModel::where("checkout_id", $data["checkout_id"])->sum(DB::raw('COALESCE(overall_price, 0)')),
                "transaction_date" => $data["date_transaction"],
                "img_transaction" => $data["img_transaction"] !== "None"
                ? asset("uploads/bukti_pembayaran/" .  $data["img_transaction"]) : $data["img_transaction"] ,
            ];
        }
        if($new) {
            return response()->json($new);
        } else {
            return response()->json([
                "message" => "No data entries",
                "status" => false
            ], 200);
        }
    }

    public function edit_status($checkout_id, Request $req)
    {
        $checkout = Checkout::where("checkout_id", $checkout_id)->first();
        $checkout->update([
            "status" => $req->status,
            "message" => $req->message
        ]);

        return response()
        ->json([
            "Message" => "Status berhasil terupdate",
        ], 200);
    }


}
