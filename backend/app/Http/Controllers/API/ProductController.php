<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\{ProductModel, ProductType};

class ProductController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['get_product_by_id', 'get_all_product']]);
    }

    public function get_all_product() // all type of user can get all the product
    {
       $all_product = ProductModel::all();
       for($i = 0; $i < count($all_product); $i++) {
        $all_product[$i]->product_image = asset('uploads/product_image/'. $all_product[$i]->product_image);
        $all_product[$i]->product_type = ProductType::where("product_type_id",  $all_product[$i]->product_type_id)->first()->product_type;
        unset($all_product[$i]->product_type_id);
       }
       return count($all_product) >= 1 ? 
       $all_product : 
       response()->json([ "Message" => "No product" ], 200);
    }

    public function create_product(Request $req) // only admin can create product, DO NOT FORGET CREATE MIDDLEWARE FOR ADMIN ONLY 
    {
        $validator = Validator::make($req->all(), [
            "product_name" => "required",
            "price" => "required",
            "product_type_id" => "required"
        ]);

        if($validator->fails()) {
            return response()
            ->json([
                "Message" => "Isi field body dengan benar!",
                "Status" => False
            ],400);
        } 
            $imageName= null;
            if($req->hasFile("product_image_file")) {
                $image = $req->file("product_image_file");
                $imageName = $req->product_name. '_'.$req->price . '.' . $image->getClientOriginalExtension();
               $s =  $image->move(public_path('uploads/product_image'), $imageName);
            }
       
            $product = new ProductModel;
            $req->merge([ "product_image"=> $imageName ]);
            $product->fill($req->all());
            $product->save();
            return response()
            ->json([
                "Message" => "Product successfully created",
                "Status" => true,
                "product" => $product
            ], 200) ;       
        
      

    }

    public function create_product_type(Request $req) 
    {

    }

    public function update_product() // only admin can update product
    {

    }

    public function delete_product($id) // only admin can delete product
    {
        $product = ProductModel::destroy($id);
        return $product ? response()->json(["Message" => "Product deleted", "Status" => true], 200) : response()->json(["Message" => "Id not found", "Status" => false], 400);
    }
    

    public function get_product_by_id() // all type of user can get the product by id
    {

    }
}
