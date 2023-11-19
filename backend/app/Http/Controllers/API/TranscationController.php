<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\{TransactionModel, ProductModel, ProductType, Checkout};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Validator, DB, Storage};

class TranscationController extends Controller
{
   public function __construct()
   {
    $this->middleware('auth:api');

   }
   public function create_transaction(Request $req)
   {
    $checkout = new Checkout;
    $checkout->fill(["user_id" => auth()->user()->user_id]);
    $checkout->save();
    // transaksi harus dalam bentuk array
    $transaction_data = $req->data_transaction;
    for($i = 0; $i < count($transaction_data); $i++) {
        $selled_product = new TransactionModel;
        $selled_product->fill([
            "user_id" => auth()->user()->user_id,
            "checkout_id" =>$checkout->checkout_id,
            "product_id" => $transaction_data[$i]["product_id"],
            "qty" => $transaction_data[$i]["qty"],
            "overall_price" => ProductModel::where("product_id", $transaction_data[$i]["product_id"])->first()->price * $transaction_data[$i]["qty"]
        ]);
        $selled_product->save();
        
    } 
    return response()
    ->json([
        "Message" => "Product successfuly added",
        "Selled_product" => $selled_product,
        "Status" => true
    ], 200);
   }

   public function get_all_transaction(Request $req) {
    // $data_transaction = TransactionModel::where("user_id", auth()->user()->user_id)->get();
    // for($i = 0; $i < count($data_transaction); $i++) {
    //     $data_transaction[$i]->product = ProductModel::where("product_id", $data_transaction[$i]["product_id"])->first();
    //     $data_transaction[$i]["product"]->product_image = asset('uploads/product_image/'. $data_transaction[$i]["product"]->product_image);
    //     $data_transaction[$i]["product"]->product_type = ProductType::where("product_type_id",  $data_transaction[$i]["product"]->product_type_id)->first()->product_type;
    // }

    $checkout = Checkout::where("user_id", auth()->user()->user_id)->orderBy("checkout_id")->get();
    $new = [];
    foreach($checkout as $data) {
        $new[] = [
            "checkout_id" => $data["checkout_id"],
            "status" => $data["status"],
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
            "img_transaction" => $data["img_transaction"] !== "None" ? asset("uploads/bukti_pembayaran/" .  $data["img_transaction"]) : $data["img_transaction"] ,
            "message" => $data["message"]
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

   public function delete_transaction_id($checkout_id) {
    $checkout = Checkout::where("checkout_id", $checkout_id)->first();

    if (!$checkout) {
        return response()->json(['message' => 'Checkout not found'], 404);
    }

    if($checkout->img_transaction !== "None") {
        $filePath = public_path("uploads/bukti_pembayaran/" . $checkout->img_transaction);
        unlink($filePath);

    }


    if (Checkout::destroy($checkout_id)) {
        unlink($filePath);
        return response()->json(['message' => 'deleted successfully']);
    } else {
        return response()->json(['message' => 'Not deleted'], 404);
    }
}


   public function get_struk($checkout_id) {
    $data = Checkout::where("user_id", auth()->user()->user_id)->where("checkout_id", $checkout_id)->first();
    if($data->status == "Unpaid") return response()->json([ "Message" => "Belum Mengirimkan bukti pembayaran" ], 400);
    else
        $new = [
            "checkout_id" => $data["checkout_id"],
            "status" => $data["status"],
            "transaction" => TransactionModel::where("checkout_id", $data["checkout_id"])->get()->map(function($data) {
                return [
                    "transaction_id" => $data["transaction_id"],
                    "product" => ProductModel::where("product_id", $data["product_id"])->get()
                ];
            }),
            "price" =>  TransactionModel::where("checkout_id", $data["checkout_id"])->sum(DB::raw('COALESCE(overall_price, 0)')),
            "transaction_date" => $data["date_transaction"],
            "img_transaction" => $data["img_transaction"],
            "buyer" => auth()->user()
           
        ];    
    
    return response()->json($new);
   }


}
