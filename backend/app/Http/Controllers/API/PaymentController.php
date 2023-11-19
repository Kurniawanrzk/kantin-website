<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Checkout;
use App\Models\paymentMethod;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct()
    {
        $this->middleware("auth:api");
    }

    public function get_payment_method()
    {
        return response(paymentMethod::all(), 200);
    }

    public function upload_bukti($checkout_id, Request $req) {
        if($req->hasFile("bukti_image_file")) {
            $image = $req->file("bukti_image_file");
            $imageName = auth()->user()->name . '_' . date("d-m-y") . '_'.$checkout_id.'_' . '.'. $image->getClientOriginalExtension();
           $s =  $image->move(public_path('uploads/bukti_pembayaran'), $imageName);
        
           $checkout = Checkout::where("checkout_id", $checkout_id)->first();
           $checkout->update([
               "img_transaction" => $imageName ,
               "status" => "Process"
           ]);
           return response($checkout);
        }
    }
}
